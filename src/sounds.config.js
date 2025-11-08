/**
 * Sound Configuration
 * Central place to manage all audio files and settings
 */

export const soundsConfig = {
  // Master audio settings
  enabled: true,
  masterVolume: 0.7,
  muted: false,

  // Sound file paths
  // Add new sounds here as you create them
  sounds: {
    // Bio overlay sounds
    bioOpen: '/sounds/arp_enter.wav',
    bioClose: '/sounds/fast_fermeture.wav',

    // Future sounds (examples - uncomment when ready)
    // electronHover: '/sounds/electron_hover.wav',
    // electronClick: '/sounds/electron_click.wav',
    // shellHover: '/sounds/shell_hover.wav',
    // nucleusHover: '/sounds/nucleus_hover.wav',
    // projectOpen: '/sounds/project_open.wav',
    // projectClose: '/sounds/project_close.wav',
  },

  // Volume overrides per sound (optional)
  // Use this to make specific sounds quieter/louder than the master volume
  volumeOverrides: {
    bioOpen: 1.0,   // 100% of master volume
    bioClose: 1.0,  // 100% of master volume
    // electronHover: 0.5,  // 50% of master volume (example)
  }
};

export default soundsConfig;
