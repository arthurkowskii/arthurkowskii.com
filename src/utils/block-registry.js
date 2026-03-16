import {
  BLOCK_LABELS,
  BLOCK_TYPES,
  DEFAULT_LAYOUT_COLUMNS,
} from '../content/project-schema.js';

const DEFAULT_PROFILE = 'published';

function bilingualValue(fr, en = '') {
  return { fr, en };
}

function placement(desktop, tablet, mobile) {
  return { desktop, tablet, mobile };
}

function profiles(published, studio = published) {
  return { published, studio };
}

export const BLOCK_REGISTRY = {
  hero: {
    type: 'hero',
    label: BLOCK_LABELS.hero,
    variant: 'default',
    payloadKey: 'hero',
    profiles: profiles({
      constraints: { minW: 3, minH: 2, maxW: 12 },
      placement: placement(
        { x: 4, y: 0, w: 8, h: 2 },
        { x: 3, y: 0, w: 5, h: 2 },
        { x: 0, y: 0, w: 4, h: 2 },
      ),
    }),
    createDefaultPayload: () => ({
      subtitle: bilingualValue('', ''),
      subtitleColor: '#ff6b00',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      overlayTopOpacity: 0.2,
      overlayBottomOpacity: 0.6,
      showLogo: false,
    }),
  },
  stats: {
    type: 'stats',
    label: BLOCK_LABELS.stats,
    variant: 'default',
    payloadKey: 'stats',
    profiles: profiles(
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 0, w: 4, h: 1 },
          { x: 0, y: 0, w: 3, h: 1 },
          { x: 0, y: 2, w: 4, h: 1 },
        ),
      },
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 0, w: 4, h: 1 },
          { x: 0, y: 0, w: 3, h: 1 },
          { x: 0, y: 2, w: 4, h: 1 },
        ),
      },
    ),
    createDefaultPayload: () => ([{ value: '1', label: bilingualValue('STAT', 'STAT') }]),
  },
  musicLinks: {
    type: 'musicLinks',
    label: BLOCK_LABELS.musicLinks,
    variant: 'default',
    payloadKey: 'musicLinks',
    profiles: profiles(
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 0, w: 4, h: 1 },
          { x: 0, y: 0, w: 3, h: 1 },
          { x: 0, y: 2, w: 4, h: 1 },
        ),
      },
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 0, w: 4, h: 1 },
          { x: 0, y: 0, w: 3, h: 1 },
          { x: 0, y: 2, w: 4, h: 1 },
        ),
      },
    ),
    createDefaultPayload: () => ({
      title: bilingualValue('Music Links', 'Music Links'),
      items: [
        { text: 'Spotify', url: 'https://open.spotify.com/' },
        { text: 'Apple Music', url: 'https://music.apple.com/' },
        { text: 'Bandcamp', url: 'https://bandcamp.com/' },
        { text: 'YouTube', url: 'https://youtube.com/' },
      ],
    }),
  },
  video: {
    type: 'video',
    label: BLOCK_LABELS.video,
    variant: 'default',
    payloadKey: 'video',
    profiles: profiles(
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 3, w: 4, h: 1 },
          { x: 0, y: 3, w: 4, h: 1 },
          { x: 0, y: 8, w: 4, h: 1 },
        ),
      },
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 3, w: 4, h: 1 },
          { x: 0, y: 3, w: 4, h: 1 },
          { x: 0, y: 8, w: 4, h: 1 },
        ),
      },
    ),
    createDefaultPayload: () => ({
      title: bilingualValue('Video', 'Video'),
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: bilingualValue('', ''),
    }),
  },
  spotify: {
    type: 'spotify',
    label: BLOCK_LABELS.spotify,
    variant: 'default',
    payloadKey: 'spotify',
    profiles: profiles(
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 4, y: 3, w: 4, h: 1 },
          { x: 4, y: 2, w: 4, h: 1 },
          { x: 0, y: 8, w: 4, h: 1 },
        ),
      },
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 4, y: 3, w: 4, h: 1 },
          { x: 4, y: 2, w: 4, h: 1 },
          { x: 0, y: 8, w: 4, h: 1 },
        ),
      },
    ),
    createDefaultPayload: () => ({
      title: bilingualValue('Spotify', 'Spotify'),
      url: 'https://open.spotify.com/',
      description: bilingualValue('', ''),
    }),
  },
  soundcloud: {
    type: 'soundcloud',
    label: BLOCK_LABELS.soundcloud,
    variant: 'default',
    payloadKey: 'soundcloud',
    profiles: profiles({
      constraints: { minW: 3, minH: 1, maxW: 6 },
      placement: placement(
        { x: 8, y: 2, w: 4, h: 1 },
        { x: 4, y: 2, w: 4, h: 1 },
        { x: 0, y: 9, w: 4, h: 1 },
      ),
    }),
    createDefaultPayload: () => ({
      title: bilingualValue('SoundCloud', 'SoundCloud'),
      url: 'https://soundcloud.com/',
      description: bilingualValue('', ''),
      large: false,
    }),
  },
  audio: {
    type: 'audio',
    label: BLOCK_LABELS.audio,
    variant: 'wide',
    payloadKey: 'audio',
    profiles: profiles({
      constraints: { minW: 4, minH: 1, maxW: 12 },
      placement: placement(
        { x: 0, y: 4, w: 8, h: 1 },
        { x: 0, y: 5, w: 5, h: 1 },
        { x: 0, y: 12, w: 4, h: 1 },
      ),
    }),
    createDefaultPayload: () => ({
      title: bilingualValue('Listen', 'Listen'),
      tracks: [
        {
          title: bilingualValue('Track 1', 'Track 1'),
          artist: '',
          filename: 'track-1',
          duration: '0:00',
        },
      ],
    }),
  },
  sampler: {
    type: 'sampler',
    label: BLOCK_LABELS.sampler,
    variant: 'wide',
    payloadKey: 'sampler',
    profiles: profiles({
      constraints: { minW: 3, minH: 1, maxW: 12 },
      placement: placement(
        { x: 8, y: 4, w: 4, h: 1 },
        { x: 5, y: 5, w: 3, h: 1 },
        { x: 0, y: 13, w: 4, h: 1 },
      ),
    }),
    createDefaultPayload: () => ({
      title: bilingualValue('Sampler', 'Sampler'),
      description: bilingualValue('', ''),
      folder: 'Samples',
      samplePool: ['sample.wav'],
      volume: 1,
    }),
  },
  fmod: {
    type: 'fmod',
    label: BLOCK_LABELS.fmod,
    variant: 'default',
    payloadKey: 'fmod',
    profiles: profiles({
      constraints: { minW: 4, minH: 1, maxW: 12 },
      placement: placement(
        { x: 0, y: 5, w: 12, h: 1 },
        { x: 0, y: 6, w: 8, h: 1 },
        { x: 0, y: 14, w: 4, h: 1 },
      ),
    }),
    createDefaultPayload: () => ({
      title: bilingualValue('FMOD Interactive Player', 'FMOD Interactive Player'),
      description: bilingualValue('', ''),
      folder: 'Project',
      banks: ['Master.bank'],
      events: [{ name: bilingualValue('Event', 'Event'), path: 'event:/music/main' }],
      parameters: [],
    }),
  },
  actions: {
    type: 'actions',
    label: BLOCK_LABELS.actions,
    variant: 'default',
    payloadKey: 'actions',
    profiles: profiles(
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 1, w: 4, h: 1 },
          { x: 0, y: 1, w: 3, h: 1 },
          { x: 0, y: 3, w: 4, h: 1 },
        ),
      },
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 1, w: 4, h: 1 },
          { x: 0, y: 1, w: 3, h: 1 },
          { x: 0, y: 3, w: 4, h: 1 },
        ),
      },
    ),
    createDefaultPayload: () => ({
      title: bilingualValue('Links', 'Links'),
      primary: { text: bilingualValue('Primary', 'Primary'), url: 'https://example.com' },
      secondary: { text: bilingualValue('Secondary', 'Secondary'), url: 'https://example.com' },
    }),
  },
  tech: {
    type: 'tech',
    label: BLOCK_LABELS.tech,
    variant: 'default',
    payloadKey: 'tech',
    profiles: profiles(
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 2, w: 4, h: 1 },
          { x: 0, y: 2, w: 4, h: 1 },
          { x: 0, y: 4, w: 4, h: 1 },
        ),
      },
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 0, y: 2, w: 4, h: 1 },
          { x: 0, y: 2, w: 4, h: 1 },
          { x: 0, y: 4, w: 4, h: 1 },
        ),
      },
    ),
    createDefaultPayload: () => ({
      title: bilingualValue('Technologie', 'Technology'),
    }),
  },
  process: {
    type: 'process',
    label: BLOCK_LABELS.process,
    variant: 'default',
    payloadKey: 'process',
    profiles: profiles(
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 4, y: 2, w: 4, h: 1 },
          { x: 4, y: 2, w: 4, h: 1 },
          { x: 0, y: 5, w: 4, h: 1 },
        ),
      },
      {
        constraints: { minW: 3, minH: 1, maxW: 6 },
        placement: placement(
          { x: 4, y: 2, w: 4, h: 1 },
          { x: 4, y: 2, w: 4, h: 1 },
          { x: 0, y: 5, w: 4, h: 1 },
        ),
      },
    ),
    createDefaultPayload: () => ({
      title: bilingualValue('Processus', 'Process'),
      subtitle: bilingualValue('', ''),
      steps: [bilingualValue('Step 1', 'Step 1')],
    }),
  },
  gallery: {
    type: 'gallery',
    label: BLOCK_LABELS.gallery,
    variant: 'default',
    payloadKey: 'gallery',
    profiles: profiles({
      constraints: { minW: 3, minH: 2, maxW: 6 },
      placement: placement(
        { x: 8, y: 2, w: 4, h: 2 },
        { x: 0, y: 3, w: 4, h: 1 },
        { x: 0, y: 6, w: 4, h: 2 },
      ),
    }),
    createDefaultPayload: () => ({
      title: bilingualValue('Galerie', 'Gallery'),
      images: [],
    }),
  },
  challenges: {
    type: 'challenges',
    label: BLOCK_LABELS.challenges,
    variant: 'default',
    payloadKey: 'challenges',
    profiles: profiles({
      constraints: { minW: 3, minH: 1, maxW: 8 },
      placement: placement(
        { x: 0, y: 3, w: 5, h: 1 },
        { x: 4, y: 3, w: 4, h: 1 },
        { x: 0, y: 8, w: 4, h: 1 },
      ),
    }),
    createDefaultPayload: () => ({
      title: bilingualValue('Defis Cles', 'Key Challenges'),
      subtitle: bilingualValue('', ''),
      items: [
        {
          title: bilingualValue('Challenge', 'Challenge'),
          description: bilingualValue('Description', 'Description'),
        },
      ],
    }),
  },
  results: {
    type: 'results',
    label: BLOCK_LABELS.results,
    variant: 'default',
    payloadKey: 'results',
    profiles: profiles(
      {
        constraints: { minW: 3, minH: 1, maxW: 8 },
        placement: placement(
          { x: 5, y: 3, w: 3, h: 1 },
          { x: 0, y: 4, w: 8, h: 1 },
          { x: 0, y: 9, w: 4, h: 1 },
        ),
      },
      {
        constraints: { minW: 3, minH: 1, maxW: 8 },
        placement: placement(
          { x: 5, y: 3, w: 3, h: 1 },
          { x: 0, y: 4, w: 8, h: 1 },
          { x: 0, y: 9, w: 4, h: 1 },
        ),
      },
    ),
    createDefaultPayload: () => ({
      title: bilingualValue('Resultats', 'Results'),
      subtitle: bilingualValue('', ''),
      items: [
        {
          icon: '✨',
          text: bilingualValue('Resultat', 'Result'),
        },
      ],
    }),
  },
};

function getProfileName(profile = DEFAULT_PROFILE) {
  return profile === 'studio' ? 'studio' : DEFAULT_PROFILE;
}

function getProfileData(type, profile = DEFAULT_PROFILE) {
  const definition = BLOCK_REGISTRY[type];
  const profileName = getProfileName(profile);
  return definition?.profiles?.[profileName] || definition?.profiles?.[DEFAULT_PROFILE];
}

export function createDefaultBlock(type, index = 0, profile = DEFAULT_PROFILE) {
  const definition = BLOCK_REGISTRY[type];
  const profileData = getProfileData(type, profile);
  if (!definition || !profileData) return null;

  return {
    id: `${type}-${index + 1}`,
    type,
    enabled: true,
    variant: definition.variant || 'default',
    placement: structuredClone(profileData.placement),
  };
}

export function createDefaultPayloadForBlock(type) {
  const definition = BLOCK_REGISTRY[type];
  if (!definition) return null;
  return definition.createDefaultPayload ? definition.createDefaultPayload() : null;
}

export function getBlockPlacementDefaults(type, profile = DEFAULT_PROFILE) {
  const placementDefaults = getProfileData(type, profile)?.placement;
  return structuredClone(placementDefaults || {
    desktop: { x: 0, y: 0, w: DEFAULT_LAYOUT_COLUMNS.desktop, h: 1 },
    tablet: { x: 0, y: 0, w: DEFAULT_LAYOUT_COLUMNS.tablet, h: 1 },
    mobile: { x: 0, y: 0, w: DEFAULT_LAYOUT_COLUMNS.mobile, h: 1 },
  });
}

export function getBlockConstraints(type, profile = DEFAULT_PROFILE) {
  return structuredClone(getProfileData(type, profile)?.constraints || { minW: 1, minH: 1, maxW: 12 });
}

export function getBlockDefinitionList(profile = DEFAULT_PROFILE) {
  return BLOCK_TYPES.map((type) => ({
    type,
    label: BLOCK_REGISTRY[type]?.label || type,
    variant: BLOCK_REGISTRY[type]?.variant || 'default',
    constraints: getBlockConstraints(type, profile),
  }));
}
