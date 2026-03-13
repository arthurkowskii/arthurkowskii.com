import { createDefaultPayloadForBlock, getBlockConstraints, getBlockDefinitionList } from '../utils/block-registry.js';
import { createDesktopGridEditor } from './grid-editor.js';
import { summarizePlacement } from '../utils/project-layout.js';

const state = {
  bootstrap: null,
  currentProjectId: null,
  currentFolder: '3_tech',
  currentSlug: 'new_project',
  currentFrontmatter: null,
  currentBody: '',
  previewSize: 'desktop',
  previewSessionId: crypto.randomUUID(),
  previewSyncTimer: null,
  selectedBlockId: null,
  previewDirtyReason: 'idle',
  gridEditor: null,
};

const elements = {
  status: document.getElementById('studio-status'),
  projectList: document.getElementById('project-list'),
  presetSelect: document.getElementById('preset-select'),
  duplicateProjectBtn: document.getElementById('duplicate-project-btn'),
  createProjectBtn: document.getElementById('create-project-btn'),
  saveProjectBtn: document.getElementById('save-project-btn'),
  reloadProjectBtn: document.getElementById('reload-project-btn'),
  openProjectBtn: document.getElementById('open-project-btn'),
  fieldSlug: document.getElementById('field-slug'),
  fieldFolder: document.getElementById('field-folder'),
  fieldStatus: document.getElementById('field-status'),
  fieldDate: document.getElementById('field-date'),
  fieldLink: document.getElementById('field-link'),
  fieldGithub: document.getElementById('field-github'),
  fieldAccent: document.getElementById('field-accent'),
  fieldAssetsFolder: document.getElementById('field-assets-folder'),
  fieldTitleFr: document.getElementById('field-title-fr'),
  fieldTitleEn: document.getElementById('field-title-en'),
  fieldAltTitleFr: document.getElementById('field-alt-title-fr'),
  fieldAltTitleEn: document.getElementById('field-alt-title-en'),
  fieldDescriptionFr: document.getElementById('field-description-fr'),
  fieldDescriptionEn: document.getElementById('field-description-en'),
  fieldTech: document.getElementById('field-tech'),
  fieldShellMode: document.getElementById('field-shell-mode'),
  fieldShell: document.getElementById('field-shell'),
  fieldOrder: document.getElementById('field-order'),
  fieldAngleMode: document.getElementById('field-angle-mode'),
  fieldAngle: document.getElementById('field-angle'),
  fieldBody: document.getElementById('field-body'),
  blockTypeSelect: document.getElementById('block-type-select'),
  addBlockBtn: document.getElementById('add-block-btn'),
  blockList: document.getElementById('block-list'),
  previewFrame: document.getElementById('preview-frame'),
  previewViewport: document.getElementById('preview-viewport'),
  previewSizeButtons: Array.from(document.querySelectorAll('.preview-size-btn')),
  gridCanvas: document.getElementById('studio-grid-canvas'),
};

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

async function studioApi(url, options = {}) {
  return api(`/__studio${url}`, options);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function localized(value) {
  if (typeof value === 'string') return { fr: value, en: '' };
  return { fr: value?.fr || '', en: value?.en || '' };
}

function getBlocks() {
  state.currentFrontmatter.bento = state.currentFrontmatter.bento || {};
  state.currentFrontmatter.bento.layout = state.currentFrontmatter.bento.layout || {
    version: 2,
    columns: { desktop: 12, tablet: 8, mobile: 4 },
    blocks: [],
  };
  state.currentFrontmatter.bento.layout.blocks = state.currentFrontmatter.bento.layout.blocks || [];
  return state.currentFrontmatter.bento.layout.blocks;
}

function ensurePayloadForBlock(type) {
  state.currentFrontmatter.bento = state.currentFrontmatter.bento || {};
  if (state.currentFrontmatter.bento[type] === undefined) {
    const payload = createDefaultPayloadForBlock(type);
    if (payload !== null) state.currentFrontmatter.bento[type] = payload;
  }
}

function schedulePreviewSync(reason = 'form') {
  state.previewDirtyReason = reason;
  window.clearTimeout(state.previewSyncTimer);
  const delay = reason === 'commit' ? 120 : 260;
  state.previewSyncTimer = window.setTimeout(() => {
    postPreviewDraft().catch((error) => setStatus(error.message, 'error'));
  }, delay);
}

function applyFieldsToProject() {
  if (!state.currentFrontmatter) return;
  const frontmatter = state.currentFrontmatter;
  frontmatter.title = { fr: elements.fieldTitleFr.value.trim(), en: elements.fieldTitleEn.value.trim() };
  frontmatter.altTitle = { fr: elements.fieldAltTitleFr.value.trim(), en: elements.fieldAltTitleEn.value.trim() };
  frontmatter.description = { fr: elements.fieldDescriptionFr.value.trim(), en: elements.fieldDescriptionEn.value.trim() };
  frontmatter.status = elements.fieldStatus.value;
  frontmatter.date = elements.fieldDate.value;
  frontmatter.link = elements.fieldLink.value.trim() || undefined;
  frontmatter.github = elements.fieldGithub.value.trim() || undefined;
  frontmatter.tech = elements.fieldTech.value.split(',').map((item) => item.trim()).filter(Boolean);
  frontmatter.orbit = {
    shellMode: elements.fieldShellMode.value,
    shell: elements.fieldShell.value ? Number(elements.fieldShell.value) : undefined,
    order: elements.fieldOrder.value ? Number(elements.fieldOrder.value) : undefined,
    angleMode: elements.fieldAngleMode.value,
    angle: elements.fieldAngle.value ? Number(elements.fieldAngle.value) : undefined,
  };
  frontmatter.bento = frontmatter.bento || {};
  frontmatter.bento.accentColor = elements.fieldAccent.value.trim() || '#ff6b00';
  frontmatter.bento.assetsFolder = elements.fieldAssetsFolder.value.trim() || undefined;
  state.currentFolder = elements.fieldFolder.value;
  state.currentSlug = elements.fieldSlug.value.trim() || 'new_project';
  state.currentBody = elements.fieldBody.value;
  schedulePreviewSync('form');
}

function syncFieldsFromProject() {
  const frontmatter = state.currentFrontmatter;
  if (!frontmatter) return;
  const title = localized(frontmatter.title);
  const altTitle = localized(frontmatter.altTitle);
  const description = localized(frontmatter.description);
  const orbit = frontmatter.orbit || {};
  const bento = frontmatter.bento || {};

  elements.fieldSlug.value = state.currentSlug || '';
  elements.fieldFolder.value = state.currentFolder || '3_tech';
  elements.fieldStatus.value = frontmatter.status || 'planned';
  elements.fieldDate.value = frontmatter.date || '';
  elements.fieldLink.value = frontmatter.link || '';
  elements.fieldGithub.value = frontmatter.github || '';
  elements.fieldAccent.value = bento.accentColor || '#ff6b00';
  elements.fieldAssetsFolder.value = bento.assetsFolder || '';
  elements.fieldTitleFr.value = title.fr;
  elements.fieldTitleEn.value = title.en;
  elements.fieldAltTitleFr.value = altTitle.fr;
  elements.fieldAltTitleEn.value = altTitle.en;
  elements.fieldDescriptionFr.value = description.fr;
  elements.fieldDescriptionEn.value = description.en;
  elements.fieldTech.value = Array.isArray(frontmatter.tech) ? frontmatter.tech.join(', ') : '';
  elements.fieldShellMode.value = orbit.shellMode || 'auto';
  elements.fieldShell.value = orbit.shell || '';
  elements.fieldOrder.value = orbit.order ?? '';
  elements.fieldAngleMode.value = orbit.angleMode || 'auto';
  elements.fieldAngle.value = orbit.angle ?? '';
  elements.fieldBody.value = state.currentBody || '';
  renderBlocks();
  ensureGridEditor();
  state.gridEditor.render();
  syncPreviewFrame();
  schedulePreviewSync('form');
}

function renderProjectList() {
  elements.projectList.innerHTML = '';
  const projects = state.bootstrap?.projects || [];
  projects.forEach((project) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `project-item${project.id === state.currentProjectId ? ' active' : ''}`;
    const title = typeof project.title === 'string' ? project.title : project.title?.fr || project.slug;
    button.innerHTML = `<div class="project-item-title">${title}</div><div class="muted mono">${project.id}</div>`;
    button.addEventListener('click', () => loadProject(project.id));
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

function renderDomainSelect() {
  elements.fieldFolder.innerHTML = '';
  (state.bootstrap?.domains || []).forEach((folder) => {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    elements.fieldFolder.appendChild(option);
  });
}

function renderBlockTypeSelect() {
  elements.blockTypeSelect.innerHTML = '';
  getBlockDefinitionList().forEach((block) => {
    const option = document.createElement('option');
    option.value = block.type;
    option.textContent = block.label;
    elements.blockTypeSelect.appendChild(option);
  });
}

function renderBlocks() {
  const blocks = getBlocks();
  elements.blockList.innerHTML = '';
  blocks.forEach((block, index) => {
    const row = document.createElement('div');
    row.className = 'block-item';
    row.innerHTML = `
      <div class="block-head">
        <div>
          <strong>${block.type}</strong>
          <div class="muted mono">variant: ${block.variant || 'default'}</div>
          <div class="muted mono">${summarizePlacement(block, 'desktop')}</div>
        </div>
      </div>
    `;
    const actions = document.createElement('div');
    actions.className = 'block-actions';

    const selectBtn = document.createElement('button');
    selectBtn.textContent = state.selectedBlockId === block.id ? 'Selected' : 'Select';
    selectBtn.addEventListener('click', () => {
      state.selectedBlockId = block.id;
      state.gridEditor?.setSelected(block.id);
      renderBlocks();
    });

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = block.enabled === false ? 'Enable' : 'Disable';
    toggleBtn.addEventListener('click', () => {
      block.enabled = block.enabled === false;
      renderBlocks();
      state.gridEditor?.render();
      schedulePreviewSync('form');
    });

    const upBtn = document.createElement('button');
    upBtn.textContent = 'Up';
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => {
      const current = blocks[index];
      blocks[index] = blocks[index - 1];
      blocks[index - 1] = current;
      renderBlocks();
      state.gridEditor?.render();
      schedulePreviewSync('commit');
    });

    const downBtn = document.createElement('button');
    downBtn.textContent = 'Down';
    downBtn.disabled = index === blocks.length - 1;
    downBtn.addEventListener('click', () => {
      const current = blocks[index];
      blocks[index] = blocks[index + 1];
      blocks[index + 1] = current;
      renderBlocks();
      state.gridEditor?.render();
      schedulePreviewSync('commit');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'danger';
    deleteBtn.textContent = 'Remove';
    deleteBtn.addEventListener('click', () => {
      blocks.splice(index, 1);
      renderBlocks();
      state.gridEditor?.render();
      schedulePreviewSync('commit');
    });

    actions.append(selectBtn, toggleBtn, upBtn, downBtn, deleteBtn);
    row.appendChild(actions);
    elements.blockList.appendChild(row);
  });
}

function ensureGridEditor() {
  if (state.gridEditor) return;
  state.gridEditor = createDesktopGridEditor({
    root: elements.gridCanvas,
    getBlocks,
    getConstraints: getBlockConstraints,
    onSelect(blockId) {
      state.selectedBlockId = blockId;
      renderBlocks();
    },
    onPreview(blockId) {
      state.selectedBlockId = blockId;
      renderBlocks();
      state.gridEditor.render();
    },
    onCommit(blockId) {
      state.selectedBlockId = blockId;
      state.gridEditor.resolveAfterCommit(blockId);
      renderBlocks();
      schedulePreviewSync('commit');
    },
  });
}

function buildPreviewPayload() {
  return {
    slug: state.currentSlug,
    folder: state.currentFolder,
    frontmatter: state.currentFrontmatter,
    body: state.currentBody,
  };
}

function syncPreviewFrame() {
  elements.previewViewport.dataset.size = state.previewSize;
  const currentUrl = new URL(`/studio/preview?session=${encodeURIComponent(state.previewSessionId)}&lang=fr`, window.location.origin);
  elements.previewFrame.src = currentUrl.toString();
}

async function postPreviewDraft() {
  if (!state.currentFrontmatter) return;
  setStatus(state.previewDirtyReason === 'commit' ? 'Preview updating after layout change...' : 'Preview updating...', '');
  await api('/api/studio-preview.json', {
    method: 'POST',
    body: JSON.stringify({ session: state.previewSessionId, draft: buildPreviewPayload() }),
  });
  const url = new URL(`/studio/preview?session=${encodeURIComponent(state.previewSessionId)}&lang=fr&t=${Date.now()}`, window.location.origin);
  elements.previewFrame.src = url.toString();
  setStatus('Preview synced', 'ok');
}

async function loadBootstrap() {
  state.bootstrap = await studioApi('/bootstrap');
  renderPresetSelect();
  renderDomainSelect();
  renderBlockTypeSelect();
  renderProjectList();
}

async function loadProject(projectId) {
  setStatus('Loading project...');
  const project = await studioApi(`/project?id=${encodeURIComponent(projectId)}`);
  state.currentProjectId = project.id;
  state.currentFolder = project.folder;
  state.currentSlug = project.slug;
  state.currentFrontmatter = clone(project.frontmatter);
  state.currentBody = project.body || '';
  syncFieldsFromProject();
  renderProjectList();
  setStatus(`Loaded ${project.id}`, 'ok');
}

async function createFromPreset() {
  setStatus('Creating draft...');
  const draft = await studioApi(`/draft?preset=${encodeURIComponent(elements.presetSelect.value)}`);
  state.currentProjectId = null;
  state.currentFrontmatter = clone(draft.frontmatter);
  state.currentFolder = draft.frontmatter.__presetDomainFolder || draft.domains?.[0] || '3_tech';
  state.currentSlug = 'new_project';
  state.currentBody = draft.body || '';
  syncFieldsFromProject();
  setStatus('Draft ready', 'ok');
}

async function duplicateCurrentProject() {
  if (!state.currentProjectId) {
    setStatus('Load a project before duplicating it', 'error');
    return;
  }
  setStatus('Duplicating project...');
  const duplicate = await studioApi(`/duplicate?id=${encodeURIComponent(state.currentProjectId)}`);
  state.currentProjectId = null;
  state.currentFrontmatter = clone(duplicate.frontmatter);
  state.currentFolder = duplicate.sourceId.split('/')[0];
  state.currentSlug = `${state.currentSlug || 'project'}_copy`;
  state.currentBody = duplicate.body || '';
  syncFieldsFromProject();
  setStatus('Duplicate ready - save with a new slug', 'ok');
}

async function saveCurrentProject() {
  if (!state.currentFrontmatter) return;
  applyFieldsToProject();
  setStatus('Saving project...');
  const result = await studioApi('/save', {
    method: 'POST',
    body: JSON.stringify({
      id: state.currentProjectId,
      folder: state.currentFolder,
      slug: state.currentSlug,
      frontmatter: state.currentFrontmatter,
      body: state.currentBody,
    }),
  });
  state.currentProjectId = result.id;
  state.currentSlug = result.slug;
  state.currentFolder = result.folder;
  setStatus(`Saved ${result.id}`, 'ok');
  await loadBootstrap();
  renderProjectList();
  schedulePreviewSync('commit');
}

function attachFieldListeners() {
  Object.values(elements)
    .filter((element) => element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)
    .forEach((field) => {
      if (field === elements.presetSelect || field === elements.blockTypeSelect) return;
      field.addEventListener('input', applyFieldsToProject);
      field.addEventListener('change', applyFieldsToProject);
    });

  elements.createProjectBtn.addEventListener('click', () => createFromPreset().catch((error) => setStatus(error.message, 'error')));
  elements.duplicateProjectBtn.addEventListener('click', () => duplicateCurrentProject().catch((error) => setStatus(error.message, 'error')));
  elements.saveProjectBtn.addEventListener('click', () => saveCurrentProject().catch((error) => setStatus(error.message, 'error')));
  elements.reloadProjectBtn.addEventListener('click', () => {
    if (!state.currentProjectId) return;
    loadProject(state.currentProjectId).catch((error) => setStatus(error.message, 'error'));
  });
  elements.openProjectBtn.addEventListener('click', () => window.open(`/projects/${state.currentSlug}`, '_blank', 'noopener'));
  elements.addBlockBtn.addEventListener('click', () => {
    if (!state.currentFrontmatter) return;
    const type = elements.blockTypeSelect.value;
    ensurePayloadForBlock(type);
    const blocks = getBlocks();
    blocks.push({
      id: `${type}-${blocks.length + 1}`,
      type,
      enabled: true,
      variant: (type === 'audio' || type === 'sampler') ? 'wide' : 'default',
      placement: {
        desktop: { x: 0, y: blocks.length, w: 4, h: 1 },
        tablet: { x: 0, y: blocks.length, w: 4, h: 1 },
        mobile: { x: 0, y: blocks.length, w: 4, h: 1 },
      },
    });
    state.selectedBlockId = `${type}-${blocks.length}`;
    renderBlocks();
    state.gridEditor?.render();
    schedulePreviewSync('commit');
  });
  elements.previewSizeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.previewSize = button.dataset.previewSize || 'desktop';
      elements.previewViewport.dataset.size = state.previewSize;
    });
  });
}

async function init() {
  try {
    await loadBootstrap();
    attachFieldListeners();
    ensureGridEditor();
    if (state.bootstrap?.projects?.length) {
      await loadProject(state.bootstrap.projects[0].id);
    } else {
      await createFromPreset();
    }
    syncPreviewFrame();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Failed to load studio', 'error');
  }
}

window.addEventListener('beforeunload', () => {
  fetch(`/api/studio-preview.json?session=${encodeURIComponent(state.previewSessionId)}`, { method: 'DELETE' }).catch(() => {});
});

init();
