import {
  STUDIO_COLUMNS,
  buildProjectDraftFromStudioDocument,
  createStudioBlockInstance,
} from './studio-document.js';
import {
  CANVAS_GAP,
  CANVAS_ROW_HEIGHT,
  findNextOpenPlacement,
  normalizeDesktopPlacement,
  resolveDesktopCollisions,
} from './studio-canvas.js';
import { getBlockConstraints } from '../utils/block-registry.js';

const state = {
  bootstrap: null,
  document: null,
  currentProjectId: null,
  previewSessionId: crypto.randomUUID(),
  previewSize: 'desktop',
  previewTimer: null,
  editing: null,
  designGeometry: null,
  canvasInteraction: null,
  layoutMode: false,
  menuOpen: false,
  activeSheet: null,
};

const elements = {
  status: document.getElementById('studio-status'),
  cornerStatus: document.getElementById('corner-status'),
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
  menuToggle: document.getElementById('studio-menu-toggle'),
  menuPanel: document.getElementById('studio-menu-panel'),
  openProjectSettingsBtn: document.getElementById('open-project-settings-btn'),
  openBlockSettingsBtn: document.getElementById('open-block-settings-btn'),
  toggleLayoutModeBtn: document.getElementById('toggle-layout-mode-btn'),
  canvasStage: document.getElementById('canvas-stage'),
  previewStage: document.getElementById('preview-stage'),
  designViewport: document.getElementById('design-viewport'),
  designFrame: document.getElementById('design-frame'),
  previewViewport: document.getElementById('preview-viewport'),
  previewFrame: document.getElementById('preview-frame'),
  projectInspector: document.getElementById('project-inspector'),
  blockInspector: document.getElementById('block-inspector'),
  activeLocaleLabel: document.getElementById('active-locale-label'),
  selectedBlockLabel: document.getElementById('selected-block-label'),
  projectSheet: document.getElementById('project-sheet'),
  blockSheet: document.getElementById('block-sheet'),
  closeSheetButtons: Array.from(document.querySelectorAll('[data-close-sheet]')),
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
  elements.status.className = `status-toast${mode ? ` ${mode}` : ''}`;
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

function currentBreakpoint() {
  if (state.previewSize === 'tablet') return 'tablet';
  if (state.previewSize === 'mobile') return 'mobile';
  return 'desktop';
}

function localizedValue(value, locale = currentLocale()) {
  if (typeof value === 'string') return value;
  return value?.[locale] || value?.fr || value?.en || '';
}

function isLayoutEditingEnabled() {
  return currentBreakpoint() === 'desktop';
}

function isLayoutModeActive() {
  return Boolean(state.layoutMode && isLayoutEditingEnabled() && currentPreviewMode() === 'canvas');
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

function previewUrl(mode, bust = null) {
  const url = new URL('/studio/preview', window.location.origin);
  url.searchParams.set('session', state.previewSessionId);
  url.searchParams.set('lang', currentLocale());
  url.searchParams.set('mode', mode);
  if (bust) {
    url.searchParams.set('t', String(bust));
  }
  return url.toString();
}

function syncPreviewFrames(bust = null) {
  elements.designViewport.dataset.size = state.previewSize;
  elements.previewViewport.dataset.size = state.previewSize;
  elements.designFrame.src = previewUrl('design', bust);
  elements.previewFrame.src = previewUrl('preview', bust);
}

function indexDesignGeometry(payload = {}) {
  const blocks = Array.isArray(payload.blocks) ? payload.blocks : [];
  const fields = Array.isArray(payload.fields) ? payload.fields : [];
  const blocksById = Object.fromEntries(blocks.filter((block) => block?.id).map((block) => [block.id, block]));
  const fieldsById = {};
  const fieldsByBlockId = {};

  fields.forEach((field) => {
    if (!field?.id) return;
    fieldsById[field.id] = field;
    if (!field.blockId) return;
    if (!fieldsByBlockId[field.blockId]) fieldsByBlockId[field.blockId] = [];
    fieldsByBlockId[field.blockId].push(field);
  });

  Object.values(fieldsByBlockId).forEach((items) => {
    items.sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left));
  });

  return {
    blocks,
    fields,
    blocksById,
    fieldsById,
    fieldsByBlockId,
    container: payload.container || null,
    viewport: payload.viewport || { width: 0, height: 0 },
    documentHeight: payload.documentHeight || 0,
  };
}

function getDesignGeometryBlock(blockId) {
  return state.designGeometry?.blocksById?.[blockId] || null;
}

function getDesignGeometryField(fieldId) {
  return state.designGeometry?.fieldsById?.[fieldId] || null;
}

function getDesignGeometryFields(blockId) {
  return state.designGeometry?.fieldsByBlockId?.[blockId] || [];
}

function getActiveGridGeometry() {
  const container = state.designGeometry?.container;
  if (container?.rect?.width) return container;
  return {
    rect: {
      left: 0,
      top: 0,
      width: elements.designViewport.clientWidth,
      height: elements.designViewport.clientHeight,
    },
    gapX: CANVAS_GAP,
    gapY: CANVAS_GAP,
  };
}

function normalizePlacementForBreakpoint(blockType, placement, breakpoint = currentBreakpoint()) {
  const constraints = getBlockConstraints(blockType);
  const columns = STUDIO_COLUMNS[breakpoint];
  const maxW = Math.min(constraints.maxW || columns, columns);
  const minW = Math.min(constraints.minW || 1, maxW);
  const minH = constraints.minH || 1;
  const width = clamp(Number.isFinite(placement?.w) ? placement.w : minW, minW, maxW);
  const x = clamp(Number.isFinite(placement?.x) ? placement.x : 0, 0, Math.max(0, columns - width));
  const y = Math.max(0, Number.isFinite(placement?.y) ? placement.y : 0);
  const h = Math.max(minH, Number.isFinite(placement?.h) ? placement.h : minH);
  return { x, y, w: width, h };
}

function pointToPlacementForGeometry(blockType, clientX, clientY, originPlacement = null, breakpoint = currentBreakpoint()) {
  const geometry = getActiveGridGeometry();
  const columns = STUDIO_COLUMNS[breakpoint];
  const gapX = Number.isFinite(geometry?.gapX) ? geometry.gapX : CANVAS_GAP;
  const rect = geometry?.rect || { left: 0, top: 0, width: elements.designViewport.clientWidth };
  const safeWidth = Math.max(rect.width || 0, 1);
  const cellWidth = (safeWidth - gapX * (columns - 1)) / columns;
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  const base = normalizePlacementForBreakpoint(blockType, originPlacement || { x: 0, y: 0, w: 4, h: 1 }, breakpoint);
  const x = clamp(Math.round(relativeX / (cellWidth + gapX)), 0, Math.max(0, columns - base.w));
  const y = Math.max(0, Math.round(relativeY / (CANVAS_ROW_HEIGHT + CANVAS_GAP)));
  return { ...base, x, y };
}

function postDesignMessage(payload) {
  elements.designFrame.contentWindow?.postMessage({
    ...payload,
    session: state.previewSessionId,
  }, '*');
}

function syncDesignState() {
  if (!state.document) return;
  const selectedBlock = getSelectedBlock();
  const existingTypes = new Set(state.document.blocks.map((block) => block.type));
  const placementDrafts = state.canvasInteraction?.previewPlacement
    ? {
        [state.canvasInteraction.blockId]: {
          breakpoint: currentBreakpoint(),
          placement: state.canvasInteraction.previewPlacement,
        },
      }
    : {};

  postDesignMessage({
    type: 'studio:design-state',
    previewSize: state.previewSize,
    breakpoint: currentBreakpoint(),
    canLayoutEdit: isLayoutEditingEnabled(),
    layoutMode: isLayoutModeActive(),
    selectedBlockId: state.document.ui.selectedBlockId || null,
    editingFieldId: state.editing?.fieldId || null,
    selectedBlock: selectedBlock
      ? {
          id: selectedBlock.id,
          type: selectedBlock.type,
          kind: selectedBlock.kind,
          label: selectedBlock.label || selectedBlock.type,
          enabled: selectedBlock.enabled !== false,
        }
      : null,
    blocks: state.document.blocks.map((block) => ({
      id: block.id,
      type: block.type,
      kind: block.kind,
      label: block.label || block.type,
      enabled: block.enabled !== false,
    })),
    palette: (state.bootstrap?.palette || []).map((item) => ({
      type: item.type,
      label: item.label,
      disabled: existingTypes.has(item.type),
    })),
    placementDrafts,
  });
}

function getOverlayCellWidth() {
  const rect = elements.canvas.getBoundingClientRect();
  return (rect.width - CANVAS_GAP * 11) / 12;
}

function placementToRect(blockType, placement) {
  const normalized = normalizeDesktopPlacement(blockType, placement);
  const cellWidth = getOverlayCellWidth();
  return {
    left: normalized.x * (cellWidth + CANVAS_GAP),
    top: normalized.y * (CANVAS_ROW_HEIGHT + CANVAS_GAP),
    width: normalized.w * cellWidth + (normalized.w - 1) * CANVAS_GAP,
    height: normalized.h * CANVAS_ROW_HEIGHT + (normalized.h - 1) * CANVAS_GAP,
  };
}

function getBlockRect(block) {
  const geometry = getDesignGeometryBlock(block.id);
  return geometry?.rect || placementToRect(block.type, block.placement?.desktop || { x: 0, y: 0, w: 4, h: 2 });
}

function positionRectStyle(rect) {
  return `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;`;
}

function applyPositionRect(target, rect) {
  target.style.left = `${rect.left}px`;
  target.style.top = `${rect.top}px`;
  target.style.width = `${rect.width}px`;
  target.style.height = `${rect.height}px`;
}

function resetSurfaceEditors() {
  elements.inlineEditor.innerHTML = '';
  elements.techEditor.innerHTML = '';
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
      state.designGeometry = null;
      syncPreviewFrames(Date.now());
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
  const projects = state.bootstrap?.projects || [];
  const currentValue = state.currentProjectId || '';
  elements.projectList.innerHTML = '';

  if (!state.currentProjectId) {
    const draftOption = document.createElement('option');
    draftOption.value = '';
    draftOption.textContent = 'Unsaved draft';
    elements.projectList.appendChild(draftOption);
  }

  projects.forEach((project) => {
    const option = document.createElement('option');
    option.value = project.id;
    const title = typeof project.title === 'string' ? project.title : project.title?.fr || project.slug;
    option.textContent = `${title} - ${project.id}`;
    elements.projectList.appendChild(option);
  });

  elements.projectList.value = currentValue;
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

function renderCornerChrome() {
  elements.menuPanel.classList.toggle('is-open', state.menuOpen);
  elements.menuToggle.setAttribute('aria-expanded', state.menuOpen ? 'true' : 'false');
  elements.cornerStatus.dataset.layoutActive = isLayoutModeActive() ? 'true' : 'false';
  if (currentPreviewMode() === 'preview') {
    elements.cornerStatus.textContent = 'Published Preview';
  } else if (isLayoutModeActive()) {
    elements.cornerStatus.textContent = 'Layout mode';
  } else {
    elements.cornerStatus.textContent = 'Canvas mode';
  }

  const selectedBlock = getSelectedBlock();
  elements.openProjectBtn.disabled = !state.document;
  elements.openProjectSettingsBtn.disabled = !state.document;
  elements.openBlockSettingsBtn.disabled = !selectedBlock;
  elements.toggleLayoutModeBtn.disabled = !state.document || !isLayoutEditingEnabled();
  elements.toggleLayoutModeBtn.textContent = isLayoutModeActive() ? 'Exit Layout Mode' : 'Enter Layout Mode';

  elements.projectSheet.classList.toggle('is-open', state.activeSheet === 'project');
  elements.blockSheet.classList.toggle('is-open', state.activeSheet === 'block');
}

function getArrayControlConfig(block) {
  switch (block.type) {
    case 'stats':
      return { path: 'content.items', addLabel: 'Add stat', removeLabel: 'Remove last' };
    case 'process':
      return { path: 'content.steps', addLabel: 'Add step', removeLabel: 'Remove last' };
    case 'challenges':
      return { path: 'content.items', addLabel: 'Add challenge', removeLabel: 'Remove last' };
    case 'results':
      return { path: 'content.items', addLabel: 'Add result', removeLabel: 'Remove last' };
    default:
      return null;
  }
}

function getFieldValue(descriptor) {
  if (!descriptor || !state.document) return '';
  const target = descriptor.scope === 'meta'
    ? getAtPath(state.document, descriptor.path)
    : getAtPath(state.document.blocks.find((block) => block.id === descriptor.blockId), descriptor.path);

  if (descriptor.kind === 'tech-tags') {
    return Array.isArray(target) ? target : [];
  }
  if (descriptor.localized) {
    return localizedValue(target, currentLocale());
  }
  return target ?? '';
}

function clampPanelRect(rect, minWidth = 180, minHeight = 48) {
  const viewportWidth = elements.designViewport.clientWidth;
  const viewportHeight = elements.designViewport.clientHeight;
  const width = Math.min(Math.max(rect.width, minWidth), Math.max(minWidth, viewportWidth - 16));
  const height = Math.max(rect.height, minHeight);
  return {
    left: Math.max(8, Math.min(rect.left, viewportWidth - width - 8)),
    top: Math.max(8, Math.min(rect.top, viewportHeight - height - 8)),
    width,
    height,
  };
}

function renderSurfaceFieldTargets(block, blockRect) {
  if (state.canvasInteraction?.blockId === block.id) return '';
  return getDesignGeometryFields(block.id)
    .map((field) => {
      const localLeft = field.rect.left - blockRect.left;
      const localTop = field.rect.top - blockRect.top;
      if (field.rect.width <= 0 || field.rect.height <= 0) return '';
      const label = field.path.replace(/^meta\./, '').replace(/^content\./, '').replaceAll('.', ' ');
      return `
        <button
          type="button"
          class="surface-field${state.editing?.fieldId === field.id ? ' is-editing' : ''}"
          data-field-id="${field.id}"
          aria-label="Edit ${escapeHtml(label)}"
          title="Edit field"
          style="left:${localLeft}px;top:${localTop}px;width:${field.rect.width}px;height:${field.rect.height}px;"
        ></button>
      `;
    })
    .join('');
}

function renderBlockToolbar(block) {
  const arrayConfig = getArrayControlConfig(block);
  const itemCount = arrayConfig ? (Array.isArray(getAtPath(block, arrayConfig.path)) ? getAtPath(block, arrayConfig.path).length : 0) : 0;
  const selected = state.document?.ui?.selectedBlockId === block.id;
  const tools = [];

  if (selected && arrayConfig) {
    tools.push(`<button type="button" class="surface-chip" data-card-action="add-array-item" data-block-id="${block.id}" data-array-path="${arrayConfig.path}">${arrayConfig.addLabel}</button>`);
    if (itemCount > 0) {
      tools.push(`<button type="button" class="surface-chip" data-card-action="remove-array-item" data-block-id="${block.id}" data-array-path="${arrayConfig.path}">${arrayConfig.removeLabel}</button>`);
    }
  }

  if (selected && block.type === 'tech') {
    tools.push(`<button type="button" class="surface-chip" data-card-action="edit-tech" data-block-id="${block.id}">Edit tags</button>`);
  }

  tools.push(`<button type="button" class="surface-chip" data-card-action="toggle" data-block-id="${block.id}">${block.enabled === false ? 'Enable' : 'Disable'}</button>`);
  tools.push(`<button type="button" class="surface-chip surface-chip--danger" data-card-action="remove" data-block-id="${block.id}">Remove</button>`);

  return `
    <div class="surface-block__chrome">
      <button type="button" class="surface-chip surface-chip--grab" data-card-action="select" data-block-id="${block.id}">
        ${escapeHtml(block.label || block.type)}
      </button>
      <div class="surface-block__tools">
        ${tools.join('')}
      </div>
    </div>
  `;
}

function renderSurfaceBlock(block) {
  const rect = getBlockRect(block);
  const selected = state.document?.ui?.selectedBlockId === block.id;
  return `
    <article
      class="surface-block${selected ? ' is-selected' : ''}${block.enabled === false ? ' is-disabled' : ''}${block.kind === 'legacy' ? ' is-legacy' : ''}"
      data-block-id="${block.id}"
      data-block-type="${block.type}"
      style="${positionRectStyle(rect)}"
    >
      ${renderBlockToolbar(block)}
      ${selected ? renderSurfaceFieldTargets(block, rect) : ''}
      ${selected ? `
        <button type="button" class="surface-resize surface-resize--e" data-resize="e" data-block-id="${block.id}" aria-label="Resize width"></button>
        <button type="button" class="surface-resize surface-resize--s" data-resize="s" data-block-id="${block.id}" aria-label="Resize height"></button>
        <button type="button" class="surface-resize surface-resize--se" data-resize="se" data-block-id="${block.id}" aria-label="Resize block"></button>
      ` : ''}
    </article>
  `;
}

function renderInlineSurfaceEditor() {
  elements.inlineEditor.innerHTML = '';
  if (!state.editing || state.editing.kind === 'tech-tags') return;
  const field = getDesignGeometryField(state.editing.fieldId);
  if (!field) return;

  const currentValue = String(getFieldValue(field) || '');
  const nextRect = clampPanelRect({
    left: field.rect.left,
    top: field.rect.top,
    width: field.rect.width,
    height: field.kind === 'textarea' ? Math.max(field.rect.height, 110) : Math.max(field.rect.height, 54),
  }, 180, field.kind === 'textarea' ? 96 : 48);

  const control = field.kind === 'textarea'
    ? `<textarea data-inline-editor="true" data-inline-scope="${field.scope}" data-inline-path="${field.path}" data-inline-block-id="${field.blockId || ''}" data-inline-localized="${field.localized ? 'true' : 'false'}">${escapeHtml(currentValue)}</textarea>`
    : `<input data-inline-editor="true" data-inline-scope="${field.scope}" data-inline-path="${field.path}" data-inline-block-id="${field.blockId || ''}" data-inline-localized="${field.localized ? 'true' : 'false'}" value="${escapeHtml(currentValue)}" />`;

  elements.inlineEditor.innerHTML = `
    <div class="surface-editor" style="${positionRectStyle(nextRect)}">
      ${control}
    </div>
  `;
}

function renderTechEditor() {
  elements.techEditor.innerHTML = '';
  if (!state.editing || state.editing.kind !== 'tech-tags') return;
  const field = getDesignGeometryField(state.editing.fieldId);
  if (!field) return;
  const tags = getFieldValue(field);
  const panelRect = clampPanelRect({
    left: field.rect.left,
    top: field.rect.top + field.rect.height + 10,
    width: 320,
    height: 220,
  }, 260, 180);

  elements.techEditor.innerHTML = `
    <div class="tech-editor-panel" style="${positionRectStyle(panelRect)}">
      <div class="tech-editor-panel__header">
        <h3>Tech tags</h3>
        <button type="button" class="surface-chip" data-tech-cancel="true">Close</button>
      </div>
      <div class="tech-editor-panel__chips">
        ${tags.length
          ? tags.map((tag, index) => `
            <span class="tech-editor-chip">
              <button type="button" data-tech-edit-index="${index}">${escapeHtml(tag)}</button>
              <button type="button" data-tech-remove-index="${index}">x</button>
            </span>
          `).join('')
          : '<span class="soft-note">No tags yet.</span>'}
      </div>
      <div class="tech-editor-panel__controls">
        <input type="text" data-tech-draft="true" value="${escapeHtml(state.techEditor.draft)}" placeholder="Add a tag" />
        <button type="button" class="surface-chip" data-tech-apply="true">${state.techEditor.editIndex === null ? 'Add' : 'Update'}</button>
        <button type="button" class="surface-chip surface-chip--danger" data-tech-reset="true">Clear</button>
      </div>
    </div>
  `;
}

function renderCanvas() {
  elements.canvasStage.classList.toggle('is-active', currentPreviewMode() === 'canvas');
  elements.previewStage.classList.toggle('is-active', currentPreviewMode() === 'preview');
  elements.designViewport.dataset.size = state.previewSize;
  elements.previewViewport.dataset.size = state.previewSize;
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
      ${isLayoutModeActive()
        ? `
          ${textInput({ label: 'Grid X', value: block.placement.desktop.x, path: 'placement.desktop.x', scope: 'block', blockId: block.id, type: 'number' })}
          ${textInput({ label: 'Grid Y', value: block.placement.desktop.y, path: 'placement.desktop.y', scope: 'block', blockId: block.id, type: 'number' })}
          ${textInput({ label: 'Width', value: block.placement.desktop.w, path: 'placement.desktop.w', scope: 'block', blockId: block.id, type: 'number' })}
          ${textInput({ label: 'Height', value: block.placement.desktop.h, path: 'placement.desktop.h', scope: 'block', blockId: block.id, type: 'number' })}
        `
        : '<div class="soft-note" style="grid-column: 1 / -1;">Use Layout mode when you need to move or resize this block precisely.</div>'}
    </div>
    ${body}
  `;
}

function renderAll() {
  renderProjectList();
  renderProjectHeader();
  renderCornerChrome();
  renderSegmented(elements.localeToggle, currentLocale(), 'locale');
  renderSegmented(elements.previewModeToggle, currentPreviewMode(), 'mode');
  renderSegmented(elements.previewSizeToggle, state.previewSize, 'previewSize');
  renderCanvas();
  renderProjectInspector();
  renderBlockInspector();
  syncDesignState();
}

function selectBlock(blockId) {
  updateDocument((document) => {
    document.ui.selectedBlockId = blockId || null;
    state.editing = null;
    if (!blockId && state.activeSheet === 'block') {
      state.activeSheet = null;
    }
  }, 'none');
}

function setEditing(payload) {
  state.editing = payload;
  renderAll();
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

function clearEditing(render = true) {
  state.editing = null;
  if (render) {
    renderAll();
  }
}

function applyTechEditorDraft() {
  const draft = state.techEditor.draft.trim();
  if (!draft) return;
  updateDocument((document) => {
    const nextTags = Array.isArray(document.meta?.tech) ? [...document.meta.tech] : [];
    if (state.techEditor.editIndex === null) {
      nextTags.push(draft);
    } else {
      nextTags[state.techEditor.editIndex] = draft;
    }
    document.meta.tech = [...new Set(nextTags.filter(Boolean))];
  });
  state.techEditor = { draft: '', editIndex: null };
  renderCanvas();
}

function removeTechEditorTag(index) {
  updateDocument((document) => {
    const nextTags = Array.isArray(document.meta?.tech) ? [...document.meta.tech] : [];
    nextTags.splice(index, 1);
    document.meta.tech = nextTags;
  });
  if (state.techEditor.editIndex === index) {
    state.techEditor = { draft: '', editIndex: null };
  }
  renderCanvas();
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

function applyFieldValue({ scope, path, blockId = '', localized = false, value }, previewReason = 'edit') {
  if (!path || !state.document) return;
  updateDocument((document) => {
    if (scope === 'meta') {
      if (localized) {
        ensureLocalizedTarget(document, path);
        const existing = getAtPath(document, path);
        existing[currentLocale()] = String(value);
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
      existing[currentLocale()] = String(value);
    } else {
      setAtPath(block, path, value);
    }
  }, previewReason);
}

function focusProjectTechInput() {
  state.activeSheet = 'project';
  renderAll();
  requestAnimationFrame(() => {
    const input = elements.projectInspector.querySelector('[data-meta-path="meta.tech"]');
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.setSelectionRange?.(input.value.length, input.value.length);
    }
  });
}

function handleBoundInput(target, scope) {
  const path = scope === 'meta' ? target.dataset.metaPath : target.dataset.blockPath;
  if (!path || !state.document) return;
  const localized = target.dataset.localized === 'true';
  const rawValue = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
  const nextValue = normalizeTypedValue(target, path, rawValue);
  applyFieldValue({
    scope,
    path,
    blockId: target.dataset.blockId || '',
    localized,
    value: nextValue,
  });
}

function preferredPlacementForInsertion(type, insertion = {}) {
  const defaultPlacement = createStudioBlockInstance(type, { id: '__preview__' }).placement.desktop;
  const blocks = state.document?.blocks || [];
  if (insertion?.placement) {
    return normalizePlacementForBreakpoint(type, insertion.placement, 'desktop');
  }
  if (insertion?.afterBlockId) {
    const anchor = blocks.find((block) => block.id === insertion.afterBlockId);
    if (anchor) {
      return normalizePlacementForBreakpoint(type, {
        ...defaultPlacement,
        x: anchor.placement.desktop.x,
        y: anchor.placement.desktop.y + anchor.placement.desktop.h,
      }, 'desktop');
    }
  }
  if (insertion?.atEnd) {
    const maxY = blocks.reduce((max, block) => Math.max(max, block.placement.desktop.y + block.placement.desktop.h), 0);
    return normalizePlacementForBreakpoint(type, {
      ...defaultPlacement,
      x: 0,
      y: maxY,
    }, 'desktop');
  }
  return defaultPlacement;
}

function addBlock(type, insertion = null) {
  if (!state.document) return;
  if (state.document.blocks.some((block) => block.type === type)) {
    setStatus(`${type} is already on the page`, 'error');
    return;
  }

  updateDocument((document) => {
    const preferredPlacement = preferredPlacementForInsertion(type, insertion || {});
    const block = createStudioBlockInstance(type, {
      id: createBlockId(type),
      placement: { desktop: preferredPlacement },
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

function updateInteractionPreview(clientX, clientY) {
  if (!state.canvasInteraction) return;
  const { blockId, blockType, mode, origin } = state.canvasInteraction;
  const deltaX = clientX - state.canvasInteraction.startX;
  const deltaY = clientY - state.canvasInteraction.startY;
  const geometry = getActiveGridGeometry();
  const gapX = Number.isFinite(geometry?.gapX) ? geometry.gapX : CANVAS_GAP;
  const columns = STUDIO_COLUMNS.desktop;
  const cellWidth = (Math.max(geometry?.rect?.width || 1, 1) - gapX * (columns - 1)) / columns;
  const dx = Math.round(deltaX / (cellWidth + gapX));
  const dy = Math.round(deltaY / (CANVAS_ROW_HEIGHT + CANVAS_GAP));
  const nextPlacement = { ...origin };

  if (mode === 'move') {
    nextPlacement.x += dx;
    nextPlacement.y += dy;
  } else {
    if (mode.includes('e')) nextPlacement.w += dx;
    if (mode.includes('s')) nextPlacement.h += dy;
  }

  const previewPlacement = mode === 'move'
    ? pointToPlacementForGeometry(blockType, clientX, clientY, nextPlacement, 'desktop')
    : normalizePlacementForBreakpoint(blockType, nextPlacement, 'desktop');

  state.canvasInteraction.previewPlacement = mode === 'move'
    ? { ...nextPlacement, x: previewPlacement.x, y: previewPlacement.y }
    : previewPlacement;

  syncDesignState();
}

function beginFrameInteraction({ blockId, mode, clientX, clientY }) {
  if (!state.document || !isLayoutModeActive()) return;
  const block = state.document.blocks.find((entry) => entry.id === blockId);
  if (!block) return;
  state.canvasInteraction = {
    blockId,
    blockType: block.type,
    mode,
    origin: { ...block.placement.desktop },
    startX: clientX,
    startY: clientY,
    previewPlacement: { ...block.placement.desktop },
  };
  selectBlock(blockId);
  syncDesignState();
}

function commitFrameInteraction({ clientX, clientY, cancelled = false }) {
  if (!state.canvasInteraction) return;
  if (!cancelled) {
    updateInteractionPreview(clientX, clientY);
    const nextPlacement = state.canvasInteraction.previewPlacement;
    const blockId = state.canvasInteraction.blockId;
    state.canvasInteraction = null;
    commitPlacement(blockId, nextPlacement);
  } else {
    state.canvasInteraction = null;
    syncDesignState();
  }
}

function handleDesignEvent(payload) {
  if (!payload || payload.session !== state.previewSessionId) return;

  if (payload.type === 'studio:design-geometry') {
    state.designGeometry = indexDesignGeometry(payload);
    renderCanvas();
    syncDesignState();
    return;
  }

  if (payload.type !== 'studio:design-event') return;

  switch (payload.event) {
    case 'select-block':
      selectBlock(payload.blockId || null);
      break;
    case 'clear-selection':
      selectBlock(null);
      break;
    case 'open-tech-dock':
      if (payload.blockId) {
        selectBlock(payload.blockId);
      }
      focusProjectTechInput();
      break;
    case 'open-block-settings':
      if (payload.blockId) {
        selectBlock(payload.blockId);
      }
      state.activeSheet = 'block';
      renderAll();
      break;
    case 'insert-block':
      if (payload.blockType) {
        addBlock(payload.blockType, {
          afterBlockId: payload.afterBlockId || null,
          atEnd: payload.atEnd === true,
        });
      }
      break;
    case 'toggle-layout-mode':
      state.layoutMode = !state.layoutMode;
      state.editing = null;
      renderAll();
      break;
    case 'block-action':
      if (payload.action === 'toggle' && payload.blockId) {
        updateDocument((document) => {
          const block = document.blocks.find((entry) => entry.id === payload.blockId);
          if (block) block.enabled = block.enabled === false;
        }, 'edit');
      }
      if (payload.action === 'remove' && payload.blockId) {
        updateDocument((document) => {
          document.blocks = document.blocks.filter((block) => block.id !== payload.blockId);
          if (document.ui.selectedBlockId === payload.blockId) {
            document.ui.selectedBlockId = document.blocks[0]?.id || null;
          }
          if (state.editing?.blockId === payload.blockId) {
            state.editing = null;
          }
          if (!document.ui.selectedBlockId && state.activeSheet === 'block') {
            state.activeSheet = null;
          }
        }, 'layout');
      }
      break;
    case 'field-edit-start':
      setEditing({
        fieldId: payload.fieldId,
        kind: payload.kind,
        scope: payload.scope,
        path: payload.path,
        blockId: payload.blockId || null,
      });
      break;
    case 'field-edit-input':
      applyFieldValue({
        scope: payload.scope,
        path: payload.path,
        blockId: payload.blockId || '',
        localized: payload.localized,
        value: payload.value,
      }, 'none');
      break;
    case 'field-edit-commit':
      applyFieldValue({
        scope: payload.scope,
        path: payload.path,
        blockId: payload.blockId || '',
        localized: payload.localized,
        value: payload.value,
      }, 'edit');
      clearEditing(false);
      syncDesignState();
      break;
    case 'field-edit-cancel':
      clearEditing();
      break;
    case 'interaction-start':
      beginFrameInteraction(payload);
      break;
    case 'interaction-update':
      updateInteractionPreview(payload.clientX, payload.clientY);
      break;
    case 'interaction-end':
      commitFrameInteraction(payload);
      break;
    default:
      break;
  }
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
    const rect = elements.designViewport.getBoundingClientRect();
    const insideCanvas =
      pointerEvent.clientX >= rect.left &&
      pointerEvent.clientX <= rect.right &&
      pointerEvent.clientY >= rect.top &&
      pointerEvent.clientY <= rect.bottom;

    if (insideCanvas) {
      if (isLayoutEditingEnabled() && state.designGeometry?.container?.rect) {
        const containerRect = state.designGeometry.container.rect;
        const placement = pointToPlacementForGeometry(
          type,
          pointerEvent.clientX - rect.left + containerRect.left,
          pointerEvent.clientY - rect.top + containerRect.top,
          null,
          'desktop',
        );
        addBlock(type, placement);
      } else {
        addBlock(type);
      }
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
  const cellWidth = (rect.width - CANVAS_GAP * 11) / 12;

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
    const dx = Math.round(deltaX / (state.canvasInteraction.cellWidth + CANVAS_GAP));
    const dy = Math.round(deltaY / (CANVAS_ROW_HEIGHT + CANVAS_GAP));
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
      applyPositionRect(target, placementToRect(state.canvasInteraction.blockType, finalPlacement));
    }
  };

  const end = (pointerEvent) => {
    if (!state.canvasInteraction) return;
    const deltaX = pointerEvent.clientX - state.canvasInteraction.startX;
    const deltaY = pointerEvent.clientY - state.canvasInteraction.startY;
    const dx = Math.round(deltaX / (state.canvasInteraction.cellWidth + CANVAS_GAP));
    const dy = Math.round(deltaY / (CANVAS_ROW_HEIGHT + CANVAS_GAP));
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
  state.designGeometry = null;
  state.layoutMode = false;
  state.activeSheet = null;
  state.menuOpen = false;
  renderAll();
  syncPreviewFrames();
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

  elements.projectList.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    if (!target.value) return;
    loadProject(target.value).catch(handleError);
  });

  elements.localeToggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-locale]');
    if (!button || !state.document) return;
    updateDocument((document) => {
      document.ui.locale = button.dataset.locale;
    }, 'none');
    syncPreviewFrames(Date.now());
  });

  elements.previewModeToggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-mode]');
    if (!button || !state.document) return;
    if (button.dataset.mode === 'preview') {
      state.layoutMode = false;
    }
    updateDocument((document) => {
      document.ui.previewMode = button.dataset.mode;
    }, 'none');
    if (button.dataset.mode === 'preview') schedulePreviewSync('save');
  });

  elements.previewSizeToggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-preview-size]');
    if (!button) return;
    state.previewSize = button.dataset.previewSize;
    if (!isLayoutEditingEnabled()) {
      state.layoutMode = false;
    }
    renderAll();
  });

  elements.menuToggle.addEventListener('click', () => {
    state.menuOpen = !state.menuOpen;
    renderAll();
  });

  elements.openProjectSettingsBtn.addEventListener('click', () => {
    state.activeSheet = 'project';
    state.menuOpen = false;
    renderAll();
  });

  elements.openBlockSettingsBtn.addEventListener('click', () => {
    if (!getSelectedBlock()) return;
    state.activeSheet = 'block';
    state.menuOpen = false;
    renderAll();
  });

  elements.toggleLayoutModeBtn.addEventListener('click', () => {
    if (!isLayoutEditingEnabled()) return;
    state.layoutMode = !state.layoutMode;
    state.editing = null;
    state.menuOpen = false;
    renderAll();
  });

  elements.closeSheetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.closeSheet === state.activeSheet) {
        state.activeSheet = null;
      }
      renderAll();
    });
  });

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

  window.addEventListener('message', (event) => {
    if (event.source !== elements.designFrame.contentWindow) return;
    handleDesignEvent(event.data);
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (
      state.menuOpen &&
      !target.closest('#studio-menu-panel') &&
      !target.closest('#studio-menu-toggle')
    ) {
      state.menuOpen = false;
      renderAll();
      return;
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (state.activeSheet) {
      state.activeSheet = null;
      renderAll();
      return;
    }
    if (state.menuOpen) {
      state.menuOpen = false;
      renderAll();
    }
  });

  elements.designFrame.addEventListener('load', () => {
    window.setTimeout(() => {
      syncDesignState();
    }, 0);
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
