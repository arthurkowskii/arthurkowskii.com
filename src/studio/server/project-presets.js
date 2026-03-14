export const PROJECT_PRESET_DEFINITIONS = [
  {
    key: 'blank',
    label: 'Blank',
    description: 'Empty project canvas with no cards',
    domainFolder: '3_tech',
    coreBlocks: [],
  },
  {
    key: 'music',
    label: 'Music',
    description: 'Release-oriented page with structured content blocks',
    domainFolder: '1_Music',
    coreBlocks: ['hero', 'actions', 'tech', 'gallery', 'results'],
  },
  {
    key: 'game-audio',
    label: 'Game Audio',
    description: 'Production page with case study cards',
    domainFolder: '2_Game Audio',
    coreBlocks: ['hero', 'stats', 'actions', 'tech', 'process', 'gallery', 'challenges', 'results'],
  },
  {
    key: 'tech',
    label: 'Tech',
    description: 'Technical case study with process and results',
    domainFolder: '3_tech',
    coreBlocks: ['hero', 'stats', 'actions', 'tech', 'process', 'gallery', 'challenges', 'results'],
  },
];

export function listPresetSummaries() {
  return PROJECT_PRESET_DEFINITIONS.map(({ key, label, description, domainFolder, coreBlocks }) => ({
    key,
    label,
    description,
    domainFolder,
    coreBlocks,
  }));
}
