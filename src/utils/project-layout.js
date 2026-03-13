import {
  BLOCK_TYPES,
  DEFAULT_BLOCK_ORDER,
  DEFAULT_CARD_VISIBILITY,
  DEFAULT_LAYOUT_COLUMNS,
  LAYOUT_BREAKPOINTS,
} from '../content/project-schema.js';
import { getBlockConstraints, getBlockPlacementDefaults } from './block-registry.js';

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneValue(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
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

function normalizePlacementValue(rawPlacement, breakpoint, type) {
  const columns = DEFAULT_LAYOUT_COLUMNS[breakpoint];
  const defaults = getBlockPlacementDefaults(type)[breakpoint];
  const constraints = getBlockConstraints(type);
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

function normalizePlacement(placement, type) {
  const defaults = getBlockPlacementDefaults(type);
  const source = isObject(placement) ? placement : defaults;

  return {
    desktop: normalizePlacementValue(source.desktop, 'desktop', type),
    tablet: normalizePlacementValue(source.tablet, 'tablet', type),
    mobile: normalizePlacementValue(source.mobile, 'mobile', type),
  };
}

function normalizeBlock(block, cards, bento, index) {
  if (!block || typeof block !== 'object') return null;
  const type = BLOCK_TYPES.includes(block.type) ? block.type : null;
  if (!type) return null;

  return {
    id: typeof block.id === 'string' && block.id.trim() ? block.id.trim() : `${type}-${index + 1}`,
    type,
    enabled: block.enabled !== false,
    variant: block.variant || deriveVariant(type, cards, bento),
    placement: normalizePlacement(block.placement, type),
  };
}

function createSeedBlock(type, index, cards, bento) {
  return {
    id: `${type}-${index + 1}`,
    type,
    enabled: cards[type] !== false,
    variant: deriveVariant(type, cards, bento),
    placement: normalizePlacement(null, type),
  };
}

export function createDefaultLayoutBlocks() {
  return DEFAULT_BLOCK_ORDER.map((type, index) => ({
    id: `${type}-${index + 1}`,
    type,
    enabled: DEFAULT_CARD_VISIBILITY[type] !== false,
    variant: 'default',
    placement: normalizePlacement(null, type),
  }));
}

export function normalizeBentoLayout(bento = {}) {
  const cards = buildLegacyCardMap(bento);
  const storedBlocks = Array.isArray(bento?.layout?.blocks) ? bento.layout.blocks : null;
  const storedVersion = Number.isFinite(bento?.layout?.version) ? bento.layout.version : 1;

  let blocks = storedBlocks
    ? storedBlocks.map((block, index) => normalizeBlock(block, cards, bento, index)).filter(Boolean)
    : [];

  if (!storedBlocks || blocks.length === 0) {
    blocks = DEFAULT_BLOCK_ORDER.map((type, index) => createSeedBlock(type, index, cards, bento));
  }

  const seen = new Set(blocks.map((block) => block.type));
  DEFAULT_BLOCK_ORDER.forEach((type, index) => {
    if (!seen.has(type)) {
      blocks.push(createSeedBlock(type, blocks.length + index, cards, bento));
    }
  });

  return {
    version: Math.max(2, storedVersion),
    columns: { ...DEFAULT_LAYOUT_COLUMNS },
    breakpoints: [...LAYOUT_BREAKPOINTS],
    blocks,
    cards,
  };
}

export function buildBentoPayload(bento = {}) {
  const layout = normalizeBentoLayout(bento);
  const nextBento = {
    ...cloneValue(bento),
    layout: {
      version: 2,
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
  const bento = buildBentoPayload(data.bento || {});

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
  return normalizeBentoLayout(bento).blocks.filter((block) => block.enabled);
}

export function getPlacementStyles(block, breakpoint = 'desktop') {
  const placement = normalizePlacement(block?.placement, block?.type || 'hero')[breakpoint] || { x: 0, y: 0, w: 1, h: 1 };

  return {
    '--grid-column-start': String(placement.x + 1),
    '--grid-column-end': String(placement.x + placement.w + 1),
    '--grid-row-start': String(placement.y + 1),
    '--grid-row-end': String(placement.y + placement.h + 1),
  };
}

export function getResponsivePlacementVariables(block) {
  const placement = normalizePlacement(block?.placement, block?.type || 'hero');
  const variables = {};

  Object.entries(placement).forEach(([breakpoint, value]) => {
    variables[`--${breakpoint}-grid-column-start`] = String(value.x + 1);
    variables[`--${breakpoint}-grid-column-end`] = String(value.x + value.w + 1);
    variables[`--${breakpoint}-grid-row-start`] = String(value.y + 1);
    variables[`--${breakpoint}-grid-row-end`] = String(value.y + value.h + 1);
  });

  return variables;
}

export function summarizePlacement(block, breakpoint = 'desktop') {
  const placement = normalizePlacement(block?.placement, block?.type || 'hero')[breakpoint];
  return `${breakpoint}: x${placement.x} y${placement.y} w${placement.w} h${placement.h}`;
}
