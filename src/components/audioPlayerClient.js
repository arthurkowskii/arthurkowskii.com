import { Howl, Howler } from 'howler';

const DEFAULT_CONFIG = {
  enabled: true,
  defaultVolume: 0.7,
  fade: {
    durationMs: 650,
    forceDurationMs: 220,
    applyLowPass: true,
    applyLowPassOnForce: true
  },
  lowPass: {
    enabled: true,
    startFrequencyHz: 14000,
    targetFrequencyHz: 320,
    resonanceQ: 0.85,
    fadeDurationMs: 650
  }
};

const pick = (...values) => values.find((value) => value !== undefined);

function resolveConfig() {
  const inlineConfig = window.__bentoAudioPlayerConfig || {};
  const runtimeConfig = window.atomConfig?.audioPlayer || {};
  const source = (keyPath, fallback) => {
    const [section, prop] = keyPath.split('.');
    if (prop) {
      return pick(
        runtimeConfig[section]?.[prop],
        inlineConfig[section]?.[prop],
        DEFAULT_CONFIG[section]?.[prop],
        fallback
      );
    }
    return pick(runtimeConfig[section], inlineConfig[section], DEFAULT_CONFIG[section], fallback);
  };

  return {
    enabled: source('enabled', true),
    defaultVolume: source('defaultVolume', DEFAULT_CONFIG.defaultVolume),
    fade: {
      durationMs: source('fade.durationMs', DEFAULT_CONFIG.fade.durationMs),
      forceDurationMs: source('fade.forceDurationMs', DEFAULT_CONFIG.fade.forceDurationMs),
      applyLowPass: source('fade.applyLowPass', DEFAULT_CONFIG.fade.applyLowPass),
      applyLowPassOnForce: source('fade.applyLowPassOnForce', DEFAULT_CONFIG.fade.applyLowPassOnForce)
    },
    lowPass: {
      enabled: source('lowPass.enabled', DEFAULT_CONFIG.lowPass.enabled),
      startFrequencyHz: source('lowPass.startFrequencyHz', DEFAULT_CONFIG.lowPass.startFrequencyHz),
      targetFrequencyHz: source('lowPass.targetFrequencyHz', DEFAULT_CONFIG.lowPass.targetFrequencyHz),
      resonanceQ: source('lowPass.resonanceQ', DEFAULT_CONFIG.lowPass.resonanceQ),
      fadeDurationMs: source('lowPass.fadeDurationMs', DEFAULT_CONFIG.lowPass.fadeDurationMs)
    }
  };
}

let globalLowPassFilter = null;

function ensureLowPassFilter(config) {
  if (!config.lowPass.enabled) return null;
  if (globalLowPassFilter || !Howler?.usingWebAudio) {
    return globalLowPassFilter;
  }
  if (!Howler?.ctx || !Howler?.masterGain) return null;
  try {
    const filter = Howler.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = config.lowPass.resonanceQ;
    filter.frequency.value = config.lowPass.startFrequencyHz;
    const destination = Howler.ctx.destination;
    Howler.masterGain.disconnect();
    Howler.masterGain.connect(filter);
    filter.connect(destination);
    globalLowPassFilter = filter;
    return filter;
  } catch (err) {
    console.warn('Failed to initialize low-pass filter:', err);
    try {
      Howler.masterGain.connect(Howler.ctx.destination);
    } catch {}
    globalLowPassFilter = null;
    return null;
  }
}

function resetLowPassFilter(config) {
  if (!globalLowPassFilter || !Howler?.ctx) return;
  const ctx = Howler.ctx;
  const now = ctx.currentTime;
  try {
    globalLowPassFilter.frequency.cancelScheduledValues(now);
    globalLowPassFilter.frequency.setValueAtTime(config.lowPass.startFrequencyHz, now);
  } catch {}
}

function animateLowPassFilter(volumeFadeMs, config) {
  if (!config.lowPass.enabled) return;
  const durationMs = config.lowPass.fadeDurationMs ?? volumeFadeMs;
  const filter = ensureLowPassFilter(config);
  if (!filter || !Howler?.ctx) return;
  const ctx = Howler.ctx;
  const now = ctx.currentTime;
  try {
    filter.frequency.cancelScheduledValues(now);
    filter.frequency.setValueAtTime(config.lowPass.startFrequencyHz, now);
    filter.frequency.linearRampToValueAtTime(
      config.lowPass.targetFrequencyHz,
      now + durationMs / 1000
    );
  } catch (err) {
    console.warn('Low-pass animation failed:', err);
  }
  setTimeout(() => {
    resetLowPassFilter(config);
  }, durationMs + 200);
}

function fadeOutAllControllers(options = {}) {
  if (typeof document === 'undefined') return;
  const cards = document.querySelectorAll('.audio-card');
  cards.forEach((card) => {
    const controller = card?.__audioController;
    if (controller && typeof controller.fadeOut === 'function') {
      try {
        controller.fadeOut(options);
      } catch (err) {
        console.warn('Audio controller fade failed:', err);
      }
    }
  });
}

function initAudioPlayers() {
  const audioCards = document.querySelectorAll('.audio-card');

  audioCards.forEach((card) => {
    if (card.dataset.audioReady === 'true') return;
    card.dataset.audioReady = 'true';

    const config = resolveConfig();
    const playBtn = card.querySelector('.audio-play-btn');
    const playIcon = card.querySelector('.play-icon');
    const pauseIcon = card.querySelector('.pause-icon');
    const prevBtn = card.querySelector('.prev-btn');
    const nextBtn = card.querySelector('.next-btn');
    const trackName = card.querySelector('.track-name');
    const progressBar = card.querySelector('.audio-progress-bar');
    const progressFill = card.querySelector('.audio-progress-fill');
    const timeCurrent = card.querySelector('.time-current');
    const timeTotal = card.querySelector('.time-total');

    const projectSlug = card.getAttribute('data-project-slug') || '';
    const tracksData = card.getAttribute('data-tracks');

    if (!tracksData) return;

    const tracks = JSON.parse(tracksData);
    const currentLang = document.documentElement.lang || 'fr';

    let currentTrackIndex = 0;
    let sound = null;
    let isPlaying = false;
    let isFadingOut = false;

    const folderMap = {
      chromestesia_showcase: 'Chromestesia'
    };
    const audioFolder = folderMap[projectSlug] || projectSlug;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const controller = {
      fadeOut: ({ force } = {}) => fadeOutCurrentSound({ force })
    };
    card.__audioController = controller;

    function fadeOutCurrentSound({ force } = {}) {
      if (!sound || isFadingOut) return;
      isFadingOut = true;
      const targetSound = sound;
      const fadeMs = force ? config.fade.forceDurationMs : config.fade.durationMs;
      sound = null;
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      playBtn.classList.remove('playing');
      progressFill.style.width = '0%';
      timeCurrent.textContent = '0:00';
      const shouldLowPass =
        (force ? config.fade.applyLowPassOnForce : config.fade.applyLowPass) &&
        config.lowPass.enabled;
      if (shouldLowPass) {
        animateLowPassFilter(fadeMs, config);
      }

      try {
        const fromVol = typeof targetSound.volume === 'function' ? targetSound.volume() : 1;
        if (typeof targetSound.fade === 'function') {
          targetSound.fade(fromVol, 0, fadeMs);
        } else {
          targetSound.stop();
        }
      } catch (err) {
        console.warn('Audio fade error:', err);
        try {
          targetSound.stop();
        } catch {}
      }

      setTimeout(() => {
        try {
          targetSound.stop();
        } catch {}
        try {
          targetSound.unload?.();
        } catch {}
        isFadingOut = false;
      }, fadeMs + 80);
    }

    function loadTrack(index) {
      if (sound) {
        sound.unload();
      }
      isFadingOut = false;

      currentTrackIndex = index;
      const track = tracks[index];

      trackName.textContent = track.title[currentLang] || track.title.en;
      timeCurrent.textContent = '0:00';
      timeTotal.textContent = track.duration || '0:00';
      progressFill.style.width = '0%';

      const audioSources = [
        `/audio/${audioFolder}/${track.filename}.ogg`,
        `/audio/${audioFolder}/${track.filename}.mp3`,
        `/audio/${audioFolder}/${track.filename}.wav`
      ];

      sound = new Howl({
        src: audioSources,
        preload: 'metadata',
        volume: config.defaultVolume,
        onplay: () => {
          isPlaying = true;
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          playBtn.classList.add('playing');
          requestAnimationFrame(updateProgress);
        },
        onpause: () => {
          isPlaying = false;
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
          playBtn.classList.remove('playing');
        },
        onend: () => {
          isPlaying = false;
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
          playBtn.classList.remove('playing');

          if (currentTrackIndex < tracks.length - 1) {
            loadTrack(currentTrackIndex + 1);
            sound?.play();
          }
        },
        onload: () => {
          const duration = sound?.duration() || 0;
          timeTotal.textContent = formatTime(duration);
        }
      });
    }

    function updateProgress() {
      if (!sound || !isPlaying) return;

      const seek = sound.seek();
      const duration = sound.duration();
      const progress = (seek / duration) * 100;

      progressFill.style.width = `${progress}%`;
      timeCurrent.textContent = formatTime(seek);

      if (isPlaying) {
        requestAnimationFrame(updateProgress);
      }
    }

    playBtn?.addEventListener('click', () => {
      if (!sound) {
        loadTrack(0);
      }

      if (isPlaying) {
        sound?.pause();
      } else {
        sound?.play();
      }
    });

    prevBtn?.addEventListener('click', () => {
      const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
      loadTrack(newIndex);
      sound?.play();
    });

    nextBtn?.addEventListener('click', () => {
      const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
      loadTrack(newIndex);
      sound?.play();
    });

    progressBar?.addEventListener('click', (e) => {
      if (!sound) return;
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const seek = percent * sound.duration();
      sound.seek(seek);
      progressFill.style.width = `${percent * 100}%`;
      timeCurrent.textContent = formatTime(seek);
    });

    if (tracks.length > 0) {
      loadTrack(0);
    }
  });
}

function bootstrapAudioPlayer() {
  const initialize = () => initAudioPlayers();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  document.addEventListener('astro:page-load', () => {
    fadeOutAllControllers({ force: true });
    initAudioPlayers();
  });

  if (!window.__bentoAudioShutdownHooked) {
    const shutdown = (force = false) => fadeOutAllControllers({ force });
    window.addEventListener('bento:audio:shutdown', (event) => shutdown(!!event.detail?.force));
    window.addEventListener('beforeunload', () => shutdown(true));
    window.addEventListener('pagehide', () => shutdown(true));
    window.__bentoAudioShutdownHooked = true;
  }
}

if (typeof window !== 'undefined') {
  if (!window.__bentoAudioPlayerBootstrapped) {
    window.__bentoAudioPlayerBootstrapped = true;
    bootstrapAudioPlayer();
  } else {
    // Refresh audio cards if new instances were added dynamically
    initAudioPlayers();
  }
}
