import { STUDIO_COLUMNS } from './studio-document.js';
import { getBlockConstraints } from '../utils/block-registry.js';

export const CANVAS_ROW_HEIGHT = 74;
export const CANVAS_GAP = 14;
let activeEditing = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function localizedValue(value, locale) {
  if (typeof value === 'string') return value;
  return value?.[locale] || value?.fr || value?.en || '';
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function copyPlacement(placement) {
  return {
    x: placement.x,
    y: placement.y,
    w: placement.w,
    h: placement.h,
  };
}

function cloneBlock(block) {
  return {
    ...block,
    placement: {
      ...block.placement,
      desktop: copyPlacement(block.placement?.desktop || { x: 0, y: 0, w: 1, h: 1 }),
    },
  };
}

export function overlaps(a, b) {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

export function normalizeDesktopPlacement(type, placement) {
  const constraints = getBlockConstraints(type, 'studio');
  const columns = STUDIO_COLUMNS.desktop;
  const maxW = Math.min(constraints.maxW || columns, columns);
  const minW = Math.min(constraints.minW || 1, maxW);
  const minH = constraints.minH || 1;
  const w = clamp(Number.isFinite(placement?.w) ? placement.w : minW, minW, maxW);
  return {
    x: clamp(Number.isFinite(placement?.x) ? placement.x : 0, 0, columns - w),
    y: Math.max(0, Number.isFinite(placement?.y) ? placement.y : 0),
    w,
    h: Math.max(minH, Number.isFinite(placement?.h) ? placement.h : minH),
  };
}

export function resolveDesktopCollisions(blocks, activeBlockId) {
  const nextBlocks = blocks.map((block) => cloneBlock(block));

  const active = nextBlocks.find((block) => block.id === activeBlockId);
  if (!active) return nextBlocks;

  const queue = [active];
  while (queue.length) {
    const current = queue.shift();
    nextBlocks.forEach((candidate) => {
      if (candidate.id === current.id) return;
      if (!overlaps(current.placement.desktop, candidate.placement.desktop)) return;
      candidate.placement.desktop.y = current.placement.desktop.y + current.placement.desktop.h;
      queue.push(candidate);
    });
  }

  return nextBlocks;
}

export function normalizeBlocksForCanvas(blocks, activeBlockId = null) {
  let nextBlocks = blocks.map((block) => {
    const nextBlock = cloneBlock(block);
    nextBlock.placement.desktop = normalizeDesktopPlacement(block.type, nextBlock.placement.desktop);
    return nextBlock;
  });

  const orderedIds = nextBlocks
    .map((block, index) => ({
      id: block.id,
      index,
      x: block.placement.desktop.x,
      y: block.placement.desktop.y,
    }))
    .sort((left, right) => {
      if (left.id === activeBlockId) return 1;
      if (right.id === activeBlockId) return -1;
      if (left.y !== right.y) return left.y - right.y;
      if (left.x !== right.x) return left.x - right.x;
      return left.index - right.index;
    })
    .map((entry) => entry.id);

  orderedIds.forEach((blockId) => {
    nextBlocks = resolveDesktopCollisions(nextBlocks, blockId);
  });

  return nextBlocks;
}

export function findNextOpenPlacement(blocks, type, preferredPlacement) {
  const base = normalizeDesktopPlacement(type, preferredPlacement);
  const columns = STUDIO_COLUMNS.desktop;

  for (let row = 0; row < 120; row += 1) {
    for (let column = 0; column <= columns - base.w; column += 1) {
      const candidate = { ...base, x: column, y: row };
      const hasCollision = blocks.some((block) => overlaps(block.placement.desktop, candidate));
      if (!hasCollision) return candidate;
    }
  }

  return base;
}

export function clientPointToPlacement(root, blockType, clientX, clientY, originPlacement = null) {
  const rect = root.getBoundingClientRect();
  const cellWidth = (rect.width - CANVAS_GAP * (STUDIO_COLUMNS.desktop - 1)) / STUDIO_COLUMNS.desktop;
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  const base = normalizeDesktopPlacement(blockType, originPlacement || { x: 0, y: 0, w: 4, h: 1 });
  const x = clamp(Math.round(relativeX / (cellWidth + CANVAS_GAP)), 0, STUDIO_COLUMNS.desktop - base.w);
  const y = Math.max(0, Math.round(relativeY / (CANVAS_ROW_HEIGHT + CANVAS_GAP)));
  return { ...base, x, y };
}

function placementStyle(placement) {
  return [
    `--grid-column: ${placement.x + 1}`,
    `--grid-row: ${placement.y + 1}`,
    `--grid-width: ${placement.w}`,
    `--grid-height: ${placement.h}`,
  ].join('; ');
}

function isEditing(editing, scope, path, blockId) {
  return Boolean(
    editing &&
    editing.scope === scope &&
    editing.path === path &&
    (scope !== 'block' || editing.blockId === blockId)
  );
}

function renderInlineValue({
  scope,
  blockId,
  path,
  value,
  locale,
  multiline = false,
  editing = null,
  className = '',
  editable = true,
}) {
  const text = localizedValue(value, locale) || (editable ? 'Click to edit' : 'Edit in sidebar');
  const editingNow = isEditing(editing || activeEditing, scope, path, blockId);
  const localized = typeof value !== 'string';

  if (!editable) {
    return `<div class="canvas-static ${className}">${escapeHtml(text)}</div>`;
  }

  if (editingNow) {
    if (multiline) {
      return `<textarea class="inline-editor ${className}" data-inline-editor="true" data-inline-localized="${localized}" data-inline-scope="${scope}" data-inline-path="${path}" ${blockId ? `data-inline-block-id="${blockId}"` : ''}>${escapeHtml(text)}</textarea>`;
    }

    return `<input class="inline-editor ${className}" data-inline-editor="true" data-inline-localized="${localized}" data-inline-scope="${scope}" data-inline-path="${path}" ${blockId ? `data-inline-block-id="${blockId}"` : ''} value="${escapeHtml(text)}" />`;
  }

  return `<button type="button" class="inline-value ${className}" data-inline-target="true" data-inline-localized="${localized}" data-inline-scope="${scope}" data-inline-path="${path}" ${blockId ? `data-inline-block-id="${blockId}"` : ''}>${escapeHtml(text)}</button>`;
}

function renderListPreview(items, renderItem, emptyLabel) {
  if (!Array.isArray(items) || items.length === 0) {
    return `<div class="canvas-empty-copy">${escapeHtml(emptyLabel)}</div>`;
  }
  return items.map(renderItem).join('');
}

function renderLegacySummary(block, locale) {
  switch (block.type) {
    case 'audio':
      return `${Array.isArray(block.content?.tracks) ? block.content.tracks.length : 0} tracks`;
    case 'sampler':
      return `${Array.isArray(block.content?.samplePool) ? block.content.samplePool.length : 0} samples`;
    case 'musicLinks':
      return `${Array.isArray(block.content?.items) ? block.content.items.length : 0} links`;
    case 'fmod':
      return `${Array.isArray(block.content?.events) ? block.content.events.length : 0} events`;
    default:
      return localizedValue(block.content?.title, locale) || 'Legacy block';
  }
}

function renderBlockBody(block, document, locale, editing, placement) {
  const meta = document.meta || {};
  const compact = placement.w <= 4 || placement.h <= 2;
  const canInline = block.type === 'hero' || !compact;

  switch (block.type) {
    case 'hero':
      return `
        <div class="canvas-hero">
          <div class="canvas-hero__art"></div>
          <div class="canvas-hero__copy">
            ${renderInlineValue({ scope: 'meta', path: 'title', value: meta.title, locale, className: 'canvas-title', editable: true })}
            ${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.subtitle', value: block.content?.subtitle, locale, className: 'canvas-kicker', editable: true })}
            ${renderInlineValue({ scope: 'meta', path: 'description', value: meta.description, locale, multiline: true, editing, className: 'canvas-body', editable: true })}
          </div>
        </div>
      `;
    case 'stats':
      return `
        <div class="canvas-card__heading">Project stats</div>
        <div class="canvas-stats">
          ${renderListPreview(
            block.content?.items,
            (item, index) => `
              <div class="canvas-stat">
                ${renderInlineValue({ scope: 'block', blockId: block.id, path: `content.items.${index}.value`, value: item?.value || '', locale, className: 'canvas-stat__value', editable: canInline })}
                ${renderInlineValue({ scope: 'block', blockId: block.id, path: `content.items.${index}.label`, value: item?.label, locale, className: 'canvas-stat__label', editable: canInline })}
              </div>
            `,
            'Add stat items from the inspector.',
          )}
        </div>
      `;
    case 'actions':
      return `
        <div class="canvas-card__heading">${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.title', value: block.content?.title, locale, editable: canInline })}</div>
        <div class="canvas-actions">
          ${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.primary.text', value: block.content?.primary?.text, locale, className: 'canvas-action canvas-action--primary', editable: canInline })}
          ${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.secondary.text', value: block.content?.secondary?.text, locale, className: 'canvas-action canvas-action--secondary', editable: canInline })}
        </div>
      `;
    case 'tech':
      return `
        <div class="canvas-card__heading">${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.title', value: block.content?.title, locale, editable: canInline })}</div>
        <div class="canvas-pill-row">
          ${renderListPreview(
            meta.tech,
            (item) => `<span class="canvas-pill">${escapeHtml(item)}</span>`,
            'Add technology tags from project settings.',
          )}
        </div>
      `;
    case 'process':
      return `
        <div class="canvas-card__heading">${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.title', value: block.content?.title, locale, editable: canInline })}</div>
        ${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.subtitle', value: block.content?.subtitle, locale, className: 'canvas-subtle', editable: canInline })}
        <div class="canvas-list">
          ${renderListPreview(
            block.content?.steps,
            (item, index) => `
              <div class="canvas-list__row">
                <span class="canvas-index">${String(index + 1).padStart(2, '0')}</span>
                ${renderInlineValue({ scope: 'block', blockId: block.id, path: `content.steps.${index}`, value: item, locale, multiline: true, editing, className: 'canvas-list__value', editable: canInline })}
              </div>
            `,
            'Add steps from the inspector.',
          )}
        </div>
      `;
    case 'gallery':
      return `
        <div class="canvas-card__heading">${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.title', value: block.content?.title, locale, editable: canInline })}</div>
        <div class="canvas-subtle">${escapeHtml(block.content?.source === 'manual' ? 'Manual image list' : 'Assets folder mode')}</div>
        <div class="canvas-gallery">
          ${Array.isArray(block.content?.images) && block.content.images.length
            ? block.content.images.slice(0, 4).map((image) => `<div class="canvas-gallery__tile">${escapeHtml(image.alt || image.src || 'Image')}</div>`).join('')
            : '<div class="canvas-gallery__hero">Asset preview</div><div class="canvas-gallery__tile">Image</div><div class="canvas-gallery__tile">Image</div><div class="canvas-gallery__tile">Image</div>'}
        </div>
      `;
    case 'challenges':
      return `
        <div class="canvas-card__heading">${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.title', value: block.content?.title, locale, editable: canInline })}</div>
        ${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.subtitle', value: block.content?.subtitle, locale, className: 'canvas-subtle', editable: canInline })}
        <div class="canvas-list">
          ${renderListPreview(
            block.content?.items,
            (item, index) => `
              <div class="canvas-copy-pair">
                ${renderInlineValue({ scope: 'block', blockId: block.id, path: `content.items.${index}.title`, value: item?.title, locale, className: 'canvas-copy-pair__title', editable: canInline })}
                ${renderInlineValue({ scope: 'block', blockId: block.id, path: `content.items.${index}.description`, value: item?.description, locale, multiline: true, editing, className: 'canvas-copy-pair__body', editable: canInline })}
              </div>
            `,
            'Add challenge items from the inspector.',
          )}
        </div>
      `;
    case 'results':
      return `
        <div class="canvas-card__heading">${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.title', value: block.content?.title, locale, editable: canInline })}</div>
        ${renderInlineValue({ scope: 'block', blockId: block.id, path: 'content.subtitle', value: block.content?.subtitle, locale, className: 'canvas-subtle', editable: canInline })}
        <div class="canvas-list">
          ${renderListPreview(
            block.content?.items,
            (item, index) => `
              <div class="canvas-result">
                ${renderInlineValue({ scope: 'block', blockId: block.id, path: `content.items.${index}.icon`, value: item?.icon || '*', locale, className: 'canvas-result__icon', editable: canInline })}
                ${renderInlineValue({ scope: 'block', blockId: block.id, path: `content.items.${index}.text`, value: item?.text, locale, multiline: true, editing, className: 'canvas-result__body', editable: canInline })}
              </div>
            `,
            'Add result items from the inspector.',
          )}
        </div>
      `;
    default:
      return `
        <div class="canvas-card__heading">${escapeHtml(block.label || block.type)}</div>
        <div class="canvas-subtle">${escapeHtml(renderLegacySummary(block, locale))}</div>
        <div class="legacy-pill">Legacy block</div>
      `;
  }
}

export function renderStudioCanvas(root, document, { locale = 'fr', selectedBlockId = null, editing = null, blocks = null } = {}) {
  activeEditing = editing;
  const canvasBlocks = Array.isArray(blocks) ? blocks : Array.isArray(document?.blocks) ? document.blocks : [];
  const maxRow = canvasBlocks.reduce((value, block) => {
    const placement = block.placement?.desktop || { y: 0, h: 1 };
    return Math.max(value, placement.y + placement.h);
  }, 7);

  root.style.setProperty('--canvas-rows', String(maxRow));
  root.innerHTML = canvasBlocks
    .map((block) => {
      const placement = block.placement?.desktop || { x: 0, y: 0, w: 4, h: 1 };
      const compact = placement.w <= 4 || placement.h <= 2;
      return `
        <article
          class="canvas-card${selectedBlockId === block.id ? ' is-selected' : ''}${block.enabled === false ? ' is-disabled' : ''}${block.kind === 'legacy' ? ' is-legacy' : ''}${compact ? ' is-compact' : ''}"
          data-block-id="${block.id}"
          data-block-type="${block.type}"
          style="${placementStyle(placement)}"
        >
          <div class="canvas-card__chrome">
            <button type="button" class="canvas-chip canvas-chip--move" data-card-action="select" data-block-id="${block.id}" title="${escapeHtml(block.label || block.type)}">
              <span class="canvas-chip__label">${escapeHtml(block.label || block.type)}</span>
            </button>
            <div class="canvas-card__tools">
              <button type="button" class="canvas-chip" data-card-action="toggle" data-block-id="${block.id}">
                ${block.enabled === false ? 'Enable' : 'Disable'}
              </button>
              <button type="button" class="canvas-chip canvas-chip--danger" data-card-action="remove" data-block-id="${block.id}">
                Remove
              </button>
            </div>
          </div>
          <div class="canvas-card__body">
            ${renderBlockBody(block, document, locale, editing, placement)}
          </div>
          <div class="canvas-resize canvas-resize--e" data-resize="e"></div>
          <div class="canvas-resize canvas-resize--s" data-resize="s"></div>
          <div class="canvas-resize canvas-resize--se" data-resize="se"></div>
        </article>
      `;
    })
    .join('');
  activeEditing = null;
}
