import {
  BLOCK_TYPES,
  DEFAULT_BLOCK_ORDER,
  DEFAULT_CARD_VISIBILITY,
  DEFAULT_LAYOUT_COLUMNS,
  LAYOUT_BREAKPOINTS,
} from '../content/project-schema.js';
import {
  getBlockConstraints,
  getBlockPlacementDefaults,
} from './block-registry.js';

const DEFAULT_PROFILE = 'published';

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneValue(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildLegacyCardMap(bento = {}) {
  return {
    ...DEFAULT_CARD_VISIBILITY,
    ...(bento.cards || {}),
  };
}

function deriveVariant(type, cards, bento) {
  if (type === 'audio' && cards.audio && !cards.sampler) return 'wide';
  if (type === 'sampler' && cards.sampler && !cards.audio) return 'wide';
  if (type === 'soundcloud' && bento?.soundcloud?.large) return 'large';
  return 'default';
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeProfile(profile = DEFAULT_PROFILE) {
  return profile === 'studio' ? 'studio' : DEFAULT_PROFILE;
}

function arrayHasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function hasRenderableMusicLinks(bento = {}) {
  return Array.isArray(bento?.musicLinks?.items) && bento.musicLinks.items.length === 4;
}

function hasRenderableGallery(bento = {}) {
  return Boolean(cleanText(bento?.assetsFolder)) || arrayHasItems(bento?.gallery?.images);
}

function hasPayload(type, bento = {}, meta = {}) {
  switch (type) {
    case 'hero':
      return true;
    case 'stats':
      return arrayHasItems(bento?.stats);
    case 'musicLinks':
      return arrayHasItems(bento?.musicLinks?.items);
    case 'actions':
      return Boolean(bento?.actions?.primary || bento?.actions?.secondary);
    case 'tech':
      return arrayHasItems(meta?.tech);
    case 'process':
      return arrayHasItems(bento?.process?.steps);
    case 'gallery':
      return hasRenderableGallery(bento);
    case 'challenges':
      return arrayHasItems(bento?.challenges?.items);
    case 'results':
      return arrayHasItems(bento?.results?.items);
    case 'video':
    case 'spotify':
    case 'soundcloud':
      return Boolean(cleanText(bento?.[type]?.url));
    case 'audio':
      return arrayHasItems(bento?.audio?.tracks);
    case 'sampler':
      return arrayHasItems(bento?.sampler?.samplePool);
    case 'fmod':
      return Boolean(cleanText(bento?.fmod?.folder)) || arrayHasItems(bento?.fmod?.events);
    default:
      return false;
  }
}

function isVisible(type, cards, bento = {}, meta = {}) {
  if (cards[type] === false) return false;

  switch (type) {
    case 'hero':
      return true;
    case 'musicLinks':
      return hasRenderableMusicLinks(bento);
    case 'stats':
      return arrayHasItems(bento?.stats) && !hasRenderableMusicLinks(bento);
    case 'gallery':
      return hasRenderableGallery(bento);
    default:
      return hasPayload(type, bento, meta);
  }
}

export function getBentoBlockStates(bento = {}, options = {}) {
  const cards = buildLegacyCardMap(bento);
  const meta = options.meta || {};

  return Object.fromEntries(
    DEFAULT_BLOCK_ORDER.map((type) => {
      const payload = hasPayload(type, bento, meta);
      return [
        type,
        {
          enabled: cards[type] !== false,
          hasPayload: payload,
          visible: isVisible(type, cards, bento, meta),
        },
      ];
    }),
  );
}

export function hasStoredLayoutBlocks(bento = {}) {
  return Array.isArray(bento?.layout?.blocks) && bento.layout.blocks.length > 0;
}

function normalizePlacementValue(rawPlacement, breakpoint, type, profile = DEFAULT_PROFILE) {
  const columns = DEFAULT_LAYOUT_COLUMNS[breakpoint];
  const defaults = getBlockPlacementDefaults(type, profile)[breakpoint];
  const constraints = getBlockConstraints(type, profile);
  const maxW = Math.min(constraints.maxW || columns, columns);
  const minW = Math.min(constraints.minW || 1, maxW);
  const minH = constraints.minH || 1;

  const x = clamp(Number.isFinite(rawPlacement?.x) ? rawPlacement.x : defaults.x, 0, Math.max(0, columns - 1));
  const w = clamp(Number.isFinite(rawPlacement?.w) ? rawPlacement.w : defaults.w, minW, maxW);
  const safeX = clamp(x, 0, Math.max(0, columns - w));
  const y = Math.max(0, Number.isFinite(rawPlacement?.y) ? rawPlacement.y : defaults.y);
  const h = Math.max(minH, Number.isFinite(rawPlacement?.h) ? rawPlacement.h : defaults.h);

  return { x: safeX, y, w, h };
}

export function normalizeBlockPlacement(type, placement, options = {}) {
  const profile = normalizeProfile(options.profile);
  const defaults = getBlockPlacementDefaults(type, profile);
  const source = isObject(placement) ? placement : defaults;

  return {
    desktop: normalizePlacementValue(source.desktop, 'desktop', type, profile),
    tablet: normalizePlacementValue(source.tablet, 'tablet', type, profile),
    mobile: normalizePlacementValue(source.mobile, 'mobile', type, profile),
  };
}

function overlaps(a, b) {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

function sortBlockIds(blocks, breakpoint, priority = null) {
  const defaultIndexes = new Map(DEFAULT_BLOCK_ORDER.map((type, index) => [type, index]));
  const priorityIndex = priority
    ? new Map(priority.map((id, index) => [id, index]))
    : null;

  return blocks
    .map((block, index) => ({ block, index }))
    .sort((left, right) => {
      if (priorityIndex) {
        const leftPriority = priorityIndex.has(left.block.id) ? priorityIndex.get(left.block.id) : Number.MAX_SAFE_INTEGER;
        const rightPriority = priorityIndex.has(right.block.id) ? priorityIndex.get(right.block.id) : Number.MAX_SAFE_INTEGER;
        if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      }

      const a = left.block.placement?.[breakpoint] || { y: 0, x: 0 };
      const b = right.block.placement?.[breakpoint] || { y: 0, x: 0 };
      if (a.y !== b.y) return a.y - b.y;
      if (a.x !== b.x) return a.x - b.x;

      const leftDefault = defaultIndexes.get(left.block.type) ?? Number.MAX_SAFE_INTEGER;
      const rightDefault = defaultIndexes.get(right.block.type) ?? Number.MAX_SAFE_INTEGER;
      if (leftDefault !== rightDefault) return leftDefault - rightDefault;

      return left.index - right.index;
    })
    .map(({ block }) => block.id);
}

function resolveCollisionsForBreakpoint(blocks, breakpoint, orderedIds) {
  const nextBlocks = blocks.map((block) => cloneValue(block));

  orderedIds.forEach((blockId) => {
    const active = nextBlocks.find((block) => block.id === blockId);
    if (!active) return;

    const queue = [active];
    while (queue.length) {
      const current = queue.shift();
      nextBlocks.forEach((candidate) => {
        if (candidate.id === current.id) return;
        if (!overlaps(current.placement[breakpoint], candidate.placement[breakpoint])) return;
        candidate.placement[breakpoint].y = current.placement[breakpoint].y + current.placement[breakpoint].h;
        queue.push(candidate);
      });
    }
  });

  return nextBlocks;
}

export function normalizeLayoutBlocks(blocks = [], options = {}) {
  const profile = normalizeProfile(options.profile);
  const priority = Array.isArray(options.priority) ? options.priority : null;

  let nextBlocks = blocks.map((block) => ({
    ...cloneValue(block),
    placement: normalizeBlockPlacement(block.type, block.placement, { profile }),
  }));

  LAYOUT_BREAKPOINTS.forEach((breakpoint) => {
    const orderedIds = sortBlockIds(nextBlocks, breakpoint, priority);
    nextBlocks = resolveCollisionsForBreakpoint(nextBlocks, breakpoint, orderedIds);
  });

  return nextBlocks;
}

function normalizeBlock(block, cards, bento, index, profile = DEFAULT_PROFILE) {
  if (!block || typeof block !== 'object') return null;
  const type = BLOCK_TYPES.includes(block.type) ? block.type : null;
  if (!type) return null;

  return {
    id: typeof block.id === 'string' && block.id.trim() ? block.id.trim() : `${type}-${index + 1}`,
    type,
    enabled: block.enabled !== false,
    variant: block.variant || deriveVariant(type, cards, bento),
    placement: normalizeBlockPlacement(type, block.placement, { profile }),
  };
}

function createSeedBlock(type, index, cards, bento, profile = DEFAULT_PROFILE) {
  return {
    id: `${type}-${index + 1}`,
    type,
    enabled: cards[type] !== false,
    variant: deriveVariant(type, cards, bento),
    placement: normalizeBlockPlacement(type, null, { profile }),
  };
}

function buildSynthesisPriority(blocks, states) {
  const defaultIndexes = new Map(DEFAULT_BLOCK_ORDER.map((type, index) => [type, index]));

  return blocks
    .map((block, index) => ({ block, index }))
    .sort((left, right) => {
      const leftState = states[left.block.type] || { visible: false, hasPayload: false };
      const rightState = states[right.block.type] || { visible: false, hasPayload: false };
      const leftBucket = leftState.visible ? 0 : leftState.hasPayload ? 1 : 2;
      const rightBucket = rightState.visible ? 0 : rightState.hasPayload ? 1 : 2;
      if (leftBucket !== rightBucket) return leftBucket - rightBucket;

      const a = left.block.placement.desktop;
      const b = right.block.placement.desktop;
      if (a.y !== b.y) return a.y - b.y;
      if (a.x !== b.x) return a.x - b.x;

      const leftDefault = defaultIndexes.get(left.block.type) ?? Number.MAX_SAFE_INTEGER;
      const rightDefault = defaultIndexes.get(right.block.type) ?? Number.MAX_SAFE_INTEGER;
      if (leftDefault !== rightDefault) return leftDefault - rightDefault;

      return left.index - right.index;
    })
    .map(({ block }) => block.id);
}

function synthesizeLegacyLayout(cards, bento, meta = {}, profile = 'studio') {
  const states = getBentoBlockStates(bento, { meta });
  const seeds = DEFAULT_BLOCK_ORDER.map((type, index) => createSeedBlock(type, index, cards, bento, profile));
  const priority = buildSynthesisPriority(seeds, states);
  return normalizeLayoutBlocks(seeds, { profile, priority });
}

export function createDefaultLayoutBlocks(options = {}) {
  const profile = normalizeProfile(options.profile);
  return DEFAULT_BLOCK_ORDER.map((type, index) => ({
    id: `${type}-${index + 1}`,
    type,
    enabled: DEFAULT_CARD_VISIBILITY[type] !== false,
    variant: 'default',
    placement: normalizeBlockPlacement(type, null, { profile }),
  }));
}

export function normalizeBentoLayout(bento = {}, options = {}) {
  const profile = normalizeProfile(options.profile);
  const synthesizeProfile = normalizeProfile(options.synthesizeProfile || profile);
  const meta = options.meta || {};
  const cards = buildLegacyCardMap(bento);
  const storedBlocks = hasStoredLayoutBlocks(bento) ? bento.layout.blocks : null;
  const storedVersion = Number.isFinite(bento?.layout?.version) ? bento.layout.version : 1;

  let blocks = storedBlocks
    ? storedBlocks.map((block, index) => normalizeBlock(block, cards, bento, index, profile)).filter(Boolean)
    : synthesizeLegacyLayout(cards, bento, meta, synthesizeProfile);

  const seen = new Set(blocks.map((block) => block.type));
  DEFAULT_BLOCK_ORDER.forEach((type, index) => {
    if (!seen.has(type)) {
      blocks.push(createSeedBlock(type, blocks.length + index, cards, bento, storedBlocks ? profile : synthesizeProfile));
    }
  });

  return {
    version: storedBlocks ? Math.max(2, storedVersion) : 3,
    columns: { ...DEFAULT_LAYOUT_COLUMNS },
    breakpoints: [...LAYOUT_BREAKPOINTS],
    blocks,
    cards,
  };
}

export function buildBentoPayload(bento = {}, options = {}) {
  const layout = normalizeBentoLayout(bento, options);
  const nextBento = {
    ...cloneValue(bento),
    layout: {
      version: 3,
      columns: { ...layout.columns },
      blocks: layout.blocks,
    },
    cards: { ...layout.cards },
  };

  return nextBento;
}

export function normalizeProjectForBuilder(project) {
  if (!project || !isObject(project)) return project;

  const data = isObject(project.data) ? { ...project.data } : {};
  const bento = buildBentoPayload(data.bento || {}, {
    profile: 'studio',
    synthesizeProfile: 'studio',
    meta: { tech: Array.isArray(data.tech) ? data.tech : [] },
  });

  return {
    ...project,
    data: {
      ...data,
      bento,
    },
  };
}

export function getEnabledBlocks(projectData = {}) {
  const bento = projectData.bento || {};
  return normalizeBentoLayout(bento, {
    profile: DEFAULT_PROFILE,
    synthesizeProfile: 'studio',
    meta: { tech: Array.isArray(projectData.tech) ? projectData.tech : [] },
  }).blocks.filter((block) => block.enabled);
}

export function getPlacementStyles(block, breakpoint = 'desktop', options = {}) {
  const profile = normalizeProfile(options.profile);
  const placement = normalizeBlockPlacement(block?.type || 'hero', block?.placement, { profile })[breakpoint] || { x: 0, y: 0, w: 1, h: 1 };

  return {
    '--grid-column-start': String(placement.x + 1),
    '--grid-column-end': String(placement.x + placement.w + 1),
    '--grid-row-start': String(placement.y + 1),
    '--grid-row-end': String(placement.y + placement.h + 1),
  };
}

export function getResponsivePlacementVariables(block, options = {}) {
  const profile = normalizeProfile(options.profile);
  const placement = normalizeBlockPlacement(block?.type || 'hero', block?.placement, { profile });
  const variables = {};

  Object.entries(placement).forEach(([breakpoint, value]) => {
    variables[`--${breakpoint}-grid-column-start`] = String(value.x + 1);
    variables[`--${breakpoint}-grid-column-end`] = String(value.x + value.w + 1);
    variables[`--${breakpoint}-grid-row-start`] = String(value.y + 1);
    variables[`--${breakpoint}-grid-row-end`] = String(value.y + value.h + 1);
  });

  return variables;
}

export function summarizePlacement(block, breakpoint = 'desktop', options = {}) {
  const profile = normalizeProfile(options.profile);
  const placement = normalizeBlockPlacement(block?.type || 'hero', block?.placement, { profile })[breakpoint];
  return `${breakpoint}: x${placement.x} y${placement.y} w${placement.w} h${placement.h}`;
}
