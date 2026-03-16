import {
  createDefaultPayloadForBlock,
  getBlockConstraints,
} from '../utils/block-registry.js';
import {
  normalizeBentoLayout,
  normalizeBlockPlacement,
} from '../utils/project-layout.js';

export const STUDIO_COLUMNS = {
  desktop: 12,
  tablet: 8,
  mobile: 4,
};

export const STUDIO_LOCALES = ['fr', 'en'];

export const CORE_BLOCK_TYPES = [
  'hero',
  'stats',
  'actions',
  'tech',
  'process',
  'gallery',
  'challenges',
  'results',
];

export const LEGACY_BLOCK_TYPES = [
  'musicLinks',
  'video',
  'spotify',
  'soundcloud',
  'audio',
  'sampler',
  'fmod',
];

export const ALL_STUDIO_BLOCK_TYPES = [...CORE_BLOCK_TYPES, ...LEGACY_BLOCK_TYPES];

const BLOCK_LABELS = {
  hero: 'Hero',
  stats: 'Stats',
  actions: 'Actions',
  tech: 'Technology',
  process: 'Process',
  gallery: 'Gallery',
  challenges: 'Challenges',
  results: 'Results',
  musicLinks: 'Music Links',
  video: 'Video',
  spotify: 'Spotify',
  soundcloud: 'SoundCloud',
  audio: 'Audio',
  sampler: 'Sampler',
  fmod: 'FMOD',
};

const DEFAULT_THEME = {
  accentColor: '#ff6b00',
  accentColorDark: '',
  assetsFolder: '',
};

const DEFAULT_ORBIT = {
  shellMode: 'auto',
  shell: undefined,
  order: undefined,
  angleMode: 'auto',
  angle: undefined,
};

const DEFAULT_META = {
  title: { fr: 'New project', en: 'New project' },
  altTitle: { fr: 'Project', en: 'Project' },
  description: { fr: 'Describe this project.', en: 'Describe this project.' },
  tech: ['Astro'],
  status: 'planned',
  date: new Date().toISOString().slice(0, 10),
  link: '',
  github: '',
  orbit: { ...DEFAULT_ORBIT },
  theme: { ...DEFAULT_THEME },
};

const DEFAULT_CORE_CONTENT = {
  hero: {
    subtitle: { fr: '', en: '' },
    subtitleColor: '#ff6b00',
    backgroundImage: '',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundScale: 1,
    overlayTopOpacity: 0.2,
    overlayBottomOpacity: 0.6,
    logo: '',
    showLogo: false,
  },
  stats: {
    items: [{ value: '1', label: { fr: 'STAT', en: 'STAT' } }],
  },
  actions: {
    title: { fr: 'Links', en: 'Links' },
    primary: { text: { fr: 'Primary action', en: 'Primary action' }, url: '' },
    secondary: { text: { fr: 'Secondary action', en: 'Secondary action' }, url: '' },
  },
  tech: {
    title: { fr: 'Technology', en: 'Technology' },
  },
  process: {
    title: { fr: 'Process', en: 'Process' },
    subtitle: { fr: '', en: '' },
    steps: [{ fr: 'Step 1', en: 'Step 1' }],
  },
  gallery: {
    title: { fr: 'Gallery', en: 'Gallery' },
    source: 'assetsFolder',
    images: [],
  },
  challenges: {
    title: { fr: 'Challenges', en: 'Challenges' },
    subtitle: { fr: '', en: '' },
    items: [
      {
        title: { fr: 'Challenge', en: 'Challenge' },
        description: { fr: 'Describe the challenge.', en: 'Describe the challenge.' },
      },
    ],
  },
  results: {
    title: { fr: 'Results', en: 'Results' },
    subtitle: { fr: '', en: '' },
    items: [{ icon: '*', text: { fr: 'Result', en: 'Result' } }],
  },
};

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanUrl(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function ensureLocalized(value, fallbackFr = '', fallbackEn = '') {
  if (typeof value === 'string') {
    return {
      fr: value,
      en: value || fallbackEn || fallbackFr,
    };
  }

  return {
    fr: cleanText(value?.fr) || fallbackFr,
    en: cleanText(value?.en) || cleanText(value?.fr) || fallbackEn || fallbackFr,
  };
}

function ensureStringArray(value, fallback = []) {
  if (!Array.isArray(value)) return [...fallback];
  return value.map((entry) => cleanText(String(entry))).filter(Boolean);
}

function ensureDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (trimmed) {
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
      }
    }
  }

  return new Date().toISOString().slice(0, 10);
}

function defaultContentForType(type) {
  if (DEFAULT_CORE_CONTENT[type]) return clone(DEFAULT_CORE_CONTENT[type]);
  return clone(createDefaultPayloadForBlock(type) || {});
}

function getBlockKind(type) {
  return CORE_BLOCK_TYPES.includes(type) ? 'core' : 'legacy';
}

export function normalizePlacementSet(type, placement) {
  return normalizeBlockPlacement(type, placement, { profile: 'studio' });
}

function normalizeTheme(metaTheme = {}, bento = {}) {
  return {
    accentColor: cleanText(metaTheme.accentColor || bento?.accentColor) || DEFAULT_THEME.accentColor,
    accentColorDark: cleanText(metaTheme.accentColorDark || bento?.accentColorDark),
    assetsFolder: cleanText(metaTheme.assetsFolder || bento?.assetsFolder),
  };
}

function normalizeOrbit(orbit = {}) {
  return {
    shellMode: orbit?.shellMode === 'manual' ? 'manual' : 'auto',
    shell: Number.isFinite(orbit?.shell) ? orbit.shell : undefined,
    order: Number.isFinite(orbit?.order) ? orbit.order : undefined,
    angleMode: orbit?.angleMode === 'fixed' ? 'fixed' : 'auto',
    angle: Number.isFinite(orbit?.angle) ? orbit.angle : undefined,
  };
}

export function normalizeStudioMeta(frontmatter = {}) {
  const bento = frontmatter?.bento || {};
  return {
    title: ensureLocalized(frontmatter?.title, DEFAULT_META.title.fr, DEFAULT_META.title.en),
    altTitle: ensureLocalized(frontmatter?.altTitle, DEFAULT_META.altTitle.fr, DEFAULT_META.altTitle.en),
    description: ensureLocalized(frontmatter?.description, DEFAULT_META.description.fr, DEFAULT_META.description.en),
    tech: ensureStringArray(frontmatter?.tech, DEFAULT_META.tech),
    status: ['planned', 'in-progress', 'completed'].includes(frontmatter?.status)
      ? frontmatter.status
      : DEFAULT_META.status,
    date: ensureDate(frontmatter?.date),
    link: cleanUrl(frontmatter?.link),
    github: cleanUrl(frontmatter?.github),
    orbit: normalizeOrbit(frontmatter?.orbit),
    theme: normalizeTheme(frontmatter?.theme, bento),
  };
}

function createEmptyBlock(type, overrides = {}) {
  return {
    id: overrides.id || `${type}-1`,
    type,
    kind: getBlockKind(type),
    label: BLOCK_LABELS[type] || type,
    enabled: overrides.enabled !== false,
    variant: overrides.variant || 'default',
    placement: normalizePlacementSet(type, overrides.placement),
    content: clone(overrides.content ?? defaultContentForType(type)),
  };
}

export function createStudioBlockInstance(type, overrides = {}) {
  return createEmptyBlock(type, overrides);
}

function inferCoreContent(type, frontmatter, bento, meta) {
  switch (type) {
    case 'hero':
      return {
        subtitle: ensureLocalized(bento?.hero?.subtitle),
        subtitleColor: cleanText(bento?.hero?.subtitleColor) || DEFAULT_CORE_CONTENT.hero.subtitleColor,
        backgroundImage: cleanText(bento?.hero?.backgroundImage),
        backgroundPosition: cleanText(bento?.hero?.backgroundPosition) || DEFAULT_CORE_CONTENT.hero.backgroundPosition,
        backgroundSize: cleanText(bento?.hero?.backgroundSize) || DEFAULT_CORE_CONTENT.hero.backgroundSize,
        backgroundScale: Number.isFinite(bento?.hero?.backgroundScale) ? bento.hero.backgroundScale : 1,
        overlayTopOpacity: Number.isFinite(bento?.hero?.overlayTopOpacity)
          ? bento.hero.overlayTopOpacity
          : Number.isFinite(bento?.hero?.overlayOpacity)
            ? bento.hero.overlayOpacity
            : DEFAULT_CORE_CONTENT.hero.overlayTopOpacity,
        overlayBottomOpacity: Number.isFinite(bento?.hero?.overlayBottomOpacity)
          ? bento.hero.overlayBottomOpacity
          : Number.isFinite(bento?.hero?.overlayOpacity)
            ? bento.hero.overlayOpacity
            : DEFAULT_CORE_CONTENT.hero.overlayBottomOpacity,
        logo: cleanText(bento?.hero?.logo),
        showLogo: Boolean(bento?.hero?.showLogo),
      };
    case 'stats':
      return {
        items: Array.isArray(bento?.stats)
          ? bento.stats.map((item) => ({
              value: cleanText(item?.value ?? ''),
              label: ensureLocalized(item?.label, 'STAT', 'STAT'),
            }))
          : clone(DEFAULT_CORE_CONTENT.stats.items),
      };
    case 'actions':
      return {
        title: ensureLocalized(bento?.actions?.title, 'Links', 'Links'),
        primary: bento?.actions?.primary
          ? {
              text: ensureLocalized(bento.actions.primary.text, 'Primary action', 'Primary action'),
              url: cleanUrl(bento.actions.primary.url),
            }
          : { text: ensureLocalized('', 'Primary action', 'Primary action'), url: meta.link || '' },
        secondary: bento?.actions?.secondary
          ? {
              text: ensureLocalized(bento.actions.secondary.text, 'Secondary action', 'Secondary action'),
              url: cleanUrl(bento.actions.secondary.url),
            }
          : { text: ensureLocalized('', 'Secondary action', 'Secondary action'), url: meta.github || '' },
      };
    case 'tech':
      return {
        title: ensureLocalized(bento?.tech?.title, 'Technology', 'Technology'),
      };
    case 'process':
      return {
        title: ensureLocalized(bento?.process?.title, 'Process', 'Process'),
        subtitle: ensureLocalized(bento?.process?.subtitle),
        steps: Array.isArray(bento?.process?.steps)
          ? bento.process.steps.map((step, index) => ensureLocalized(step, `Step ${index + 1}`, `Step ${index + 1}`))
          : clone(DEFAULT_CORE_CONTENT.process.steps),
      };
    case 'gallery':
      return {
        title: ensureLocalized(bento?.gallery?.title, 'Gallery', 'Gallery'),
        source: cleanText(meta?.theme?.assetsFolder) ? 'assetsFolder' : 'manual',
        images: Array.isArray(bento?.gallery?.images)
          ? bento.gallery.images
              .map((image) => ({ src: cleanText(image?.src), alt: cleanText(image?.alt) }))
              .filter((image) => image.src)
          : [],
      };
    case 'challenges':
      return {
        title: ensureLocalized(bento?.challenges?.title, 'Challenges', 'Challenges'),
        subtitle: ensureLocalized(bento?.challenges?.subtitle),
        items: Array.isArray(bento?.challenges?.items)
          ? bento.challenges.items.map((item) => ({
              title: ensureLocalized(item?.title, 'Challenge', 'Challenge'),
              description: ensureLocalized(item?.description, 'Describe the challenge.', 'Describe the challenge.'),
            }))
          : clone(DEFAULT_CORE_CONTENT.challenges.items),
      };
    case 'results':
      return {
        title: ensureLocalized(bento?.results?.title, 'Results', 'Results'),
        subtitle: ensureLocalized(bento?.results?.subtitle),
        items: Array.isArray(bento?.results?.items)
          ? bento.results.items.map((item) => ({
              icon: cleanText(item?.icon || '*') || '*',
              text: ensureLocalized(item?.text, 'Result', 'Result'),
            }))
          : clone(DEFAULT_CORE_CONTENT.results.items),
      };
    default:
      return clone(defaultContentForType(type));
  }
}

function inferLegacyContent(type, frontmatter) {
  return clone(frontmatter?.bento?.[type] || defaultContentForType(type));
}

function hasPayload(type, frontmatter, meta, normalizedLayout = null) {
  const bento = frontmatter?.bento || {};

  switch (type) {
    case 'hero':
      return Boolean(normalizedLayout?.blocks?.find((block) => block.type === 'hero' && block.enabled !== false));
    case 'stats':
      return Array.isArray(bento?.stats) && bento.stats.length > 0;
    case 'actions':
      return Boolean(bento?.actions?.primary || bento?.actions?.secondary);
    case 'tech':
      return Array.isArray(meta?.tech) && meta.tech.length > 0;
    case 'process':
      return Array.isArray(bento?.process?.steps) && bento.process.steps.length > 0;
    case 'gallery':
      return Boolean(meta?.theme?.assetsFolder) || (Array.isArray(bento?.gallery?.images) && bento.gallery.images.length > 0);
    case 'challenges':
      return Array.isArray(bento?.challenges?.items) && bento.challenges.items.length > 0;
    case 'results':
      return Array.isArray(bento?.results?.items) && bento.results.items.length > 0;
    case 'musicLinks':
      return Array.isArray(bento?.musicLinks?.items) && bento.musicLinks.items.length > 0;
    case 'video':
    case 'spotify':
    case 'soundcloud':
      return Boolean(cleanText(bento?.[type]?.url));
    case 'audio':
      return Array.isArray(bento?.audio?.tracks) && bento.audio.tracks.length > 0;
    case 'sampler':
      return Array.isArray(bento?.sampler?.samplePool) && bento.sampler.samplePool.length > 0;
    case 'fmod':
      return Boolean(cleanText(bento?.fmod?.folder)) || (Array.isArray(bento?.fmod?.events) && bento.fmod.events.length > 0);
    default:
      return false;
  }
}

function blockEnabled(type, explicitBlock, frontmatter) {
  if (explicitBlock) return explicitBlock.enabled !== false;
  const value = frontmatter?.bento?.cards?.[type];
  if (typeof value === 'boolean') return value;
  return true;
}

function inferBlockVariant(type, explicitBlock, normalizedLayout) {
  if (explicitBlock?.variant) return explicitBlock.variant;
  const layoutBlock = normalizedLayout?.blocks?.find((block) => block.type === type);
  return layoutBlock?.variant || 'default';
}

function inferBlockPlacement(type, explicitBlock, normalizedLayout) {
  const layoutBlock = explicitBlock || normalizedLayout?.blocks?.find((block) => block.type === type);
  return normalizeBlockPlacement(type, layoutBlock?.placement, { profile: 'studio' });
}

function normalizeStoredBlocks(rawBlocks = [], normalizedLayout) {
  const byType = new Map();

  rawBlocks.forEach((rawBlock, index) => {
    if (!rawBlock || !ALL_STUDIO_BLOCK_TYPES.includes(rawBlock.type)) return;
    const normalized = createEmptyBlock(rawBlock.type, {
      id: cleanText(rawBlock.id) || `${rawBlock.type}-${index + 1}`,
      enabled: rawBlock.enabled !== false,
      variant: rawBlock.variant || inferBlockVariant(rawBlock.type, rawBlock, normalizedLayout),
      placement: inferBlockPlacement(rawBlock.type, rawBlock, normalizedLayout),
      content: rawBlock.content,
    });
    byType.set(normalized.type, normalized);
  });

  return byType;
}

function buildCoreBlock(type, explicitBlock, frontmatter, meta, normalizedLayout) {
  return createEmptyBlock(type, {
    id: explicitBlock?.id,
    enabled: blockEnabled(type, explicitBlock, frontmatter),
    variant: inferBlockVariant(type, explicitBlock, normalizedLayout),
    placement: inferBlockPlacement(type, explicitBlock, normalizedLayout),
    content: explicitBlock?.content || inferCoreContent(type, frontmatter, frontmatter?.bento || {}, meta),
  });
}

function buildLegacyBlock(type, explicitBlock, frontmatter, normalizedLayout) {
  return createEmptyBlock(type, {
    id: explicitBlock?.id,
    enabled: blockEnabled(type, explicitBlock, frontmatter),
    variant: inferBlockVariant(type, explicitBlock, normalizedLayout),
    placement: inferBlockPlacement(type, explicitBlock, normalizedLayout),
    content: explicitBlock?.content || inferLegacyContent(type, frontmatter),
  });
}

export function sortStudioBlocks(blocks = []) {
  return [...blocks]
    .map((block, index) => ({ block, index }))
    .sort((left, right) => {
      const a = left.block.placement?.desktop || { y: 0, x: 0 };
      const b = right.block.placement?.desktop || { y: 0, x: 0 };
      if (a.y !== b.y) return a.y - b.y;
      if (a.x !== b.x) return a.x - b.x;
      return left.index - right.index;
    })
    .map(({ block }) => block);
}

function hasRenderableMusicLinks(block) {
  return Array.isArray(block?.content?.items) && block.content.items.length === 4;
}

function hasRenderableGallery(block, document) {
  if (!block) return false;
  if (block.content?.source === 'manual') {
    return Array.isArray(block.content?.images) && block.content.images.length > 0;
  }

  return cleanText(document?.meta?.theme?.assetsFolder).length > 0;
}

function visibilityForBlock(block, document) {
  if (!block) {
    return { visible: false, reason: 'Unknown block.' };
  }

  if (block.enabled === false) {
    return { visible: false, reason: 'Disabled in Studio.' };
  }

  if (block.type === 'musicLinks') {
    return hasRenderableMusicLinks(block)
      ? { visible: true, reason: '' }
      : { visible: false, reason: 'Needs exactly 4 links to match the published card.' };
  }

  if (block.type === 'stats') {
    const musicLinks = document?.blocks?.find((entry) => entry.type === 'musicLinks');
    if (musicLinks?.enabled !== false && hasRenderableMusicLinks(musicLinks)) {
      return { visible: false, reason: 'Hidden because Music Links replaces Stats when 4 links are present.' };
    }
    return { visible: true, reason: '' };
  }

  if (block.type === 'gallery') {
    return hasRenderableGallery(block, document)
      ? { visible: true, reason: '' }
      : { visible: false, reason: 'Needs manual images or an assets folder to render.' };
  }

  return { visible: true, reason: '' };
}

export function getStudioPresentation(document) {
  const blocks = sortStudioBlocks(Array.isArray(document?.blocks) ? document.blocks : []);
  const visibleBlocks = [];
  const inactiveBlocks = [];

  blocks.forEach((block) => {
    const entry = visibilityForBlock(block, document);
    if (entry.visible) {
      visibleBlocks.push(block);
      return;
    }

    inactiveBlocks.push({
      block,
      reason: entry.reason,
    });
  });

  return {
    visibleBlocks,
    inactiveBlocks,
  };
}

export function getStudioPalette() {
  return CORE_BLOCK_TYPES.map((type) => ({
    type,
    label: BLOCK_LABELS[type] || type,
    kind: 'core',
    constraints: getBlockConstraints(type, 'studio'),
  }));
}

export function createStudioDocument({
  id = null,
  folder = '3_tech',
  slug = 'new_project',
  frontmatter = {},
  body = '# New project\n',
  presetKey = 'blank',
} = {}) {
  const meta = normalizeStudioMeta(frontmatter);
  const normalizedLayout = normalizeBentoLayout(frontmatter?.bento || {}, {
    profile: 'studio',
    synthesizeProfile: 'studio',
    meta: {
      tech: Array.isArray(frontmatter?.tech) ? frontmatter.tech : [],
    },
  });
  const storedBlocks = normalizeStoredBlocks(frontmatter?.bento?.layout?.blocks || [], normalizedLayout);
  const blocks = [];

  CORE_BLOCK_TYPES.forEach((type) => {
    const explicit = storedBlocks.get(type);
    if (!explicit && !hasPayload(type, frontmatter, meta, normalizedLayout)) return;
    blocks.push(buildCoreBlock(type, explicit, frontmatter, meta, normalizedLayout));
  });

  LEGACY_BLOCK_TYPES.forEach((type) => {
    const explicit = storedBlocks.get(type);
    if (!explicit && !hasPayload(type, frontmatter, meta, normalizedLayout)) return;
    blocks.push(buildLegacyBlock(type, explicit, frontmatter, normalizedLayout));
  });

  return {
    id,
    folder,
    slug,
    meta,
    blocks: sortStudioBlocks(blocks),
    legacyBlocks: Object.fromEntries(
      blocks
        .filter((block) => block.kind === 'legacy')
        .map((block) => [block.type, clone(block.content)])
    ),
    body: typeof body === 'string' ? body : '',
    ui: {
      locale: 'fr',
      selectedBlockId: blocks[0]?.id || null,
      previewMode: 'canvas',
      presetKey,
    },
  };
}

export function createBlankStudioDocument({
  folder = '3_tech',
  slug = 'new_project',
  body = '# New project\n',
  coreBlocks = [],
  presetKey = 'blank',
} = {}) {
  const meta = clone(DEFAULT_META);
  const blocks = coreBlocks.map((type, index) =>
    createEmptyBlock(type, {
      id: `${type}-${index + 1}`,
      enabled: true,
    }),
  );

  return {
    id: null,
    folder,
    slug,
    meta,
    blocks: sortStudioBlocks(blocks),
    legacyBlocks: {},
    body,
    ui: {
      locale: 'fr',
      selectedBlockId: blocks[0]?.id || null,
      previewMode: 'canvas',
      presetKey,
    },
  };
}

function exportCoreBlock(type, content) {
  switch (type) {
    case 'hero':
      return {
        subtitle: ensureLocalized(content?.subtitle),
        subtitleColor: cleanText(content?.subtitleColor) || '#ff6b00',
        backgroundImage: cleanText(content?.backgroundImage) || undefined,
        backgroundPosition: cleanText(content?.backgroundPosition) || 'center',
        backgroundSize: cleanText(content?.backgroundSize) || 'cover',
        backgroundScale: Number.isFinite(content?.backgroundScale) ? content.backgroundScale : undefined,
        overlayTopOpacity: Number.isFinite(content?.overlayTopOpacity) ? content.overlayTopOpacity : 0.2,
        overlayBottomOpacity: Number.isFinite(content?.overlayBottomOpacity) ? content.overlayBottomOpacity : 0.6,
        logo: cleanText(content?.logo) || undefined,
        showLogo: Boolean(content?.showLogo),
      };
    case 'stats':
      return Array.isArray(content?.items)
        ? content.items
            .map((item) => ({
              value: cleanText(item?.value),
              label: ensureLocalized(item?.label, 'STAT', 'STAT'),
            }))
            .filter((item) => item.value || item.label.fr || item.label.en)
        : [];
    case 'actions':
      return {
        title: ensureLocalized(content?.title, 'Links', 'Links'),
        primary: content?.primary?.url || content?.primary?.text
          ? {
              text: ensureLocalized(content?.primary?.text, 'Primary action', 'Primary action'),
              url: cleanUrl(content?.primary?.url),
            }
          : undefined,
        secondary: content?.secondary?.url || content?.secondary?.text
          ? {
              text: ensureLocalized(content?.secondary?.text, 'Secondary action', 'Secondary action'),
              url: cleanUrl(content?.secondary?.url),
            }
          : undefined,
      };
    case 'tech':
      return {
        title: ensureLocalized(content?.title, 'Technology', 'Technology'),
      };
    case 'process':
      return {
        title: ensureLocalized(content?.title, 'Process', 'Process'),
        subtitle: ensureLocalized(content?.subtitle),
        steps: Array.isArray(content?.steps)
          ? content.steps.map((step, index) => ensureLocalized(step, `Step ${index + 1}`, `Step ${index + 1}`))
          : [],
      };
    case 'gallery':
      return {
        title: ensureLocalized(content?.title, 'Gallery', 'Gallery'),
        images: Array.isArray(content?.images)
          ? content.images
              .map((image) => ({ src: cleanText(image?.src), alt: cleanText(image?.alt) }))
              .filter((image) => image.src)
          : [],
      };
    case 'challenges':
      return {
        title: ensureLocalized(content?.title, 'Challenges', 'Challenges'),
        subtitle: ensureLocalized(content?.subtitle),
        items: Array.isArray(content?.items)
          ? content.items.map((item) => ({
              title: ensureLocalized(item?.title, 'Challenge', 'Challenge'),
              description: ensureLocalized(item?.description, 'Describe the challenge.', 'Describe the challenge.'),
            }))
          : [],
      };
    case 'results':
      return {
        title: ensureLocalized(content?.title, 'Results', 'Results'),
        subtitle: ensureLocalized(content?.subtitle),
        items: Array.isArray(content?.items)
          ? content.items.map((item) => ({
              icon: cleanText(item?.icon || '*') || '*',
              text: ensureLocalized(item?.text, 'Result', 'Result'),
            }))
          : [],
      };
    default:
      return clone(content);
  }
}

function cleanBlockForStorage(block) {
  return {
    id: cleanText(block?.id) || `${block?.type || 'block'}-1`,
    type: block?.type,
    enabled: block?.enabled !== false,
    variant: cleanText(block?.variant) || 'default',
    placement: normalizePlacementSet(block?.type, block?.placement),
    content: clone(block?.content || {}),
  };
}

export function buildProjectDraftFromStudioDocument(document) {
  const meta = normalizeStudioMeta(document?.meta || {});
  const blocks = sortStudioBlocks(
    Array.isArray(document?.blocks)
      ? document.blocks
          .filter((block) => block && ALL_STUDIO_BLOCK_TYPES.includes(block.type))
          .map(cleanBlockForStorage)
      : [],
  );

  const bento = {
    accentColor: meta.theme.accentColor,
    cards: Object.fromEntries(ALL_STUDIO_BLOCK_TYPES.map((type) => [type, false])),
    layout: {
      version: 3,
      columns: { ...STUDIO_COLUMNS },
      blocks,
    },
  };

  if (meta.theme.accentColorDark) bento.accentColorDark = meta.theme.accentColorDark;

  blocks.forEach((block) => {
    bento.cards[block.type] = block.enabled !== false;
  });

  blocks.forEach((block) => {
    if (CORE_BLOCK_TYPES.includes(block.type)) {
      const payload = exportCoreBlock(block.type, block.content);
      if (block.type === 'gallery') {
        const useAssetsFolder = cleanText(block.content?.source) !== 'manual' && cleanText(meta.theme.assetsFolder);
        bento.gallery = payload;
        bento.assetsFolder = useAssetsFolder ? meta.theme.assetsFolder : undefined;
      } else {
        bento[block.type] = payload;
      }
      return;
    }

    bento[block.type] = clone(block.content);
  });

  if (!blocks.some((block) => block.type === 'gallery')) {
    bento.assetsFolder = cleanText(meta.theme.assetsFolder) || undefined;
  }

  return {
    id: document?.id || null,
    folder: cleanText(document?.folder) || '3_tech',
    slug: cleanText(document?.slug) || 'new_project',
    frontmatter: {
      title: meta.title,
      altTitle: meta.altTitle,
      description: meta.description,
      tech: meta.tech,
      status: meta.status,
      date: meta.date,
      useBentoLayout: true,
      orbit: meta.orbit,
      link: meta.link || undefined,
      github: meta.github || undefined,
      bento,
    },
    body: typeof document?.body === 'string' ? document.body : '',
  };
}
