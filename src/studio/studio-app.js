import {
  buildProjectDraftFromStudioDocument,
  createStudioBlockInstance,
} from './studio-document.js';
import {
  clientPointToPlacement,
  findNextOpenPlacement,
  normalizeDesktopPlacement,
  renderStudioCanvas,
  resolveDesktopCollisions,
} from './studio-canvas.js';

const state = {
  bootstrap: null,
  document: null,
  currentProjectId: null,
  previewSessionId: crypto.randomUUID(),
  previewSize: 'desktop',
  previewTimer: null,
  editing: null,
  paletteDrag: null,
  canvasInteraction: null,
};

const elements = {
  status: document.getElementById('studio-status'),
  docId: document.getElementById('studio-doc-id'),
  projectLabel: document.getElementById('studio-project-label'),
  presetSelect: document.getElementById('preset-select'),
  createProjectBtn: document.getElementById('create-project-btn'),
  duplicateProjectBtn: document.getElementById('duplicate-project-btn'),
  projectList: document.getElementById('project-list'),
  paletteList: document.getElementById('palette-list'),
  saveProjectBtn: document.getElementById('save-project-btn'),
  reloadProjectBtn: document.getElementById('reload-project-btn'),
  openProjectBtn: document.getElementById('open-project-btn'),
  localeToggle: document.getElementById('locale-toggle'),
  previewModeToggle: document.getElementById('preview-mode-toggle'),
  previewSizeToggle: document.getElementById('preview-size-toggle'),
  canvasStage: document.getElementById('canvas-stage'),
  previewStage: document.getElementById('preview-stage'),
  canvas: document.getElementById('studio-canvas'),
  canvasEmpty: document.getElementById('canvas-empty'),
  previewViewport: document.getElementById('preview-viewport'),
  previewFrame: document.getElementById('preview-frame'),
  projectInspector: document.getElementById('project-inspector'),
  blockInspector: document.getElementById('block-inspector'),
  activeLocaleLabel: document.getElementById('active-locale-label'),
  selectedBlockLabel: document.getElementById('selected-block-label'),
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setStatus(message, mode = '') {
  elements.status.textContent = message;
  elements.status.className = `status${mode ? ` ${mode}` : ''}`;
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function studioApi(url, options = {}) {
  return api(`/__studio${url}`, options);
}

function currentLocale() {
  return state.document?.ui?.locale || 'fr';
}

function currentPreviewMode() {
  return state.document?.ui?.previewMode || 'canvas';
}

function localizedValue(value, locale = currentLocale()) {
  if (typeof value === 'string') return value;
  return value?.[locale] || value?.fr || value?.en || '';
}

function parsePath(path) {
  return String(path || '')
    .split('.')
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

function getAtPath(target, path) {
  return parsePath(path).reduce((value, segment) => value?.[segment], target);
}

function setAtPath(target, path, value) {
  const parts = parsePath(path);
  if (!parts.length) return;
  let cursor = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const nextPart = parts[index + 1];
    if (cursor[part] === undefined) {
      cursor[part] = typeof nextPart === 'number' ? [] : {};
    }
    cursor = cursor[part];
  }
  cursor[parts[parts.length - 1]] = value;
}

function ensureLocalizedTarget(target, path) {
  const value = getAtPath(target, path);
  if (typeof value === 'string' || value === undefined) {
    setAtPath(target, path, {
      fr: typeof value === 'string' ? value : '',
      en: typeof value === 'string' ? value : '',
    });
  }
}

function getSelectedBlock() {
  if (!state.document) return null;
  return state.document.blocks.find((block) => block.id === state.document.ui.selectedBlockId) || null;
}

function updateDocument(mutator, previewReason = 'edit') {
  if (!state.document) return;
  mutator(state.document);
  renderAll();
  if (previewReason !== 'none') {
    schedulePreviewSync(previewReason);
  }
}

function updateSelectedBlock(mutator, previewReason = 'edit') {
  updateDocument((document) => {
    const block = document.blocks.find((entry) => entry.id === document.ui.selectedBlockId);
    if (!block) return;
    mutator(block, document);
  }, previewReason);
}

function createBlockId(type) {
  const ids = new Set((state.document?.blocks || []).map((block) => block.id));
  let index = 1;
  while (ids.has(`${type}-${index}`)) index += 1;
  return `${type}-${index}`;
}

function defaultArrayItemFor(blockType, path) {
  if (blockType === 'stats' && path === 'content.items') {
    return { value: '', label: { fr: 'STAT', en: 'STAT' } };
  }
  if (blockType === 'process' && path === 'content.steps') {
    return { fr: 'Step', en: 'Step' };
  }
  if (blockType === 'gallery' && path === 'content.images') {
    return { src: '', alt: '' };
  }
  if (blockType === 'challenges' && path === 'content.items') {
    return {
      title: { fr: 'Challenge', en: 'Challenge' },
      description: { fr: 'Describe the challenge.', en: 'Describe the challenge.' },
    };
  }
  if (blockType === 'results' && path === 'content.items') {
    return { icon: '*', text: { fr: 'Result', en: 'Result' } };
  }
  return '';
}

function syncPreviewFrame() {
  elements.previewViewport.dataset.size = state.previewSize;
  const url = new URL(`/studio/preview?session=${encodeURIComponent(state.previewSessionId)}&lang=${currentLocale()}`, window.location.origin);
  elements.previewFrame.src = url.toString();
}

function schedulePreviewSync(reason = 'edit') {
  window.clearTimeout(state.previewTimer);
  const delay = reason === 'layout' ? 60 : reason === 'save' ? 0 : 180;
  state.previewTimer = window.setTimeout(async () => {
    if (!state.document) return;
    try {
      setStatus(reason === 'layout' ? 'Updating preview after layout change...' : 'Updating preview...');
      const draft = buildProjectDraftFromStudioDocument(state.document);
      await api('/api/studio-preview.json', {
        method: 'POST',
        body: JSON.stringify({
          session: state.previewSessionId,
          draft,
        }),
      });
      const url = new URL(`/studio/preview?session=${encodeURIComponent(state.previewSessionId)}&lang=${currentLocale()}&t=${Date.now()}`, window.location.origin);
      elements.previewFrame.src = url.toString();
      setStatus('Preview synced', 'ok');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Preview sync failed', 'error');
    }
  }, delay);
}

function renderSegmented(container, activeValue, attributeName) {
  Array.from(container.querySelectorAll('button')).forEach((button) => {
    button.classList.toggle('is-active', button.dataset[attributeName] === activeValue);
  });
}

function renderProjectList() {
  elements.projectList.innerHTML = '';
  (state.bootstrap?.projects || []).forEach((project) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `project-item${project.id === state.currentProjectId ? ' active' : ''}`;
    button.dataset.projectId = project.id;
    const title = typeof project.title === 'string' ? project.title : project.title?.fr || project.slug;
    button.innerHTML = `
      <span class="project-item-title">${escapeHtml(title)}</span>
      <span class="mono">${escapeHtml(project.id)}</span>
    `;
    elements.projectList.appendChild(button);
  });
}

function renderPresetSelect() {
  elements.presetSelect.innerHTML = '';
  (state.bootstrap?.presets || []).forEach((preset) => {
    const option = document.createElement('option');
    option.value = preset.key;
    option.textContent = `${preset.label} - ${preset.description}`;
    elements.presetSelect.appendChild(option);
  });
}

function renderPalette() {
  const existingTypes = new Set((state.document?.blocks || []).map((block) => block.type));
  elements.paletteList.innerHTML = '';

  (state.bootstrap?.palette || []).forEach((item) => {
    const disabled = existingTypes.has(item.type);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `palette-item${disabled ? ' disabled' : ''}`;
    button.dataset.blockType = item.type;
    button.disabled = disabled;
    button.innerHTML = `
      <span class="palette-item-title">${escapeHtml(item.label)}</span>
      <span class="mono">min ${item.constraints?.minW || 1}x${item.constraints?.minH || 1}</span>
    `;
    elements.paletteList.appendChild(button);
  });
}

function renderProjectHeader() {
  const title = localizedValue(state.document?.meta?.title, currentLocale()) || 'Untitled project';
  elements.projectLabel.textContent = title;
  elements.docId.textContent = state.currentProjectId || `${state.document?.folder || '3_tech'}/${state.document?.slug || 'new_project'}.md`;
  elements.activeLocaleLabel.textContent = `Locale ${currentLocale().toUpperCase()}`;
}

function renderCanvas() {
  if (!state.document) return;
  renderStudioCanvas(elements.canvas, state.document, {
    locale: currentLocale(),
    selectedBlockId: state.document.ui.selectedBlockId,
    editing: state.editing,
  });
  elements.canvasEmpty.classList.toggle('is-visible', !state.document.blocks.length);
}

function field(label, control) {
  return `<label class="field"><span>${label}</span>${control}</label>`;
}

function textInput({ label, value, path, localized = false, scope = 'meta', type = 'text', blockId = '', wide = false }) {
  const attr = scope === 'meta' ? 'data-meta-path' : 'data-block-path';
  const idAttr = scope === 'block' ? `data-block-id="${blockId}"` : '';
  const localizedAttr = localized ? 'data-localized="true"' : '';
  return `<div${wide ? ' style="grid-column: 1 / -1;"' : ''}>${field(
    label,
    `<input type="${type}" ${attr}="${path}" ${idAttr} ${localizedAttr} value="${escapeHtml(value || '')}" />`,
  )}</div>`;
}

function textareaInput({ label, value, path, localized = false, scope = 'meta', blockId = '', wide = true }) {
  const attr = scope === 'meta' ? 'data-meta-path' : 'data-block-path';
  const idAttr = scope === 'block' ? `data-block-id="${blockId}"` : '';
  const localizedAttr = localized ? 'data-localized="true"' : '';
  return `<div${wide ? ' style="grid-column: 1 / -1;"' : ''}>${field(
    label,
    `<textarea ${attr}="${path}" ${idAttr} ${localizedAttr}>${escapeHtml(value || '')}</textarea>`,
  )}</div>`;
}

function selectInput({ label, value, path, options, scope = 'meta', blockId = '' }) {
  const attr = scope === 'meta' ? 'data-meta-path' : 'data-block-path';
  const idAttr = scope === 'block' ? `data-block-id="${blockId}"` : '';
  const optionsHtml = options
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === value ? ' selected' : ''}>${escapeHtml(option.label)}</option>`)
    .join('');
  return field(label, `<select ${attr}="${path}" ${idAttr}>${optionsHtml}</select>`);
}

function checkboxInput({ label, checked, path, scope = 'block', blockId = '' }) {
  const attr = scope === 'meta' ? 'data-meta-path' : 'data-block-path';
  const idAttr = scope === 'block' ? `data-block-id="${blockId}"` : '';
  return field(label, `<input type="checkbox" ${attr}="${path}" ${idAttr} data-checkbox="true"${checked ? ' checked' : ''} />`);
}

function renderProjectInspector() {
  if (!state.document) {
    elements.projectInspector.innerHTML = '<div class="soft-note">Load a project to edit its metadata.</div>';
    return;
  }

  const meta = state.document.meta;
  const locale = currentLocale();
  const localeLabel = locale.toUpperCase();
  const domains = (state.bootstrap?.domains || []).map((folder) => ({ value: folder, label: folder }));

  elements.projectInspector.innerHTML = `
    <div class="field-grid two">
      ${textInput({ label: 'Slug', value: state.document.slug, path: 'slug' })}
      <div>${selectInput({ label: 'Domain folder', value: state.document.folder, path: 'folder', options: domains })}</div>
      <div>${selectInput({ label: 'Status', value: meta.status, path: 'meta.status', options: [
        { value: 'planned', label: 'planned' },
        { value: 'in-progress', label: 'in-progress' },
        { value: 'completed', label: 'completed' },
      ] })}</div>
      ${textInput({ label: 'Date', value: meta.date, path: 'meta.date', type: 'date' })}
      ${textInput({ label: `Title (${localeLabel})`, value: localizedValue(meta.title, locale), path: 'meta.title', localized: true, wide: true })}
      ${textInput({ label: `Short title (${localeLabel})`, value: localizedValue(meta.altTitle, locale), path: 'meta.altTitle', localized: true, wide: true })}
      ${textareaInput({ label: `Description (${localeLabel})`, value: localizedValue(meta.description, locale), path: 'meta.description', localized: true })}
      ${textInput({ label: 'Tech tags', value: meta.tech.join(', '), path: 'meta.tech', wide: true })}
      ${textInput({ label: 'Live link', value: meta.link, path: 'meta.link', wide: true })}
      ${textInput({ label: 'GitHub', value: meta.github, path: 'meta.github', wide: true })}
      ${textInput({ label: 'Accent color', value: meta.theme.accentColor, path: 'meta.theme.accentColor' })}
      ${textInput({ label: 'Accent dark', value: meta.theme.accentColorDark, path: 'meta.theme.accentColorDark' })}
      ${textInput({ label: 'Assets folder', value: meta.theme.assetsFolder, path: 'meta.theme.assetsFolder', wide: true })}
      <div>${selectInput({ label: 'Shell mode', value: meta.orbit.shellMode || 'auto', path: 'meta.orbit.shellMode', options: [
        { value: 'auto', label: 'auto' },
        { value: 'manual', label: 'manual' },
      ] })}</div>
      ${textInput({ label: 'Shell', value: meta.orbit.shell ?? '', path: 'meta.orbit.shell', type: 'number' })}
      ${textInput({ label: 'Order', value: meta.orbit.order ?? '', path: 'meta.orbit.order', type: 'number' })}
      <div>${selectInput({ label: 'Angle mode', value: meta.orbit.angleMode || 'auto', path: 'meta.orbit.angleMode', options: [
        { value: 'auto', label: 'auto' },
        { value: 'fixed', label: 'fixed' },
      ] })}</div>
      ${textInput({ label: 'Angle', value: meta.orbit.angle ?? '', path: 'meta.orbit.angle', type: 'number' })}
      ${textareaInput({ label: 'Body markdown', value: state.document.body, path: 'body' })}
    </div>
  `;
}

function arrayControls(blockId, path, index) {
  return `
    <div class="toolbar">
      <button class="button" type="button" data-array-action="move-up" data-block-id="${blockId}" data-array-path="${path}" data-array-index="${index}">Up</button>
      <button class="button" type="button" data-array-action="move-down" data-block-id="${blockId}" data-array-path="${path}" data-array-index="${index}">Down</button>
      <button class="button" type="button" data-array-action="remove" data-block-id="${blockId}" data-array-path="${path}" data-array-index="${index}">Remove</button>
    </div>
  `;
}

function renderStatsInspector(block, locale) {
  const items = Array.isArray(block.content?.items) ? block.content.items : [];
  return `
    <div class="stack">
      ${items.map((item, index) => `
        <div class="card" style="padding: 14px;">
          <div class="field-grid">
            ${textInput({ label: 'Value', value: item.value || '', path: `content.items.${index}.value`, scope: 'block', blockId: block.id })}
            ${textInput({ label: `Label (${locale.toUpperCase()})`, value: localizedValue(item.label, locale), path: `content.items.${index}.label`, scope: 'block', blockId: block.id, localized: true })}
          </div>
          ${arrayControls(block.id, 'content.items', index)}
        </div>
      `).join('')}
      <button class="button" type="button" data-array-action="add" data-block-id="${block.id}" data-array-path="content.items">Add stat</button>
    </div>
  `;
}

function renderProcessInspector(block, locale) {
  const steps = Array.isArray(block.content?.steps) ? block.content.steps : [];
  return `
    <div class="field-grid">
      ${textInput({ label: `Title (${locale.toUpperCase()})`, value: localizedValue(block.content?.title, locale), path: 'content.title', scope: 'block', blockId: block.id, localized: true })}
      ${textInput({ label: `Subtitle (${locale.toUpperCase()})`, value: localizedValue(block.content?.subtitle, locale), path: 'content.subtitle', scope: 'block', blockId: block.id, localized: true })}
      <div class="stack" style="grid-column: 1 / -1;">
        ${steps.map((item, index) => `
          <div class="card" style="padding: 14px;">
            ${textareaInput({ label: `Step ${index + 1} (${locale.toUpperCase()})`, value: localizedValue(item, locale), path: `content.steps.${index}`, scope: 'block', blockId: block.id, localized: true })}
            ${arrayControls(block.id, 'content.steps', index)}
          </div>
        `).join('')}
      </div>
      <button class="button" type="button" data-array-action="add" data-block-id="${block.id}" data-array-path="content.steps">Add step</button>
    </div>
  `;
}

function renderChallengesInspector(block, locale) {
  const items = Array.isArray(block.content?.items) ? block.content.items : [];
  return `
    <div class="field-grid">
      ${textInput({ label: `Title (${locale.toUpperCase()})`, value: localizedValue(block.content?.title, locale), path: 'content.title', scope: 'block', blockId: block.id, localized: true })}
      ${textInput({ label: `Subtitle (${locale.toUpperCase()})`, value: localizedValue(block.content?.subtitle, locale), path: 'content.subtitle', scope: 'block', blockId: block.id, localized: true })}
      <div class="stack" style="grid-column: 1 / -1;">
        ${items.map((item, index) => `
          <div class="card" style="padding: 14px;">
            ${textInput({ label: `Challenge title (${locale.toUpperCase()})`, value: localizedValue(item.title, locale), path: `content.items.${index}.title`, scope: 'block', blockId: block.id, localized: true })}
            ${textareaInput({ label: `Description (${locale.toUpperCase()})`, value: localizedValue(item.description, locale), path: `content.items.${index}.description`, scope: 'block', blockId: block.id, localized: true })}
            ${arrayControls(block.id, 'content.items', index)}
          </div>
        `).join('')}
      </div>
      <button class="button" type="button" data-array-action="add" data-block-id="${block.id}" data-array-path="content.items">Add challenge</button>
    </div>
  `;
}

function renderResultsInspector(block, locale) {
  const items = Array.isArray(block.content?.items) ? block.content.items : [];
  return `
    <div class="field-grid">
      ${textInput({ label: `Title (${locale.toUpperCase()})`, value: localizedValue(block.content?.title, locale), path: 'content.title', scope: 'block', blockId: block.id, localized: true })}
      ${textInput({ label: `Subtitle (${locale.toUpperCase()})`, value: localizedValue(block.content?.subtitle, locale), path: 'content.subtitle', scope: 'block', blockId: block.id, localized: true })}
      <div class="stack" style="grid-column: 1 / -1;">
        ${items.map((item, index) => `
          <div class="card" style="padding: 14px;">
            ${textInput({ label: 'Icon', value: item.icon || '', path: `content.items.${index}.icon`, scope: 'block', blockId: block.id })}
            ${textareaInput({ label: `Text (${locale.toUpperCase()})`, value: localizedValue(item.text, locale), path: `content.items.${index}.text`, scope: 'block', blockId: block.id, localized: true })}
            ${arrayControls(block.id, 'content.items', index)}
          </div>
        `).join('')}
      </div>
      <button class="button" type="button" data-array-action="add" data-block-id="${block.id}" data-array-path="content.items">Add result</button>
    </div>
  `;
}

function renderGalleryInspector(block, locale) {
  const images = Array.isArray(block.content?.images) ? block.content.images : [];
  const source = block.content?.source || 'assetsFolder';
  return `
    <div class="field-grid">
      ${textInput({ label: `Title (${locale.toUpperCase()})`, value: localizedValue(block.content?.title, locale), path: 'content.title', scope: 'block', blockId: block.id, localized: true })}
      <div>${selectInput({ label: 'Source', value: source, path: 'content.source', scope: 'block', blockId: block.id, options: [
        { value: 'assetsFolder', label: 'assetsFolder' },
        { value: 'manual', label: 'manual' },
      ] })}</div>
      ${source === 'manual' ? `
        <div class="stack" style="grid-column: 1 / -1;">
          ${images.map((image, index) => `
            <div class="card" style="padding: 14px;">
              ${textInput({ label: 'Source path', value: image.src || '', path: `content.images.${index}.src`, scope: 'block', blockId: block.id })}
              ${textInput({ label: 'Alt text', value: image.alt || '', path: `content.images.${index}.alt`, scope: 'block', blockId: block.id })}
              ${arrayControls(block.id, 'content.images', index)}
            </div>
          `).join('')}
        </div>
        <button class="button" type="button" data-array-action="add" data-block-id="${block.id}" data-array-path="content.images">Add image</button>
      ` : '<div class="soft-note" style="grid-column: 1 / -1;">Gallery images will resolve from the project assets folder.</div>'}
    </div>
  `;
}

function renderCoreInspector(block, locale) {
  switch (block.type) {
    case 'hero':
      return `
        <div class="field-grid">
          ${textInput({ label: `Subtitle (${locale.toUpperCase()})`, value: localizedValue(block.content?.subtitle, locale), path: 'content.subtitle', scope: 'block', blockId: block.id, localized: true })}
          ${textInput({ label: 'Subtitle color', value: block.content?.subtitleColor || '', path: 'content.subtitleColor', scope: 'block', blockId: block.id })}
          ${textInput({ label: 'Background image', value: block.content?.backgroundImage || '', path: 'content.backgroundImage', scope: 'block', blockId: block.id, wide: true })}
          ${textInput({ label: 'Background position', value: block.content?.backgroundPosition || '', path: 'content.backgroundPosition', scope: 'block', blockId: block.id })}
          ${textInput({ label: 'Background size', value: block.content?.backgroundSize || '', path: 'content.backgroundSize', scope: 'block', blockId: block.id })}
          ${textInput({ label: 'Background scale', value: block.content?.backgroundScale ?? '', path: 'content.backgroundScale', scope: 'block', blockId: block.id, type: 'number' })}
          ${textInput({ label: 'Overlay top opacity', value: block.content?.overlayTopOpacity ?? '', path: 'content.overlayTopOpacity', scope: 'block', blockId: block.id, type: 'number' })}
          ${textInput({ label: 'Overlay bottom opacity', value: block.content?.overlayBottomOpacity ?? '', path: 'content.overlayBottomOpacity', scope: 'block', blockId: block.id, type: 'number' })}
          ${textInput({ label: 'Logo asset', value: block.content?.logo || '', path: 'content.logo', scope: 'block', blockId: block.id, wide: true })}
          ${checkboxInput({ label: 'Show logo', checked: Boolean(block.content?.showLogo), path: 'content.showLogo', blockId: block.id })}
        </div>
      `;
    case 'stats':
      return renderStatsInspector(block, locale);
    case 'actions':
      return `
        <div class="field-grid">
          ${textInput({ label: `Title (${locale.toUpperCase()})`, value: localizedValue(block.content?.title, locale), path: 'content.title', scope: 'block', blockId: block.id, localized: true })}
          ${textInput({ label: `Primary label (${locale.toUpperCase()})`, value: localizedValue(block.content?.primary?.text, locale), path: 'content.primary.text', scope: 'block', blockId: block.id, localized: true })}
          ${textInput({ label: 'Primary URL', value: block.content?.primary?.url || '', path: 'content.primary.url', scope: 'block', blockId: block.id, wide: true })}
          ${textInput({ label: `Secondary label (${locale.toUpperCase()})`, value: localizedValue(block.content?.secondary?.text, locale), path: 'content.secondary.text', scope: 'block', blockId: block.id, localized: true })}
          ${textInput({ label: 'Secondary URL', value: block.content?.secondary?.url || '', path: 'content.secondary.url', scope: 'block', blockId: block.id, wide: true })}
        </div>
      `;
    case 'tech':
      return `
        <div class="field-grid">
          ${textInput({ label: `Title (${locale.toUpperCase()})`, value: localizedValue(block.content?.title, locale), path: 'content.title', scope: 'block', blockId: block.id, localized: true })}
          <div class="soft-note">Technology pills come from the project tech tags above.</div>
        </div>
      `;
    case 'process':
      return renderProcessInspector(block, locale);
    case 'gallery':
      return renderGalleryInspector(block, locale);
    case 'challenges':
      return renderChallengesInspector(block, locale);
    case 'results':
      return renderResultsInspector(block, locale);
    default:
      return '<div class="soft-note">This block has no editable inspector.</div>';
  }
}

function renderBlockInspector() {
  const block = getSelectedBlock();
  const locale = currentLocale();
  if (!block) {
    elements.selectedBlockLabel.textContent = 'No selection';
    elements.blockInspector.innerHTML = '<div class="soft-note">Select a block on the canvas to edit its settings.</div>';
    return;
  }

  elements.selectedBlockLabel.textContent = `${block.label} (${block.kind})`;

  const body = block.kind === 'legacy'
    ? `
      <div class="soft-note">Legacy media blocks can move, resize, enable, disable, and round-trip. Content editing stays limited in this first release.</div>
      <div class="soft-note"><pre style="margin:0; white-space:pre-wrap; font-family:Consolas, monospace;">${escapeHtml(JSON.stringify(block.content || {}, null, 2))}</pre></div>
    `
    : renderCoreInspector(block, locale);

  elements.blockInspector.innerHTML = `
    <div class="field-grid two">
      ${checkboxInput({ label: 'Enabled', checked: block.enabled !== false, path: 'enabled', blockId: block.id })}
      ${textInput({ label: 'Variant', value: block.variant || 'default', path: 'variant', scope: 'block', blockId: block.id })}
      ${textInput({ label: 'Grid X', value: block.placement.desktop.x, path: 'placement.desktop.x', scope: 'block', blockId: block.id, type: 'number' })}
      ${textInput({ label: 'Grid Y', value: block.placement.desktop.y, path: 'placement.desktop.y', scope: 'block', blockId: block.id, type: 'number' })}
      ${textInput({ label: 'Width', value: block.placement.desktop.w, path: 'placement.desktop.w', scope: 'block', blockId: block.id, type: 'number' })}
      ${textInput({ label: 'Height', value: block.placement.desktop.h, path: 'placement.desktop.h', scope: 'block', blockId: block.id, type: 'number' })}
    </div>
    ${body}
  `;
}

function renderAll() {
  renderProjectList();
  renderPalette();
  renderProjectHeader();
  renderSegmented(elements.localeToggle, currentLocale(), 'locale');
  renderSegmented(elements.previewModeToggle, currentPreviewMode(), 'mode');
  renderSegmented(elements.previewSizeToggle, state.previewSize, 'previewSize');
  elements.canvasStage.classList.toggle('is-active', currentPreviewMode() === 'canvas');
  elements.previewStage.classList.toggle('is-active', currentPreviewMode() === 'preview');
  renderCanvas();
  renderProjectInspector();
  renderBlockInspector();
  elements.openProjectBtn.disabled = !state.document;
}

function selectBlock(blockId) {
  updateDocument((document) => {
    document.ui.selectedBlockId = blockId;
  }, 'none');
}

function setEditing(payload) {
  state.editing = payload;
  renderCanvas();
  requestAnimationFrame(() => {
    const selector = payload
      ? `[data-inline-editor="true"][data-inline-scope="${payload.scope}"][data-inline-path="${payload.path}"]${payload.blockId ? `[data-inline-block-id="${payload.blockId}"]` : ''}`
      : null;
    const input = selector ? elements.canvas.querySelector(selector) : null;
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      input.focus();
      const end = input.value.length;
      input.setSelectionRange?.(end, end);
    }
  });
}

function commitInlineEdit(editor) {
  if (!state.document || !editor) return;
  const scope = editor.dataset.inlineScope;
  const path = editor.dataset.inlinePath;
  const blockId = editor.dataset.inlineBlockId;
  const localized = editor.dataset.inlineLocalized === 'true';
  const value = editor.value;
  state.editing = null;

  updateDocument((document) => {
    if (scope === 'meta') {
      if (localized) {
        ensureLocalizedTarget(document, path);
        const existing = getAtPath(document, path);
        existing[currentLocale()] = value;
      } else {
        setAtPath(document, path, value);
      }
      return;
    }

    const block = document.blocks.find((entry) => entry.id === blockId);
    if (!block) return;
    if (localized) {
      ensureLocalizedTarget(block, path);
      const existing = getAtPath(block, path);
      existing[currentLocale()] = value;
    } else {
      setAtPath(block, path, value);
    }
  });

}

function normalizeTypedValue(target, descriptorPath, rawValue) {
  if (target instanceof HTMLInputElement && target.type === 'checkbox') {
    return target.checked;
  }
  if (target instanceof HTMLInputElement && target.type === 'number') {
    return rawValue === '' ? '' : Number(rawValue);
  }
  if (descriptorPath === 'meta.tech') {
    return String(rawValue)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return rawValue;
}

function handleBoundInput(target, scope) {
  const path = scope === 'meta' ? target.dataset.metaPath : target.dataset.blockPath;
  if (!path || !state.document) return;
  const localized = target.dataset.localized === 'true';
  const rawValue = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
  const nextValue = normalizeTypedValue(target, path, rawValue);

  updateDocument((document) => {
    if (scope === 'meta') {
      if (localized) {
        ensureLocalizedTarget(document, path);
        const existing = getAtPath(document, path);
        existing[currentLocale()] = String(nextValue);
      } else {
        setAtPath(document, path, nextValue);
      }
      return;
    }

    const block = document.blocks.find((entry) => entry.id === target.dataset.blockId);
    if (!block) return;
    if (localized) {
      ensureLocalizedTarget(block, path);
      const existing = getAtPath(block, path);
      existing[currentLocale()] = String(nextValue);
    } else {
      setAtPath(block, path, nextValue);
    }
  });
}

function addBlock(type, placement = null) {
  if (!state.document) return;
  if (state.document.blocks.some((block) => block.type === type)) {
    setStatus(`${type} is already on the page`, 'error');
    return;
  }

  updateDocument((document) => {
    const block = createStudioBlockInstance(type, {
      id: createBlockId(type),
      placement: placement ? { desktop: placement } : undefined,
    });
    block.placement.desktop = findNextOpenPlacement(document.blocks, type, block.placement.desktop);
    document.blocks.push(block);
    document.ui.selectedBlockId = block.id;
  }, 'layout');
}

function commitPlacement(blockId, placement) {
  updateDocument((document) => {
    const block = document.blocks.find((entry) => entry.id === blockId);
    if (!block) return;
    block.placement.desktop = placement;
    document.blocks = resolveDesktopCollisions(document.blocks, blockId);
    document.ui.selectedBlockId = blockId;
  }, 'layout');
}

function beginPaletteDrag(event, type, label) {
  if (!state.document) return;
  const ghost = document.createElement('div');
  ghost.className = 'palette-ghost';
  ghost.textContent = label;
  document.body.appendChild(ghost);

  state.paletteDrag = {
    type,
    ghost,
    moved: false,
  };

  const placeGhost = (pointerEvent) => {
    ghost.style.left = `${pointerEvent.clientX + 12}px`;
    ghost.style.top = `${pointerEvent.clientY + 12}px`;
  };

  const move = (pointerEvent) => {
    if (!state.paletteDrag) return;
    state.paletteDrag.moved = true;
    placeGhost(pointerEvent);
  };

  const end = (pointerEvent) => {
    if (!state.paletteDrag) return;
    const rect = elements.canvas.getBoundingClientRect();
    const insideCanvas =
      pointerEvent.clientX >= rect.left &&
      pointerEvent.clientX <= rect.right &&
      pointerEvent.clientY >= rect.top &&
      pointerEvent.clientY <= rect.bottom;

    if (insideCanvas) {
      const placement = clientPointToPlacement(elements.canvas, type, pointerEvent.clientX, pointerEvent.clientY);
      addBlock(type, placement);
    } else if (!state.paletteDrag.moved) {
      addBlock(type);
    }

    ghost.remove();
    state.paletteDrag = null;
    window.removeEventListener('pointermove', move);
  };

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end, { once: true });
  placeGhost(event);
}

function beginCanvasInteraction(event, blockId, mode) {
  if (!state.document) return;
  const block = state.document.blocks.find((entry) => entry.id === blockId);
  if (!block) return;

  const rect = elements.canvas.getBoundingClientRect();
  const cellWidth = (rect.width - 14 * 11) / 12;

  state.canvasInteraction = {
    blockId,
    blockType: block.type,
    mode,
    origin: { ...block.placement.desktop },
    startX: event.clientX,
    startY: event.clientY,
    cellWidth,
  };

  const move = (pointerEvent) => {
    if (!state.canvasInteraction) return;
    const deltaX = pointerEvent.clientX - state.canvasInteraction.startX;
    const deltaY = pointerEvent.clientY - state.canvasInteraction.startY;
    const dx = Math.round(deltaX / (state.canvasInteraction.cellWidth + 14));
    const dy = Math.round(deltaY / (74 + 14));
    const nextPlacement = { ...state.canvasInteraction.origin };

    if (mode === 'move') {
      nextPlacement.x += dx;
      nextPlacement.y += dy;
    } else {
      if (mode.includes('e')) nextPlacement.w += dx;
      if (mode.includes('s')) nextPlacement.h += dy;
    }

    const previewPlacement = mode === 'move'
      ? clientPointToPlacement(elements.canvas, state.canvasInteraction.blockType, pointerEvent.clientX, pointerEvent.clientY, nextPlacement)
      : normalizeDesktopPlacement(state.canvasInteraction.blockType, nextPlacement);
    const finalPlacement = mode === 'move'
      ? { ...nextPlacement, x: previewPlacement.x, y: previewPlacement.y }
      : previewPlacement;

    const target = elements.canvas.querySelector(`[data-block-id="${blockId}"]`);
    if (target) {
      target.style.setProperty('--grid-column', String(finalPlacement.x + 1));
      target.style.setProperty('--grid-row', String(finalPlacement.y + 1));
      target.style.setProperty('--grid-width', String(finalPlacement.w));
      target.style.setProperty('--grid-height', String(finalPlacement.h));
    }
  };

  const end = (pointerEvent) => {
    if (!state.canvasInteraction) return;
    const deltaX = pointerEvent.clientX - state.canvasInteraction.startX;
    const deltaY = pointerEvent.clientY - state.canvasInteraction.startY;
    const dx = Math.round(deltaX / (state.canvasInteraction.cellWidth + 14));
    const dy = Math.round(deltaY / (74 + 14));
    const nextPlacement = { ...state.canvasInteraction.origin };

    if (mode === 'move') {
      nextPlacement.x += dx;
      nextPlacement.y += dy;
    } else {
      if (mode.includes('e')) nextPlacement.w += dx;
      if (mode.includes('s')) nextPlacement.h += dy;
    }

    const normalized = mode === 'move'
      ? clientPointToPlacement(elements.canvas, state.canvasInteraction.blockType, pointerEvent.clientX, pointerEvent.clientY, nextPlacement)
      : normalizeDesktopPlacement(state.canvasInteraction.blockType, nextPlacement);
    const finalPlacement = mode === 'move'
      ? { ...nextPlacement, x: normalized.x, y: normalized.y }
      : normalized;
    commitPlacement(blockId, finalPlacement);
    state.canvasInteraction = null;
    window.removeEventListener('pointermove', move);
  };

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end, { once: true });
}

function handleError(error) {
  setStatus(error instanceof Error ? error.message : 'Studio request failed', 'error');
}

async function loadBootstrap() {
  state.bootstrap = await studioApi('/bootstrap');
  renderPresetSelect();
}

function hydrateDocument(document, currentProjectId) {
  state.document = clone(document);
  state.currentProjectId = currentProjectId;
  state.editing = null;
  renderAll();
  syncPreviewFrame();
  schedulePreviewSync('save');
}

async function loadProject(projectId) {
  setStatus('Loading project...');
  const document = await studioApi(`/project?id=${encodeURIComponent(projectId)}`);
  hydrateDocument(document, document.id || projectId);
  setStatus(`Loaded ${document.id}`, 'ok');
}

async function createFromPreset() {
  setStatus('Creating draft...');
  const draft = await studioApi(`/draft?preset=${encodeURIComponent(elements.presetSelect.value)}`);
  hydrateDocument(draft.document, null);
  setStatus('Draft ready', 'ok');
}

async function duplicateProject() {
  if (!state.currentProjectId) {
    setStatus('Load a project before duplicating it', 'error');
    return;
  }
  setStatus('Duplicating project...');
  const duplicate = await studioApi(`/duplicate?id=${encodeURIComponent(state.currentProjectId)}`);
  hydrateDocument(duplicate.document, null);
  setStatus('Duplicate ready', 'ok');
}

async function saveProject() {
  if (!state.document) return;
  setStatus('Saving project...');
  const response = await studioApi('/save', {
    method: 'POST',
    body: JSON.stringify({ document: state.document }),
  });
  hydrateDocument(response.document, response.id);
  await loadBootstrap();
  renderAll();
  setStatus(`Saved ${response.id}`, 'ok');
}

function attachEvents() {
  elements.createProjectBtn.addEventListener('click', () => createFromPreset().catch(handleError));
  elements.duplicateProjectBtn.addEventListener('click', () => duplicateProject().catch(handleError));
  elements.saveProjectBtn.addEventListener('click', () => saveProject().catch(handleError));
  elements.reloadProjectBtn.addEventListener('click', () => {
    if (!state.currentProjectId) return;
    loadProject(state.currentProjectId).catch(handleError);
  });
  elements.openProjectBtn.addEventListener('click', () => {
    if (!state.document) return;
    window.open(`/projects/${state.document.slug}`, '_blank', 'noopener');
  });

  elements.projectList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-project-id]');
    if (!button) return;
    loadProject(button.dataset.projectId).catch(handleError);
  });

  elements.paletteList.addEventListener('pointerdown', (event) => {
    const button = event.target.closest('[data-block-type]');
    if (!button || button.disabled) return;
    event.preventDefault();
    beginPaletteDrag(event, button.dataset.blockType, button.querySelector('.palette-item-title')?.textContent || button.dataset.blockType);
  });

  elements.localeToggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-locale]');
    if (!button || !state.document) return;
    updateDocument((document) => {
      document.ui.locale = button.dataset.locale;
    }, 'none');
  });

  elements.previewModeToggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-mode]');
    if (!button || !state.document) return;
    updateDocument((document) => {
      document.ui.previewMode = button.dataset.mode;
    }, 'none');
    if (button.dataset.mode === 'preview') schedulePreviewSync('save');
  });

  elements.previewSizeToggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-preview-size]');
    if (!button) return;
    state.previewSize = button.dataset.previewSize;
    renderSegmented(elements.previewSizeToggle, state.previewSize, 'previewSize');
    elements.previewViewport.dataset.size = state.previewSize;
  });

  elements.canvas.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-card-action]');
    if (actionButton) {
      const blockId = actionButton.dataset.blockId;
      const action = actionButton.dataset.cardAction;
      if (action === 'toggle') {
        updateDocument((document) => {
          const block = document.blocks.find((entry) => entry.id === blockId);
          if (block) block.enabled = block.enabled === false;
        });
      } else if (action === 'remove') {
        updateDocument((document) => {
          document.blocks = document.blocks.filter((block) => block.id !== blockId);
          if (document.ui.selectedBlockId === blockId) {
            document.ui.selectedBlockId = document.blocks[0]?.id || null;
          }
        }, 'layout');
      } else if (action === 'select') {
        selectBlock(blockId);
      }
      return;
    }

    const inlineTarget = event.target.closest('[data-inline-target="true"]');
    if (inlineTarget) {
      setEditing({
        scope: inlineTarget.dataset.inlineScope,
        path: inlineTarget.dataset.inlinePath,
        blockId: inlineTarget.dataset.inlineBlockId || null,
      });
      return;
    }

    const card = event.target.closest('[data-block-id]');
    if (card) selectBlock(card.dataset.blockId);
  });

  elements.canvas.addEventListener('pointerdown', (event) => {
    const resize = event.target.closest('[data-resize]');
    const move = event.target.closest('.canvas-chip--move');
    const card = event.target.closest('[data-block-id]');
    if (!card) return;
    if (event.target.closest('[data-inline-target],[data-inline-editor],.canvas-chip:not(.canvas-chip--move)')) return;
    event.preventDefault();
    selectBlock(card.dataset.blockId);
    beginCanvasInteraction(event, card.dataset.blockId, resize?.dataset.resize || (move ? 'move' : 'move'));
  });

  elements.canvas.addEventListener('keydown', (event) => {
    if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) return;
    if (event.target.dataset.inlineEditor !== 'true') return;
    if (event.key === 'Escape') {
      state.editing = null;
      renderCanvas();
      return;
    }
    if (event.key === 'Enter' && !(event.target instanceof HTMLTextAreaElement && event.shiftKey)) {
      event.preventDefault();
      commitInlineEdit(event.target);
    }
  });

  elements.canvas.addEventListener('blur', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      if (event.target.dataset.inlineEditor === 'true') {
        commitInlineEdit(event.target);
      }
    }
  }, true);

  elements.projectInspector.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (!target.dataset.metaPath) return;
    handleBoundInput(target, 'meta');
  });

  elements.projectInspector.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (!target.dataset.metaPath) return;
    handleBoundInput(target, 'meta');
  });

  elements.blockInspector.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (!target.dataset.blockPath) return;
    handleBoundInput(target, 'block');
  });

  elements.blockInspector.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (!target.dataset.blockPath) return;
    handleBoundInput(target, 'block');
  });

  elements.blockInspector.addEventListener('click', (event) => {
    const button = event.target.closest('[data-array-action]');
    if (!button) return;
    const blockId = button.dataset.blockId;
    const arrayPath = button.dataset.arrayPath;
    const arrayIndex = Number(button.dataset.arrayIndex);
    const action = button.dataset.arrayAction;

    updateSelectedBlock((block) => {
      if (block.id !== blockId) return;
      const items = getAtPath(block, arrayPath) || [];
      if (action === 'add') {
        items.push(defaultArrayItemFor(block.type, arrayPath));
        setAtPath(block, arrayPath, items);
        return;
      }
      if (!Array.isArray(items)) return;
      if (action === 'remove') {
        items.splice(arrayIndex, 1);
      } else if (action === 'move-up' && arrayIndex > 0) {
        [items[arrayIndex - 1], items[arrayIndex]] = [items[arrayIndex], items[arrayIndex - 1]];
      } else if (action === 'move-down' && arrayIndex < items.length - 1) {
        [items[arrayIndex + 1], items[arrayIndex]] = [items[arrayIndex], items[arrayIndex + 1]];
      }
      setAtPath(block, arrayPath, items);
    });
  });
}

async function init() {
  try {
    await loadBootstrap();
    attachEvents();
    if (state.bootstrap?.projects?.length) {
      await loadProject(state.bootstrap.projects[0].id);
    } else {
      await createFromPreset();
    }
  } catch (error) {
    handleError(error);
  }
}

window.addEventListener('beforeunload', () => {
  fetch(`/api/studio-preview.json?session=${encodeURIComponent(state.previewSessionId)}`, { method: 'DELETE' }).catch(() => {});
});

init();
