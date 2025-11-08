/**
 * Audio Manager - Web Audio API based sound system
 * Handles all audio playback with volume controls, muting, and error fallbacks
 */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map(); // soundId -> AudioBuffer
    this.masterVolume = 0.7;
    this.muted = false;
    this.initialized = false;
    this.loadingPromises = new Map(); // Track loading states
    this.volumeOverrides = new Map(); // soundId -> volume override

    // Restore mute state from localStorage
    const savedMute = localStorage.getItem('audioMuted');
    if (savedMute !== null) {
      this.muted = savedMute === 'true';
    }
  }

  /**
   * Initialize the AudioContext (must be called after user interaction)
   */
  init() {
    if (this.initialized) return;

    try {
      // Create AudioContext with webkit fallback for Safari
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported');
        return false;
      }

      this.audioContext = new AudioContextClass();
      this.initialized = true;
      console.log('AudioManager initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      return false;
    }
  }

  /**
   * Load a sound file and store as AudioBuffer
   * @param {string} soundId - Unique identifier for the sound
   * @param {string} url - Path to audio file
   * @returns {Promise<boolean>} - Success status
   */
  async loadSound(soundId, url) {
    if (!this.initialized && !this.init()) {
      return false;
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(soundId)) {
      return this.loadingPromises.get(soundId);
    }

    // Return true if already loaded
    if (this.sounds.has(soundId)) {
      return true;
    }

    const loadPromise = (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        this.sounds.set(soundId, audioBuffer);
        console.log(`Loaded sound: ${soundId}`);
        return true;
      } catch (error) {
        console.error(`Failed to load sound ${soundId}:`, error);
        return false;
      } finally {
        this.loadingPromises.delete(soundId);
      }
    })();

    this.loadingPromises.set(soundId, loadPromise);
    return loadPromise;
  }

  /**
   * Play a loaded sound
   * @param {string} soundId - Sound identifier
   * @param {object} options - Playback options
   * @param {number} options.volume - Override volume (0-1)
   * @param {boolean} options.loop - Loop the sound
   * @returns {AudioBufferSourceNode|null} - Source node or null if failed
   */
  playSound(soundId, options = {}) {
    if (!this.initialized || this.muted) {
      return null;
    }

    const audioBuffer = this.sounds.get(soundId);
    if (!audioBuffer) {
      console.warn(`Sound ${soundId} not loaded`);
      return null;
    }

    try {
      // Create source node
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();

      // Calculate final volume: options.volume OR volumeOverride OR 1.0, then multiply by master
      const baseVolume = options.volume ?? this.volumeOverrides.get(soundId) ?? 1.0;
      gainNode.gain.value = baseVolume * this.masterVolume;

      // Configure loop
      if (options.loop) {
        source.loop = true;
      }

      // Connect nodes: source -> gain -> destination
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Play
      source.start(0);

      return source;
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error);
      return null;
    }
  }

  /**
   * Set master volume
   * @param {number} volume - Volume level (0-1)
   */
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    console.log(`Master volume set to ${this.masterVolume}`);
  }

  /**
   * Toggle mute state
   * @returns {boolean} - New mute state
   */
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('audioMuted', this.muted.toString());
    console.log(`Audio ${this.muted ? 'muted' : 'unmuted'}`);
    return this.muted;
  }

  /**
   * Set mute state explicitly
   * @param {boolean} muted - Mute state
   */
  setMuted(muted) {
    this.muted = muted;
    localStorage.setItem('audioMuted', this.muted.toString());
  }

  /**
   * Get current mute state
   * @returns {boolean}
   */
  isMuted() {
    return this.muted;
  }

  /**
   * Set volume override for a specific sound
   * @param {string} soundId - Sound identifier
   * @param {number} volume - Volume override (0-1)
   */
  setVolumeOverride(soundId, volume) {
    this.volumeOverrides.set(soundId, Math.max(0, Math.min(1, volume)));
  }

  /**
   * Preload multiple sounds
   * @param {Object} soundMap - Map of soundId -> url
   * @param {Object} volumeOverrides - Optional map of soundId -> volume
   * @returns {Promise<void>}
   */
  async preloadSounds(soundMap, volumeOverrides = {}) {
    const promises = Object.entries(soundMap).map(([soundId, url]) =>
      this.loadSound(soundId, url)
    );

    // Set volume overrides
    Object.entries(volumeOverrides).forEach(([soundId, volume]) => {
      this.setVolumeOverride(soundId, volume);
    });

    await Promise.allSettled(promises);
  }

  /**
   * Check if a sound is loaded
   * @param {string} soundId - Sound identifier
   * @returns {boolean}
   */
  isSoundLoaded(soundId) {
    return this.sounds.has(soundId);
  }

  /**
   * Unload a sound to free memory
   * @param {string} soundId - Sound identifier
   */
  unloadSound(soundId) {
    this.sounds.delete(soundId);
    console.log(`Unloaded sound: ${soundId}`);
  }

  /**
   * Resume AudioContext (needed for autoplay policies)
   */
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

// Export for use in other modules
export default audioManager;
