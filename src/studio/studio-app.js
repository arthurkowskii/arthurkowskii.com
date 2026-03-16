import {
  buildProjectDraftFromStudioDocument,
  createStudioBlockInstance,
  getStudioPresentation,
} from './studio-document.js';
import {
  clientPointToPlacement,
  findNextOpenPlacement,
  normalizeBlocksForCanvas,
  normalizeDesktopPlacement,
  renderStudioCanvas,
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
  presentation: { visibleBlocks: [], inactiveBlocks: [] },
  projectFilter: '',
  sidebarSections: {},
};

const elements = {
  status: document.getElementById('studio-status'),
  docId: document.getElementById('studio-doc-id'),
  projectLabel: document.getElementById('studio-project-label'),
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
  sidebarScroll: document.querySelector('.sidebar-scroll'),
  sidebar: document.getElementById('studio-sidebar-content'),
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

function currentPresentation() {
  return state.presentation || { visibleBlocks: [], inactiveBlocks: [] };
}

function getInactiveEntry(blockId) {
  return currentPresentation().inactiveBlocks.find((entry) => entry.block.id === blockId) || null;
}

function ensureSelectedBlock(document) {
  if (!document) return;
  const selectedExists = document.blocks.some((block) => block.id === document.ui.selectedBlockId);
  if (selectedExists) return;
  const visibleId = state.presentation?.visibleBlocks?.[0]?.id;
  document.ui.selectedBlockId = visibleId || document.blocks[0]?.id || null;
}

function captureSidebarFocus() {
  const active = document.activeElement;
  if (!(active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement)) {
    return null;
  }
  if (!active.closest('[data-sidebar-content="true"]')) return null;

  return {
    sidebarControl: active.dataset.sidebarControl || '',
    metaPath: active.dataset.metaPath || '',
    blockPath: active.dataset.blockPath || '',
    blockId: active.dataset.blockId || '',
    selectionStart: 'selectionStart' in active ? active.selectionStart : null,
    selectionEnd: 'selectionEnd' in active ? active.selectionEnd : null,
  };
}

function restoreSidebarFocus(snapshot) {
  if (!snapshot || state.editing) return;
  let selector = '';

  if (snapshot.sidebarControl) {
    selector = `[data-sidebar-control="${snapshot.sidebarControl}"]`;
  } else if (snapshot.metaPath) {
    selector = `[data-meta-path="${snapshot.metaPath}"]`;
  } else if (snapshot.blockPath) {
    selector = `[data-block-path="${snapshot.blockPath}"][data-block-id="${snapshot.blockId}"]`;
  } else {
    return;
  }

  const next = elements.sidebar.querySelector(selector);
  if (!(next instanceof HTMLInputElement || next instanceof HTMLTextAreaElement || next instanceof HTMLSelectElement)) {
    return;
  }

  next.focus();
  if ((next instanceof HTMLInputElement || next instanceof HTMLTextAreaElement) && snapshot.selectionStart !== null) {
    next.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd ?? snapshot.selectionStart);
  }
}

function buildDraftProjectId(documentRecord = state.document) {
  if (!documentRecord) return null;
  const folder = documentRecord.folder || '3_tech';
  const slug = documentRecord.slug || 'new_project';
  return `${folder}/${slug}.md`;
}

function getDisplayedProjectId(documentRecord = state.document) {
  const draftProjectId = buildDraftProjectId(documentRecord);
  if (!draftProjectId) return 'No project selected';
  if (state.currentProjectId && state.currentProjectId !== draftProjectId) {
    return `${draftProjectId} (unsaved)`;
  }
  return state.currentProjectId || draftProjectId;
}

function hasKnownProject(projectId) {
  return Boolean(projectId) && (state.bootstrap?.projects || []).some((project) => project.id === projectId);
}

function readProjectIdFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get('project') || null;
}

function writeProjectIdToUrl(projectId, mode = 'replace') {
  const url = new URL(window.location.href);
  if (projectId) {
    url.searchParams.set('project', projectId);
  } else {
    url.searchParams.delete('project');
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl === currentUrl) return;

  const method = mode === 'push' ? 'pushState' : 'replaceState';
  window.history[method]({}, '', nextUrl);
}

function captureHydrationState() {
  return {
    locale: currentLocale(),
    previewMode: currentPreviewMode(),
    selectedBlockId: state.document?.ui?.selectedBlockId || null,
    sidebarScrollTop: elements.sidebarScroll?.scrollTop || 0,
    canvasScrollTop: elements.canvasStage?.scrollTop || 0,
    focusSnapshot: captureSidebarFocus(),
  };
}

function applyHydrationState(documentRecord, snapshot) {
  if (!documentRecord || !snapshot) return;
  if (snapshot.locale) documentRecord.ui.locale = snapshot.locale;
  if (snapshot.previewMode) documentRecord.ui.previewMode = snapshot.previewMode;
  if (
    snapshot.selectedBlockId &&
    documentRecord.blocks.some((block) => block.id === snapshot.selectedBlockId)
  ) {
    documentRecord.ui.selectedBlockId = snapshot.selectedBlockId;
  }
}

function restoreHydrationState(snapshot) {
  if (!snapshot) return;
  requestAnimationFrame(() => {
    if (elements.sidebarScroll && typeof snapshot.sidebarScrollTop === 'number') {
      elements.sidebarScroll.scrollTop = snapshot.sidebarScrollTop;
    }
    if (typeof snapshot.canvasScrollTop === 'number') {
      elements.canvasStage.scrollTop = snapshot.canvasScrollTop;
    }
    restoreSidebarFocus(snapshot.focusSnapshot);
  });
}

function defaultSidebarSectionOpen(key) {
  if (key === 'selectedBlock') return true;
  if (key === 'inactiveBlocks') return currentPresentation().inactiveBlocks.length > 0;
  return false;
}

function isSidebarSectionOpen(key) {
  if (Object.prototype.hasOwnProperty.call(state.sidebarSections, key)) {
    return state.sidebarSections[key];
  }
  return defaultSidebarSectionOpen(key);
}

function getFilteredProjects() {
  const projects = state.bootstrap?.projects || [];
  const query = state.projectFilter.trim().toLowerCase();
  if (!query) return projects;

  return projects.filter((project) => {
    const title = typeof project.title === 'string' ? project.title : project.title?.fr || project.slug;
    return [title, project.id, project.slug, project.status]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
}

function normalizeDocumentForCanvas(document, activeBlockId = document?.ui?.selectedBlockId || null) {
  if (!document) return;

  document.blocks = Array.isArray(document.blocks)
    ? document.blocks.map((block) => ({
        ...block,
        placement: {
          ...block.placement,
          desktop: normalizeDesktopPlacement(block.type, block.placement?.desktop),
        },
      }))
    : [];

  let presentation = getStudioPresentation(document);
  const normalizedVisible = presentation.visibleBlocks.length
    ? normalizeBlocksForCanvas(
        presentation.visibleBlocks,
        presentation.visibleBlocks.some((block) => block.id === activeBlockId) ? activeBlockId : null,
      )
    : [];

  if (normalizedVisible.length) {
    const placementById = new Map(
      normalizedVisible.map((block) => [block.id, { ...block.placement.desktop }]),
    );

    document.blocks = document.blocks.map((block) =>
      placementById.has(block.id)
        ? {
            ...block,
            placement: {
              ...block.placement,
              desktop: placementById.get(block.id),
            },
          }
        : block,
    );

    presentation = getStudioPresentation(document);
  }

  state.presentation = presentation;
  ensureSelectedBlock(document);
}

function updateDocument(mutator, previewReason = 'edit', options = {}) {
  if (!state.document) return;
  const focusSnapshot = captureSidebarFocus();
  mutator(state.document);
  normalizeDocumentForCanvas(state.document, options.activeBlockId || state.document.ui.selectedBlockId);
  renderAll();
  restoreSidebarFocus(focusSnapshot);
  if (previewReason !== 'none') {
    schedulePreviewSync(previewReason);
  }
}

function updateSelectedBlock(mutator, previewReason = 'edit') {
  updateDocument((document) => {
    const block = document.blocks.find((entry) => entry.id === document.ui.selectedBlockId);
    if (!block) return;
    mutator(block, document);
  }, previewReason, { activeBlockId: state.document?.ui?.selectedBlockId });
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
  const quiet = reason === 'save';
  state.previewTimer = window.setTimeout(async () => {
    if (!state.document) return;
    try {
      if (!quiet) {
        setStatus(reason === 'layout' ? 'Updating preview after layout change...' : 'Updating preview...');
      }
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
      if (!quiet) {
        setStatus('Preview synced', 'ok');
      }
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

function renderProjectListMarkup() {
  const projects = getFilteredProjects();
  if (!projects.length) {
    return state.projectFilter
      ? `<div class="sidebar-note">No projects match "${escapeHtml(state.projectFilter)}".</div>`
      : '<div class="sidebar-note">No projects found.</div>';
  }

  return `
    <div class="project-list">
      ${projects
    .map((project) => {
      const title = typeof project.title === 'string' ? project.title : project.title?.fr || project.slug;
      return `
        <button type="button" class="project-item${project.id === state.currentProjectId ? ' active' : ''}" data-project-id="${escapeHtml(project.id)}">
          <span class="row-head">
            <span class="project-item-title">${escapeHtml(title)}</span>
            <span class="item-pill">${escapeHtml(project.status)}</span>
          </span>
          <span class="mono">${escapeHtml(project.id)}</span>
        </button>
      `;
    })
    .join('')}
    </div>
  `;
}

function renderPaletteMarkup() {
  const existingTypes = new Set((state.document?.blocks || []).map((block) => block.type));
  return `
    <div class="palette-list">
      ${(state.bootstrap?.palette || [])
    .map((item) => {
      const disabled = existingTypes.has(item.type);
      return `
        <button
          type="button"
          class="palette-item${disabled ? ' disabled' : ''}"
          data-block-type="${escapeHtml(item.type)}"
          ${disabled ? 'disabled' : ''}
        >
          <span class="row-head">
            <span class="palette-item-title">${escapeHtml(item.label)}</span>
            <span class="item-pill${disabled ? '' : ' item-pill--accent'}">${disabled ? 'Present' : 'Add'}</span>
          </span>
          <span class="mono">min ${item.constraints?.minW || 1}x${item.constraints?.minH || 1}</span>
        </button>
      `;
    })
    .join('')}
    </div>
  `;
}

function renderCreateProjectsMarkup() {
  const presets = state.bootstrap?.presets || [];
  const selectedPreset = state.document?.ui?.presetKey || presets[0]?.key || '';
  const presetOptions = presets
    .map((preset) => `<option value="${escapeHtml(preset.key)}"${preset.key === selectedPreset ? ' selected' : ''}>${escapeHtml(`${preset.label} - ${preset.description}`)}</option>`)
    .join('');

  return `
    <div class="create-grid">
      <div class="toolbar">
        <button class="button primary" type="button" data-create-project="true">New From Preset</button>
        <button class="button" type="button" data-duplicate-project="true"${state.currentProjectId ? '' : ' disabled'}>Duplicate</button>
      </div>
      <label class="field">
        <span>Preset</span>
        <select data-preset-select="true">${presetOptions}</select>
      </label>
      <label class="field">
        <span>Find project</span>
        <input
          type="search"
          data-sidebar-control="project-filter"
          placeholder="Search title, slug, folder"
          value="${escapeHtml(state.projectFilter)}"
        />
      </label>
    </div>
    <div class="sidebar-note">Duplicate loads a copy into Studio without overwriting the source file until you save.</div>
    <div class="sidebar-projects">${renderProjectListMarkup()}</div>
  `;
}

function renderInactiveBlocksMarkup() {
  const inactiveBlocks = currentPresentation().inactiveBlocks;
  if (!inactiveBlocks.length) {
    return '<div class="sidebar-note">Every stored block is currently visible on the canvas.</div>';
  }

  return `
    <div class="inactive-list">
      ${inactiveBlocks.map(({ block, reason }) => `
        <button
          type="button"
          class="inactive-item${state.document?.ui?.selectedBlockId === block.id ? ' active' : ''}"
          data-select-block-id="${escapeHtml(block.id)}"
        >
          <span class="row-head">
            <span class="inactive-item-title">${escapeHtml(block.label || block.type)}</span>
            <span class="item-pill">${escapeHtml(block.kind)}</span>
          </span>
          <span class="inactive-item-reason">${escapeHtml(reason)}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function renderProjectInspectorMarkup() {
  if (!state.document) {
    return '<div class="sidebar-note">Load a project to edit its metadata.</div>';
  }

  const meta = state.document.meta;
  const locale = currentLocale();
  const localeLabel = locale.toUpperCase();
  const domains = (state.bootstrap?.domains || []).map((folder) => ({ value: folder, label: folder }));
  const bodyLineCount = Math.max(1, String(state.document.body || '').split(/\r?\n/).length);

  return `
    <div class="stack">
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
      </div>
      <details class="subsection">
        <summary>
          <span>Body Markdown</span>
          <span class="section-meta">${bodyLineCount} lines</span>
        </summary>
        <div class="subsection-body">
          ${textareaInput({ label: 'Markdown body', value: state.document.body, path: 'body' })}
        </div>
      </details>
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
      ` : '<div class="sidebar-note" style="grid-column: 1 / -1;">Gallery images will resolve from the project assets folder.</div>'}
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
          <div class="sidebar-note">Technology pills come from the project tech tags above.</div>
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
      return '<div class="sidebar-note">This block has no editable inspector.</div>';
  }
}

function renderBlockInspectorMarkup() {
  const block = getSelectedBlock();
  const locale = currentLocale();

  if (!block) {
    return {
      meta: 'No selection',
      body: '<div class="sidebar-note">Select a visible or inactive block to edit its settings.</div>',
    };
  }

  const inactiveEntry = getInactiveEntry(block.id);
  const preface = inactiveEntry
    ? `<div class="sidebar-note">${escapeHtml(inactiveEntry.reason)}</div>`
    : '';

  const body = block.kind === 'legacy'
    ? `
      <div class="sidebar-note">Legacy media blocks can move, resize, enable, disable, and round-trip. Content editing stays limited in this pass.</div>
      <div class="sidebar-note"><pre style="margin:0; white-space:pre-wrap; font-family:Consolas, monospace;">${escapeHtml(JSON.stringify(block.content || {}, null, 2))}</pre></div>
    `
    : renderCoreInspector(block, locale);

  return {
    meta: `${block.label} | ${block.kind}`,
    body: `
      ${preface}
      <div class="field-grid two">
        ${checkboxInput({ label: 'Enabled', checked: block.enabled !== false, path: 'enabled', blockId: block.id })}
        ${textInput({ label: 'Variant', value: block.variant || 'default', path: 'variant', scope: 'block', blockId: block.id })}
        ${textInput({ label: 'Grid X', value: block.placement.desktop.x, path: 'placement.desktop.x', scope: 'block', blockId: block.id, type: 'number' })}
        ${textInput({ label: 'Grid Y', value: block.placement.desktop.y, path: 'placement.desktop.y', scope: 'block', blockId: block.id, type: 'number' })}
        ${textInput({ label: 'Width', value: block.placement.desktop.w, path: 'placement.desktop.w', scope: 'block', blockId: block.id, type: 'number' })}
        ${textInput({ label: 'Height', value: block.placement.desktop.h, path: 'placement.desktop.h', scope: 'block', blockId: block.id, type: 'number' })}
      </div>
      ${body}
    `,
  };
}

function renderSidebarSection({ key, eyebrow, title, meta, body }) {
  return `
    <details class="sidebar-section"${isSidebarSectionOpen(key) ? ' open' : ''} data-section-key="${key}">
      <summary>
        <div class="section-heading">
          <span class="eyebrow">${escapeHtml(eyebrow)}</span>
          <h2>${escapeHtml(title)}</h2>
        </div>
        <span class="section-meta">${escapeHtml(meta)}</span>
      </summary>
      <div class="section-body">${body}</div>
    </details>
  `;
}

function renderSidebarSummary() {
  if (!state.document) {
    return `
      <div class="card sidebar-summary">
        <span class="eyebrow">Current Project</span>
        <h2>Loading Studio</h2>
      </div>
    `;
  }

  const selectedBlock = getSelectedBlock();
  const visibleCount = currentPresentation().visibleBlocks.length;
  const inactiveCount = currentPresentation().inactiveBlocks.length;
  const title = localizedValue(state.document.meta?.title, currentLocale()) || state.document.slug || 'Untitled project';

  return `
    <div class="card sidebar-summary">
      <div class="sidebar-summary__header">
        <div class="stack" style="gap: 8px;">
          <span class="eyebrow">Current Project</span>
          <h2>${escapeHtml(title)}</h2>
        </div>
        <span class="item-pill item-pill--accent">${escapeHtml(state.document.meta?.status || 'planned')}</span>
      </div>
      <div class="mono sidebar-summary__path">${escapeHtml(getDisplayedProjectId())}</div>
      <div class="sidebar-summary__stats">
        <div class="summary-cell">
          <span class="summary-label">Selected</span>
          <strong>${escapeHtml(selectedBlock?.label || 'None')}</strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">Visible</span>
          <strong>${visibleCount}</strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">Hidden</span>
          <strong>${inactiveCount}</strong>
        </div>
      </div>
    </div>
  `;
}

function renderSidebar() {
  const blockInspector = renderBlockInspectorMarkup();
  const inactiveCount = currentPresentation().inactiveBlocks.length;
  const filteredProjects = getFilteredProjects();
  const totalProjects = (state.bootstrap?.projects || []).length;

  elements.sidebar.innerHTML = `
    <div class="sidebar-stack">
      ${renderSidebarSummary()}
      ${renderSidebarSection({
        key: 'selectedBlock',
        eyebrow: 'Inspector',
        title: 'Selected Block',
        meta: blockInspector.meta,
        body: blockInspector.body,
      })}
      ${renderSidebarSection({
        key: 'projectSettings',
        eyebrow: 'Inspector',
        title: 'Project Settings',
        meta: state.document?.meta?.status || 'project',
        body: renderProjectInspectorMarkup(),
      })}
      ${renderSidebarSection({
        key: 'inactiveBlocks',
        eyebrow: 'Parity',
        title: 'Inactive / Conditional Blocks',
        meta: inactiveCount ? `${inactiveCount} hidden` : 'All visible',
        body: renderInactiveBlocksMarkup(),
      })}
      ${renderSidebarSection({
        key: 'palette',
        eyebrow: 'Palette',
        title: 'Block Palette',
        meta: `${(state.bootstrap?.palette || []).length} core`,
        body: `${renderPaletteMarkup()}<div class="sidebar-note">Drag a block onto the canvas or click to add it to the next open slot.</div>`,
      })}
      ${renderSidebarSection({
        key: 'projects',
        eyebrow: 'Projects',
        title: 'Create & Switch',
        meta: state.projectFilter ? `${filteredProjects.length}/${totalProjects} files` : `${totalProjects} files`,
        body: renderCreateProjectsMarkup(),
      })}
    </div>
  `;
}

function renderProjectHeader() {
  const title = localizedValue(state.document?.meta?.title, currentLocale()) || 'Untitled project';
  elements.projectLabel.textContent = title;
  elements.docId.textContent = getDisplayedProjectId();
}

function renderCanvas() {
  if (!state.document) return;
  const visibleBlocks = currentPresentation().visibleBlocks;
  renderStudioCanvas(elements.canvas, state.document, {
    locale: currentLocale(),
    selectedBlockId: state.document.ui.selectedBlockId,
    editing: state.editing,
    blocks: visibleBlocks,
  });
  elements.canvasEmpty.classList.toggle('is-visible', !visibleBlocks.length);
}

function renderAll() {
  renderProjectHeader();
  renderSegmented(elements.localeToggle, currentLocale(), 'locale');
  renderSegmented(elements.previewModeToggle, currentPreviewMode(), 'mode');
  renderSegmented(elements.previewSizeToggle, state.previewSize, 'previewSize');
  elements.canvasStage.classList.toggle('is-active', currentPreviewMode() === 'canvas');
  elements.previewStage.classList.toggle('is-active', currentPreviewMode() === 'preview');
  renderCanvas();
  renderSidebar();
  elements.openProjectBtn.disabled = !state.document;
}

function selectBlock(blockId) {
  updateDocument((document) => {
    document.ui.selectedBlockId = blockId;
  }, 'none', { activeBlockId: blockId });
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
  }, 'edit', { activeBlockId: blockId || state.document.ui.selectedBlockId });
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
  const isLayoutField = scope === 'block' && (path === 'enabled' || path.startsWith('placement.desktop'));
  const previewReason = isLayoutField ? 'layout' : 'edit';
  const activeBlockId = scope === 'block' ? target.dataset.blockId || state.document.ui.selectedBlockId : state.document.ui.selectedBlockId;

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
  }, previewReason, { activeBlockId });
}

function addBlock(type, placement = null) {
  if (!state.document) return;
  if (state.document.blocks.some((block) => block.type === type)) {
    setStatus(`${type} is already on the page`, 'error');
    return;
  }

  const nextBlockId = createBlockId(type);
  updateDocument((document) => {
    const visibleBlocks = getStudioPresentation(document).visibleBlocks;
    const block = createStudioBlockInstance(type, {
      id: nextBlockId,
      placement: placement ? { desktop: placement } : undefined,
    });
    block.placement.desktop = findNextOpenPlacement(visibleBlocks, type, block.placement.desktop);
    document.blocks.push(block);
    document.ui.selectedBlockId = block.id;
  }, 'layout', { activeBlockId: nextBlockId });
}

function commitPlacement(blockId, placement) {
  updateDocument((document) => {
    const block = document.blocks.find((entry) => entry.id === blockId);
    if (!block) return;
    block.placement.desktop = placement;
    document.ui.selectedBlockId = blockId;
  }, 'layout', { activeBlockId: blockId });
}

function currentPresetKey() {
  const select = elements.sidebar.querySelector('[data-preset-select="true"]');
  if (!(select instanceof HTMLSelectElement)) {
    return state.bootstrap?.presets?.[0]?.key || 'blank';
  }
  return select.value;
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
      const droppedPlacement = clientPointToPlacement(elements.canvas, type, pointerEvent.clientX, pointerEvent.clientY);
      addBlock(type, droppedPlacement);
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
}

function hydrateDocument(document, currentProjectId, options = {}) {
  const preservedUi = options.preservedUi || null;
  state.document = clone(document);
  state.currentProjectId = currentProjectId;
  state.editing = null;
  applyHydrationState(state.document, preservedUi);
  normalizeDocumentForCanvas(state.document, state.document.ui?.selectedBlockId || null);
  renderAll();
  restoreHydrationState(preservedUi);
  syncPreviewFrame();
  schedulePreviewSync('save');
}

async function loadProject(projectId, options = {}) {
  const {
    urlMode = 'push',
    statusMessage = null,
    statusMode = 'ok',
  } = options;
  setStatus('Loading project...');
  const loadedDocument = await studioApi(`/project?id=${encodeURIComponent(projectId)}`);
  hydrateDocument(loadedDocument, loadedDocument.id || projectId);
  if (urlMode !== 'none') {
    writeProjectIdToUrl(loadedDocument.id || projectId, urlMode);
  }
  setStatus(statusMessage || `Loaded ${loadedDocument.id}`, statusMode);
}

async function createFromPreset() {
  setStatus('Creating draft...');
  const draft = await studioApi(`/draft?preset=${encodeURIComponent(currentPresetKey())}`);
  hydrateDocument(draft.document, null);
  writeProjectIdToUrl(null, 'replace');
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
  writeProjectIdToUrl(null, 'replace');
  setStatus('Duplicate ready', 'ok');
}

async function saveProject() {
  if (!state.document) return;
  const preservedUi = captureHydrationState();
  setStatus('Saving project...');
  const response = await studioApi('/save', {
    method: 'POST',
    body: JSON.stringify({ document: state.document }),
  });
  await loadBootstrap();
  hydrateDocument(response.document, response.id, { preservedUi });
  writeProjectIdToUrl(response.id, 'replace');
  setStatus(`Saved ${response.id}`, 'ok');
}

function attachEvents() {
  elements.saveProjectBtn.addEventListener('click', () => saveProject().catch(handleError));
  elements.reloadProjectBtn.addEventListener('click', () => {
    if (!state.currentProjectId) return;
    loadProject(state.currentProjectId).catch(handleError);
  });
  elements.openProjectBtn.addEventListener('click', () => {
    if (!state.document) return;
    window.open(`/projects/${state.document.slug}`, '_blank', 'noopener');
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
        }, 'layout', { activeBlockId: blockId });
      } else if (action === 'remove') {
        updateDocument((document) => {
          document.blocks = document.blocks.filter((block) => block.id !== blockId);
          if (document.ui.selectedBlockId === blockId) {
            document.ui.selectedBlockId = null;
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

  elements.sidebar.addEventListener('toggle', (event) => {
    if (!(event.target instanceof HTMLDetailsElement)) return;
    const key = event.target.dataset.sectionKey;
    if (!key) return;
    state.sidebarSections[key] = event.target.open;
  });

  elements.sidebar.addEventListener('pointerdown', (event) => {
    const button = event.target.closest('[data-block-type]');
    if (!button || button.disabled) return;
    event.preventDefault();
    beginPaletteDrag(event, button.dataset.blockType, button.querySelector('.palette-item-title')?.textContent || button.dataset.blockType);
  });

  elements.sidebar.addEventListener('click', (event) => {
    const createButton = event.target.closest('[data-create-project]');
    if (createButton) {
      createFromPreset().catch(handleError);
      return;
    }

    const duplicateButton = event.target.closest('[data-duplicate-project]');
    if (duplicateButton) {
      duplicateProject().catch(handleError);
      return;
    }

    const projectButton = event.target.closest('[data-project-id]');
    if (projectButton) {
      loadProject(projectButton.dataset.projectId).catch(handleError);
      return;
    }

    const selectBlockButton = event.target.closest('[data-select-block-id]');
    if (selectBlockButton) {
      selectBlock(selectBlockButton.dataset.selectBlockId);
      return;
    }

    const arrayButton = event.target.closest('[data-array-action]');
    if (!arrayButton) return;

    const blockId = arrayButton.dataset.blockId;
    const arrayPath = arrayButton.dataset.arrayPath;
    const arrayIndex = Number(arrayButton.dataset.arrayIndex);
    const action = arrayButton.dataset.arrayAction;

    updateDocument((document) => {
      const block = document.blocks.find((entry) => entry.id === blockId);
      if (!block) return;
      const items = getAtPath(block, arrayPath) || [];
      if (action === 'add') {
        items.push(defaultArrayItemFor(block.type, arrayPath));
        setAtPath(block, arrayPath, items);
        document.ui.selectedBlockId = blockId;
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
      document.ui.selectedBlockId = blockId;
    }, 'edit', { activeBlockId: blockId });
  });

  const handleSidebarBoundInput = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (target.dataset.sidebarControl === 'project-filter') {
      const focusSnapshot = captureSidebarFocus();
      state.projectFilter = target.value;
      renderSidebar();
      restoreSidebarFocus(focusSnapshot);
      return;
    }
    if (target.dataset.metaPath) {
      handleBoundInput(target, 'meta');
      return;
    }
    if (target.dataset.blockPath) {
      handleBoundInput(target, 'block');
    }
  };

  elements.sidebar.addEventListener('input', handleSidebarBoundInput);
  elements.sidebar.addEventListener('change', handleSidebarBoundInput);
}

async function handleHistoryNavigation() {
  if (!state.bootstrap?.projects?.length) return;

  const requestedProjectId = readProjectIdFromUrl();
  const fallbackProjectId = state.bootstrap.projects[0]?.id || null;

  if (requestedProjectId && hasKnownProject(requestedProjectId)) {
    if (requestedProjectId !== state.currentProjectId) {
      await loadProject(requestedProjectId, { urlMode: 'none' });
    }
    return;
  }

  if (requestedProjectId && !hasKnownProject(requestedProjectId) && fallbackProjectId) {
    await loadProject(fallbackProjectId, {
      urlMode: 'replace',
      statusMessage: `Project "${requestedProjectId}" was not found. Loaded ${fallbackProjectId}.`,
      statusMode: 'error',
    });
    return;
  }

  if (!requestedProjectId && fallbackProjectId && fallbackProjectId !== state.currentProjectId) {
    await loadProject(fallbackProjectId, { urlMode: 'none' });
  }
}

async function init() {
  try {
    await loadBootstrap();
    attachEvents();
    if (state.bootstrap?.projects?.length) {
      const requestedProjectId = readProjectIdFromUrl();
      const fallbackProjectId = state.bootstrap.projects[0].id;
      if (requestedProjectId && hasKnownProject(requestedProjectId)) {
        await loadProject(requestedProjectId, { urlMode: 'replace' });
      } else if (requestedProjectId) {
        await loadProject(fallbackProjectId, {
          urlMode: 'replace',
          statusMessage: `Project "${requestedProjectId}" was not found. Loaded ${fallbackProjectId}.`,
          statusMode: 'error',
        });
      } else {
        await loadProject(fallbackProjectId, { urlMode: 'replace' });
      }
    } else {
      writeProjectIdToUrl(null, 'replace');
      await createFromPreset();
    }
  } catch (error) {
    handleError(error);
  }
}

window.addEventListener('popstate', () => {
  handleHistoryNavigation().catch(handleError);
});

window.addEventListener('beforeunload', () => {
  fetch(`/api/studio-preview.json?session=${encodeURIComponent(state.previewSessionId)}`, { method: 'DELETE' }).catch(() => {});
});

init();
