// Core atom configuration - modify these values to customize behavior
export const userTweaks = {
  
  // Rotation speeds (degrees/second)
  electronSpeeds: {
    innerShell: 7.0,
    middleShell: 9.0,
    outerShell: 12.0
  },

  // Element sizes
  electronSize: 18,
  electronHoverSize: 22,
  nucleusSize: 40,
  nucleusHoverSize: 52,

  // Nucleus logo positioning
  nucleusLogo: {
    size: 1.35,
    offsetX: -1,
    offsetY: -1.1
  },

  // Animation timing (seconds)
  hoverAnimationSpeed: 0.15,
  baselineResetAnimationSpeed: 0.15,

  // Drag physics
  dragSnapDuration: 0.5,
  dragElastic: {
    amplitude: 0.18,
    period: 0.2
  },

  // Shell layout
  shellDistances: {
    inner: 120,
    middle: 200,
    outer: 280
  },
  minElectronDistance: 50,

  // Shell appearance
  shell: {
    default: {
      thickness: 4,
      opacity: 0.3
    },
    hover: {
      thickness: 5,
      opacity: 0.7,
      electronOpacity: 0.2
    }
  },

  // Viewport settings
  viewportSize: 900,
  viewportPadding: 80,
  atomScale: 1,

  // Domain configuration
  domainShellOrder: ['music', 'sound-design', 'tech'],
  domainDisplayNames: {
    music: 'MUSIC',
    'sound-design': 'SOUND DESIGN',
    tech: 'TECH'
  },

  // Interaction settings
  shellHitboxTolerance: 30,

  // Overlay transitions
  overlayTransition: {
    openMs: 1000,
    closeMs: 600,
    easing: 'power2.inOut'
  },

  // Nav transition (electron → overlay)
  navTransition: {
    enabled: true,
    inMs: 1000,
    outMs: 600,
    easing: 'power2.inOut',
    respectReducedMotion: true,
    edgeSoftnessPx: 0,
    blockInput: true
  },

  // Micro interactions
  micro: {
    hoverCursorRing: false,
    hoverRingDelta: 6,
    hoverRingOpacity: 0.6,
    hoverRingDurationMs: 160,
    ripple: true,
    rippleDurationMs: 360,
    rippleColor: '#000',
    rippleStrokeWidth: 2.7,
    rippleExpandPx: 56,
    shellPulse: true,
    shellPulseDelta: 1.2,
    shellPulseDurationMs: 200
  },

  // Shell labels
  labels: {
    enabled: true,
    mode: 'ringPattern',
    fontSize: 14,
    offsetPx: 18,
    idleOpacity: 0.25,
    hoverOpacity: 0.6,
    repeat: 12,
    pattern: {
      offsetsPercentByShell: [0, 3.5, 7],
      repeatsByShell: [12, 9, 40],
      densityPxPerRepeat: 26,
      minRepeats: 3,
      maxRepeats: 40,
      separator: ' • '
    },
    rotate: {
      enabled: false,
      respectReducedMotion: false,
      speedsByShell: [90, 110, 130]
    },
    mobileViewportMaxPx: 700,
    mobileArcDegrees: 150,
    wordOrbit: {
      innerOffsetPx: 22,
      arcDegrees: 160,
      centerAngleDeg: -60
    }
  },

  // Dynamic shells
  dynamicShells: {
    enabled: true,
    baseRadius: 120,
    baseGap: 80,
    minGap: 56,
    maxGap: 110,
    directionMode: 'alternate',
    speed: { base: 9.0, deltaPerShell: 0.0 }
  },

  // Bento animations
  bentoAnimations: {
    enabled: true,
    staggerDelayMs: 80,
    animationDurationMs: 400,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    cardEnabled: {
      hero: true,
      stats: true,
      actions: true,
      tech: true,
      gallery: true,
      process: true,
      challenges: true,
      results: true
    },
    audio: {
      enabled: false,
      volume: 0,
      syncWithAnimation: true,
      pitches: {
        hero: 'C3',
        stats: 'E3',
        actions: 'G3',
        tech: 'C4',
        gallery: 'E4',
        process: 'G4',
        challenges: 'B3', 
        results: 'D4'     
      },
      synthesis: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0,
        release: 0.8,
        chorus: {
          frequency: 4,
          depth: 0.3
        }
      }
    }
  },

  // Electron preview cards
  electronPreview: {
    enabled: true,
    width: 250,
    height: 110,
    offsetX: 20,
    offsetY: -100,
    borderRadius: 8,
    heroSize: 88,
    heroRadius: 8,
    heroMargin: 10,
    contentPadding: 16,
    titleSize: 16,
    subtitleSize: 13,
    animationDuration: 0.2,
    animationEase: 'back.out(1.7)',
    multiStage: {
      stage1Duration: 0.7,
      stage2Duration: 0.4,
      stage3Duration: 0.2,
      settleDebounce: 0.1,
      birthScale: 0.1,
      travelScale: 0.3,
      preExpandScale: 0.8,
      overshootScale: 1.05,
      finalScale: 1.0,
      birthOpacity: 0.3,
      travelOpacity: 0.7,
      preExpandOpacity: 0.9,
      finalOpacity: 1.0
    }
  },

  // Atom interface sounds
  atomSounds: {
    enabled: false,
    volume: 0.2,
    events: {
      electronHover: 'C4',
      electronClick: 'C3',
      shellHover: 'G4',
      nucleusHover: 'F2',
      nucleusClick: 'A2',
      ripple: 'E5',
      shellPulse: 'D4',
      electronDragStart: 'B4',
      electronDragSnap: 'C5',
      electronDragRelease: 'E4'
    },
    synthesis: {
      attack: 0.02,
      decay: 0.4,
      sustain: 0,
      release: 1.2
    }
  },

  // Liquid glass effects
  liquidGlass: {
    enabled: true,
    displacementScale: 70,
    blurAmount: 0.0625,
    elasticity: 0.8
  },

  // Bio skills UI
  bentoSkillsUI: {
    boxMinHeight: 23,
    padX: 20,
    padY: 12,
    fontSize: 14,
    logoSize: 25,
    gap: 16,
    borderRadius: 12
  },

  // Bio text styling
  bioText: {
    fontSize: 17,
    lineHeight: 1.6,
    alignment: 'top',
    justify: true,
    fontWeight: 400
  },

  // Modern design system
  modernDesign: {
    shadows: {
      card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04)',
      cardHover: '0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.06)',
      subtle: '0 1px 3px rgba(0, 0, 0, 0.08)'
    },
    colors: {
      surfacePrimary: '#ffffff',
      surfaceSecondary: '#f8fafc', 
      surfaceTertiary: '#f1f5f9',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textTertiary: '#64748b',
      borderPrimary: '#e2e8f0',
      borderSecondary: '#cbd5e1',
      borderAccent: '#475569'
    },
    transitions: {
      fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      medium: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    skillGrid: {
      minCardWidth: 140,
      gap: 16,
      cardPadding: 16,
      hoverTransform: 'translateY(-2px) scale(1.02)',
      borderRadius: 12
    },
    socialLinks: {
      minTouchTarget: 44,
      iconSize: 20,
      padding: 10,
      gap: 12
    }
  },

  // Welcome page
  prePage: {
    enabled: true,
    path: '/welcome',
    storageKey: 'entered',
    title: 'Bienvenue !',
    description: 'Vous êtes sur le portfolio d\'Arthur Kowskii. Ce site est encore en construction, et de nouvelles fonctionnalités sont prévues très bientôt !',
    buttonLabel: 'Enter Portfolio',
    noindex: true,
    audioPrewarm: true,
    animations: {
      overlayFadeDuration: 0.4,
      cardAnimationDuration: 0.6,
      cardDelay: 0.15,
      focusDelay: 0.8,
      cardStartScale: 0.85,
      cardStartRotation: 0,
      cardStartY: 30,
      overlayEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      cardEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      forceAnimations: true,
      debugMode: false
    }
  },

  // Gallery layout
  bentoGallery: {
    extraRow1DeltaPx: 500,
    extraRow2DeltaPx: 1000,
    heroMinHeightFallback: 120,
    maxRows: 3
  },

  // Social sharing
  socialMeta: {
    siteName: 'Portfolio Arthur Kowskii',
    siteUrl: 'https://arthurkowskii.com',
    author: 'Arthur Kowskii',
    defaultDescription: 'Portfolio interactif présentant production musicale, sound design pour jeux vidéo et projets techniques à travers une interface atomique innovante.',
    home: {
      title: 'Arthur Kowskii — Portfolio Interactif',
      description: 'Explorez mes productions dans une expérience portfolio interactive basée sur un atome.',
      image: '/images/social/webpage_preview.webp',
      imageAlt: 'Portfolio Interactif Arthur Kowskii - Visualisation atomique avec projets orbitaux'
    },
    bio: {
      title: 'À Propos d\'Arthur Kowskii — Bio Portfolio Créatif',
      description: 'Découvrez mon parcours en production musicale, sound design pour jeux vidéo et développement technique. Compétences, expérience et philosophie créative.',
      image: '/images/social/og-bio.jpg',
      imageAlt: 'Arthur Kowskii - Producteur Musical, Sound Designer, Développeur'
    },
    project: {
      title: '{projectTitle} — Portfolio Arthur Kowskii',
      description: '{projectDescription}',
      image: '/images/social/og-default.jpg',
      imageAlt: 'Projet Portfolio Arthur Kowskii - {projectTitle}'
    },
    images: {
      defaultFallback: '/images/social/og-default.jpg',
      homePage: '/images/social/og-home.jpg', 
      bioPage: '/images/social/og-bio.jpg'
    },
    twitter: {
      handle: '@arthurkowskii',
      cardType: 'summary_large_image'
    }
  },

  // Bio page layout
  bioPageLayout: {
    topGapPx: 100
  },

  // Visited indicators
  visitedIndicators: {
    size: 10,
    scale: 0.85,
    strokeWidth: 0.5,
    outline: true,
    colors: {
      background: '#ffffff',
      border: '#e5e5e5',
      checkmark: '#171717',
      borderDark: '#333333',
      checkmarkDark: '#ffffff'
    },
    offset: {
      x: 0.8,
      y: -0.8
    },
    emergence: {
      enabled: true,
      duration: 0.4,
      startScale: 0.3,
      easing: 'back.out(1.7)',
      delay: 0.1
    },
    filtering: {
      dimOpacity: 0.25,
      animationDuration: 0.3
    },
    simple: true
  }

};

// Don't edit below this line unless you know what you're doing!
// ================================================================

export default userTweaks;
