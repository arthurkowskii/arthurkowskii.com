import { buildBentoPayload } from '../../utils/project-layout.js';
import { createDefaultBlock, createDefaultPayloadForBlock } from '../../utils/block-registry.js';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function localized(fr = '', en = '') {
  return { fr, en };
}

function buildBlocks(types) {
  return types.map((type, index) => createDefaultBlock(type, index)).filter(Boolean);
}

function buildBentoFromTypes(types) {
  const bento = {
    accentColor: '#ff6b00',
  };

  types.forEach((type) => {
    const payload = createDefaultPayloadForBlock(type);
    if (payload !== null) {
      const key = type;
      bento[key] = payload;
    }
  });

  bento.layout = {
    version: 1,
    blocks: buildBlocks(types),
  };

  return buildBentoPayload(bento);
}

export const PROJECT_PRESET_DEFINITIONS = [
  {
    key: 'blank',
    label: 'Blank',
    description: 'Empty project canvas with no cards',
    domainFolder: '3_tech',
    blockTypes: [],
  },
  {
    key: 'music',
    label: 'Music',
    description: 'Release-oriented page with links and audio',
    domainFolder: '1_Music',
    blockTypes: ['hero', 'musicLinks', 'actions', 'tech', 'gallery', 'audio', 'results'],
  },
  {
    key: 'game-audio',
    label: 'Game Audio',
    description: 'Production page with process, audio, and sampler',
    domainFolder: '2_Game Audio',
    blockTypes: ['hero', 'stats', 'actions', 'tech', 'process', 'gallery', 'challenges', 'results', 'audio', 'sampler'],
  },
  {
    key: 'tech',
    label: 'Tech',
    description: 'Technical case study with process and results',
    domainFolder: '3_tech',
    blockTypes: ['hero', 'stats', 'actions', 'tech', 'process', 'gallery', 'challenges', 'results'],
  },
];

export function listPresetSummaries() {
  return PROJECT_PRESET_DEFINITIONS.map(({ key, label, description, domainFolder }) => ({
    key,
    label,
    description,
    domainFolder,
  }));
}

export function createProjectFromPreset(presetKey = 'blank') {
  const preset = PROJECT_PRESET_DEFINITIONS.find((item) => item.key === presetKey) || PROJECT_PRESET_DEFINITIONS[0];
  const bento = buildBentoFromTypes(preset.blockTypes);

  return {
    title: localized('Nouveau projet', 'New project'),
    altTitle: localized('Projet', 'Project'),
    description: localized('Description a definir', 'Description to define'),
    tech: ['Astro'],
    status: 'planned',
    date: today(),
    useBentoLayout: true,
    orbit: {
      shellMode: 'auto',
      angleMode: 'auto',
    },
    bento,
    __presetDomainFolder: preset.domainFolder,
  };
}
