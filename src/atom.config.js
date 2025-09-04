/**
 * Atom Portfolio Configuration
 * All visual and timing parameters for the interactive atom
 */

import { userTweaks } from './user-tweaks.js';


export default {
  // Central nucleus (bio/about section)
  nucleus: {
    text: "Me",          // Initial, logo, or avatar
    radius: userTweaks.nucleusSize * userTweaks.atomScale,
    hoverRadius: (userTweaks.nucleusHoverSize ?? userTweaks.nucleusSize * 1.3) * userTweaks.atomScale,
    fontSize: 24 * userTweaks.atomScale,        // Text size inside nucleus (scaled)
    color: "#171717",    // Refined dark gray for better readability
    strokeWidth: 2 * userTweaks.atomScale,
    logo: {
      size: userTweaks.nucleusLogo?.size ?? 1.4,
      offsetX: userTweaks.nucleusLogo?.offsetX ?? 0,
      offsetY: userTweaks.nucleusLogo?.offsetY ?? 0
    }
  },

  // Orbital shells (domains of work)
  shells: [
    {
      radius: userTweaks.shellDistances.inner * userTweaks.atomScale,
      speed: userTweaks.electronSpeeds.innerShell,          // Speed unchanged
      direction: 1,        // 1 = clockwise, -1 = counterclockwise
      strokeWidth: userTweaks.shell.default.thickness * userTweaks.atomScale,
      hoverStrokeWidth: userTweaks.shell.hover.thickness * userTweaks.atomScale,
      defaultOpacity: userTweaks.shell.default.opacity,
      hoverOpacity: userTweaks.shell.hover.opacity,
      electronHoverOpacity: userTweaks.shell.hover.electronOpacity,
      color: "#525252"
    },
    {
      radius: userTweaks.shellDistances.middle * userTweaks.atomScale,
      speed: userTweaks.electronSpeeds.middleShell,         // Speed unchanged
      direction: -1,       // Alternating direction for rhythm
      strokeWidth: userTweaks.shell.default.thickness * userTweaks.atomScale,
      hoverStrokeWidth: userTweaks.shell.hover.thickness * userTweaks.atomScale,
      defaultOpacity: userTweaks.shell.default.opacity,
      hoverOpacity: userTweaks.shell.hover.opacity,
      electronHoverOpacity: userTweaks.shell.hover.electronOpacity,
      color: "#525252"
    },
    {
      radius: userTweaks.shellDistances.outer * userTweaks.atomScale,
      speed: userTweaks.electronSpeeds.outerShell,          // Speed unchanged
      direction: 1,
      strokeWidth: userTweaks.shell.default.thickness * userTweaks.atomScale,
      hoverStrokeWidth: userTweaks.shell.hover.thickness * userTweaks.atomScale,
      defaultOpacity: userTweaks.shell.default.opacity,
      hoverOpacity: userTweaks.shell.hover.opacity,
      electronHoverOpacity: userTweaks.shell.hover.electronOpacity,
      color: "#525252"
    }
  ],

  // Electrons (project entries)
  electrons: {
    radius: userTweaks.electronSize * userTweaks.atomScale,
    hoverRadius: userTweaks.electronHoverSize * userTweaks.atomScale,
    color: "#171717",
    hoverColor: "#171717",
    strokeWidth: 2 * userTweaks.atomScale
  },

  // Electron spacing
  spacing: {
    minElectronDistance: userTweaks.minElectronDistance
  },

  // Hitbox for shell hover (game-like distance-based detection)
  hitbox: {
    tolerance: userTweaks.shellHitboxTolerance // pixels; not scaled to keep absolute feel
  },

  // Animation timing and easing
  timing: {
    hoverDuration: userTweaks.hoverAnimationSpeed,
    baselineResetDuration: userTweaks.baselineResetAnimationSpeed,
    dragSnapDuration: userTweaks.dragSnapDuration ?? 0.5,
    dragElastic: {        // Elastic ease parameters for snap-back
      amplitude: userTweaks.dragElastic?.amplitude ?? 0.8,
      period: userTweaks.dragElastic?.period ?? 0.25
    },
    tetherUpdate: 0.016,   // 60fps for tether rendering
    pauseEasing: "power2.out"
  },

  // Tether effect (gooey connection during drag)
  tether: {
    maxStretch: 100,     // Max distance before breaking visually
    thickness: 4,        // Line thickness
    color: "#525252",
    opacity: 0.6,
    springiness: 0.8     // How elastic the connection looks
  },

  // Viewport and layout (auto-calculated based on atom scale)
  viewport: (() => {
    // Calculate minimum viewport size needed based on scaled atom
    const maxShellRadius = Math.max(
      userTweaks.shellDistances.inner,
      userTweaks.shellDistances.middle,
      userTweaks.shellDistances.outer
    ) * userTweaks.atomScale;
    
    const maxElectronRadius = userTweaks.electronHoverSize * userTweaks.atomScale;
    const scaledPadding = userTweaks.viewportPadding * userTweaks.atomScale;
    
    const requiredSize = (maxShellRadius + maxElectronRadius + scaledPadding) * 2;
    const finalSize = Math.max(userTweaks.viewportSize, requiredSize);
    
    return {
      width: finalSize,          // Auto-calculated or user override
      height: finalSize,         // Auto-calculated or user override
      centerX: finalSize / 2,    // Center point
      centerY: finalSize / 2,
      padding: scaledPadding     // Scaled safe area around edges
    };
  })(),

  // Accessibility and motion
  motion: {
    respectReducedMotion: false,  // Temporarily disabled to fix electron motion issue
    fallbackToStatic: true,       // Show static version if needed
    minFPS: 30                    // Performance threshold
  },

  // One-page project overlay transition
  overlayTransition: {
    openMs: userTweaks.overlayTransition?.openMs ?? 600,
    closeMs: userTweaks.overlayTransition?.closeMs ?? 520,
    easing: userTweaks.overlayTransition?.easing ?? 'power2.inOut',
    edgeSoftnessPx: (userTweaks.overlayTransition?.edgeSoftnessPx ?? userTweaks.navTransition?.edgeSoftnessPx) ?? 0
  },

  // Electron navigation transition (separate in/out)
  navTransition: {
    enabled: userTweaks.navTransition?.enabled ?? true,
    inMs: userTweaks.navTransition?.inMs ?? (userTweaks.overlayTransition?.openMs ?? 600),
    outMs: userTweaks.navTransition?.outMs ?? (userTweaks.overlayTransition?.closeMs ?? 520),
    easing: userTweaks.navTransition?.easing ?? (userTweaks.overlayTransition?.easing ?? 'power2.inOut'),
    respectReducedMotion: userTweaks.navTransition?.respectReducedMotion ?? true,
    edgeSoftnessPx: userTweaks.navTransition?.edgeSoftnessPx ?? 0,
    blockInput: userTweaks.navTransition?.blockInput ?? true
  },

  // Micro-interactions
  micro: {
    hoverCursorRing: userTweaks.micro?.hoverCursorRing ?? true,
    hoverRingDelta: userTweaks.micro?.hoverRingDelta ?? 6,
    hoverRingOpacity: userTweaks.micro?.hoverRingOpacity ?? 0.6,
    hoverRingDurationMs: userTweaks.micro?.hoverRingDurationMs ?? 160,
    ripple: userTweaks.micro?.ripple ?? true,
    rippleDurationMs: userTweaks.micro?.rippleDurationMs ?? 360,
    rippleColor: userTweaks.micro?.rippleColor ?? '#171717',
    rippleStrokeWidth: userTweaks.micro?.rippleStrokeWidth ?? 2,
    rippleExpandPx: userTweaks.micro?.rippleExpandPx ?? 56,
    shellPulse: userTweaks.micro?.shellPulse ?? true,
    shellPulseDelta: userTweaks.micro?.shellPulseDelta ?? 1.2,
    shellPulseDurationMs: userTweaks.micro?.shellPulseDurationMs ?? 200,
  },

  // Labels (domain text along shells)
  labels: {
    enabled: userTweaks.labels?.enabled ?? false,
    mode: userTweaks.labels?.mode ?? 'ring',
    fontSize: (userTweaks.labels?.fontSize ?? 14) * userTweaks.atomScale,
    offsetPx: userTweaks.labels?.offsetPx ?? 16,
    idleOpacity: userTweaks.labels?.idleOpacity ?? 0.35,
    hoverOpacity: userTweaks.labels?.hoverOpacity ?? 0.7,
    repeat: userTweaks.labels?.repeat ?? 10,
    pattern: {
      offsetsPercentByShell: userTweaks.labels?.pattern?.offsetsPercentByShell ?? [0, 3.5, 7],
      repeatsByShell: userTweaks.labels?.pattern?.repeatsByShell ?? [6, 8, 12],
      densityPxPerRepeat: userTweaks.labels?.pattern?.densityPxPerRepeat ?? 26,
      minRepeats: userTweaks.labels?.pattern?.minRepeats ?? 3,
      maxRepeats: userTweaks.labels?.pattern?.maxRepeats ?? 40,
      separator: userTweaks.labels?.pattern?.separator ?? ' • '
    },
    rotate: {
      enabled: userTweaks.labels?.rotate?.enabled ?? false,
      respectReducedMotion: userTweaks.labels?.rotate?.respectReducedMotion ?? false,
      speedsByShell: userTweaks.labels?.rotate?.speedsByShell ?? [90, 110, 130]
    },
    mobileViewportMaxPx: userTweaks.labels?.mobileViewportMaxPx ?? 700,
    mobileArcDegrees: userTweaks.labels?.mobileArcDegrees ?? 150,
    wordOrbit: {
      innerOffsetPx: userTweaks.labels?.wordOrbit?.innerOffsetPx ?? 20,
      arcDegrees: userTweaks.labels?.wordOrbit?.arcDegrees ?? 160,
      centerAngleDeg: userTweaks.labels?.wordOrbit?.centerAngleDeg ?? -90
    }
  },

  // Display names for domains
  domainDisplayNames: userTweaks.domainDisplayNames || {},
  
  // Internationalization configuration
  i18n: userTweaks.i18n || {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    strings: { fr: {}, en: {} },
    meta: { fr: {}, en: {} }
  },
  // Dynamic shells generator parameters
  dynamicShells: {
    enabled: userTweaks.dynamicShells?.enabled ?? false,
    baseRadius: userTweaks.dynamicShells?.baseRadius ?? 120,
    baseGap: userTweaks.dynamicShells?.baseGap ?? 80,
    minGap: userTweaks.dynamicShells?.minGap ?? 56,
    maxGap: userTweaks.dynamicShells?.maxGap ?? 110,
    directionMode: userTweaks.dynamicShells?.directionMode ?? 'alternate',
    speed: {
      base: userTweaks.dynamicShells?.speed?.base ?? 9.0,
      deltaPerShell: userTweaks.dynamicShells?.speed?.deltaPerShell ?? 0.0
    }
  },

  // Electron preview card configuration
  electronPreview: {
    enabled: userTweaks.electronPreview?.enabled ?? true,
    width: userTweaks.electronPreview?.width ?? 320,
    height: userTweaks.electronPreview?.height ?? 120,
    offsetX: userTweaks.electronPreview?.offsetX ?? 20,
    offsetY: userTweaks.electronPreview?.offsetY ?? -20,
    borderRadius: userTweaks.electronPreview?.borderRadius ?? 8,
    heroSize: userTweaks.electronPreview?.heroSize ?? 88,
    heroRadius: userTweaks.electronPreview?.heroRadius ?? 8,
    heroMargin: userTweaks.electronPreview?.heroMargin ?? 16,
    contentPadding: userTweaks.electronPreview?.contentPadding ?? 16,
    titleSize: userTweaks.electronPreview?.titleSize ?? 16,
    subtitleSize: userTweaks.electronPreview?.subtitleSize ?? 13,
    animationDuration: userTweaks.electronPreview?.animationDuration ?? 0.2,
    animationEase: userTweaks.electronPreview?.animationEase ?? 'back.out(1.7)',
    multiStage: userTweaks.electronPreview?.multiStage ?? {
      stage1Duration: 0.3,
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

  // Bio skills UI (chip) parameters
  bentoSkillsUI: {
    boxMinHeight: userTweaks.bentoSkillsUI?.boxMinHeight ?? 48,
    padX: userTweaks.bentoSkillsUI?.padX ?? 18,
    padY: userTweaks.bentoSkillsUI?.padY ?? 12,
    fontSize: userTweaks.bentoSkillsUI?.fontSize ?? 15,
    logoSize: userTweaks.bentoSkillsUI?.logoSize ?? 18,
    gap: userTweaks.bentoSkillsUI?.gap ?? 12,
    borderRadius: userTweaks.bentoSkillsUI?.borderRadius ?? 10
  },

  // Bio text styling parameters
  bioText: {
    fontSize: userTweaks.bioText?.fontSize ?? 16,
    lineHeight: userTweaks.bioText?.lineHeight ?? 1.6,
    alignment: userTweaks.bioText?.alignment ?? 'center',
    justify: userTweaks.bioText?.justify ?? false,
    fontWeight: userTweaks.bioText?.fontWeight ?? 400
  },

  // Modern design system configuration
  modernDesign: {
    shadows: {
      card: userTweaks.modernDesign?.shadows?.card ?? '0 1px 3px rgba(0, 0, 0, 0.12)',
      cardHover: userTweaks.modernDesign?.shadows?.cardHover ?? '0 4px 20px rgba(0, 0, 0, 0.15)',
      subtle: userTweaks.modernDesign?.shadows?.subtle ?? '0 1px 3px rgba(0, 0, 0, 0.08)'
    },
    colors: {
      surfacePrimary: userTweaks.modernDesign?.colors?.surfacePrimary ?? '#ffffff',
      surfaceSecondary: userTweaks.modernDesign?.colors?.surfaceSecondary ?? '#f8fafc',
      surfaceTertiary: userTweaks.modernDesign?.colors?.surfaceTertiary ?? '#f1f5f9',
      textPrimary: userTweaks.modernDesign?.colors?.textPrimary ?? '#0f172a',
      textSecondary: userTweaks.modernDesign?.colors?.textSecondary ?? '#475569',
      textTertiary: userTweaks.modernDesign?.colors?.textTertiary ?? '#64748b',
      borderPrimary: userTweaks.modernDesign?.colors?.borderPrimary ?? '#e2e8f0',
      borderSecondary: userTweaks.modernDesign?.colors?.borderSecondary ?? '#cbd5e1',
      borderAccent: userTweaks.modernDesign?.colors?.borderAccent ?? '#475569'
    },
    transitions: {
      fast: userTweaks.modernDesign?.transitions?.fast ?? '0.15s ease',
      medium: userTweaks.modernDesign?.transitions?.medium ?? '0.3s ease',
      slow: userTweaks.modernDesign?.transitions?.slow ?? '0.5s ease'
    },
    skillGrid: {
      minCardWidth: userTweaks.modernDesign?.skillGrid?.minCardWidth ?? 140,
      gap: userTweaks.modernDesign?.skillGrid?.gap ?? 16,
      cardPadding: userTweaks.modernDesign?.skillGrid?.cardPadding ?? 16,
      hoverTransform: userTweaks.modernDesign?.skillGrid?.hoverTransform ?? 'translateY(-2px)',
      borderRadius: userTweaks.modernDesign?.skillGrid?.borderRadius ?? 12
    },
    socialLinks: {
      minTouchTarget: userTweaks.modernDesign?.socialLinks?.minTouchTarget ?? 44,
      iconSize: userTweaks.modernDesign?.socialLinks?.iconSize ?? 20,
      padding: userTweaks.modernDesign?.socialLinks?.padding ?? 12,
      gap: userTweaks.modernDesign?.socialLinks?.gap ?? 12
    }
  },

  // Bento gallery layout configuration
  bentoGallery: userTweaks.bentoGallery || {
    extraRow1DeltaPx: 500,
    extraRow2DeltaPx: 800,
    heroMinHeightFallback: 120,
    maxRows: 3
  },

  // Bio page layout configuration
  bioPageLayout: userTweaks.bioPageLayout || {
    topGapPx: 80
  },

  // Bento animations configuration
  bentoAnimations: userTweaks.bentoAnimations || {
    enabled: false,
    bpm: 120,
    musicalTiming: { beat: 500, eighth: 250, sixteenth: 125 },
    cardTypes: {},
    audio: { enabled: false, volume: 0.3 }
  },

  // Bento hero liquid glass configuration
  bentoGlass: userTweaks.bentoGlass || {
    enabled: true,
    blurPx: 16,
    saturatePct: 140,
    bgAlpha: 0.18,
    borderAlpha: 0.5,
    radiusPx: 16,
    paddingPx: 16,
    maxWidthPx: 640,
    shadow: '0 10px 30px rgba(0,0,0,0.15)',
    distortion: { enabled: true, edgeWidthPx: 16, baseFrequencyMin: 0.008, baseFrequencyMax: 0.010, numOctaves: 1, scale: 4, animate: true, durationSec: 16 }
  },

  // Atom interface sounds configuration
  atomSounds: userTweaks.atomSounds || {
    enabled: false,
    volume: 0.2,
    events: {},
    synthesis: {}
  },

  // Social sharing meta tags configuration
  socialMeta: userTweaks.socialMeta || {
    siteName: 'Arthur Kowskii Portfolio',
    siteUrl: 'https://arthur-portfolio.com',
    author: 'Arthur Kowskii',
    defaultDescription: 'Interactive portfolio showcasing music production, game audio design, and technical projects.',
    home: {},
    bio: {},
    project: {},
    images: {},
    twitter: {}
  },

  // Visited project indicators configuration
  visitedIndicators: {
    size: userTweaks.visitedIndicators?.size ?? 10,
    scale: userTweaks.visitedIndicators?.scale ?? 1.0,
    strokeWidth: userTweaks.visitedIndicators?.strokeWidth ?? 2,
    outline: userTweaks.visitedIndicators?.outline ?? true,
    colors: {
      background: userTweaks.visitedIndicators?.colors?.background ?? '#ffffff',
      border: userTweaks.visitedIndicators?.colors?.border ?? '#e5e5e5',
      checkmark: userTweaks.visitedIndicators?.colors?.checkmark ?? '#171717',
      borderDark: userTweaks.visitedIndicators?.colors?.borderDark ?? '#333333',
      checkmarkDark: userTweaks.visitedIndicators?.colors?.checkmarkDark ?? '#ffffff'
    },
    offset: {
      x: userTweaks.visitedIndicators?.offset?.x ?? 0.8,
      y: userTweaks.visitedIndicators?.offset?.y ?? -0.8
    },
    emergence: {
      enabled: userTweaks.visitedIndicators?.emergence?.enabled ?? true,
      duration: userTweaks.visitedIndicators?.emergence?.duration ?? 0.4,
      startScale: userTweaks.visitedIndicators?.emergence?.startScale ?? 0.3,
      easing: userTweaks.visitedIndicators?.emergence?.easing ?? 'back.out(1.7)',
      delay: userTweaks.visitedIndicators?.emergence?.delay ?? 0.1
    },
    filtering: {
      dimOpacity: userTweaks.visitedIndicators?.filtering?.dimOpacity ?? 0.25,
      animationDuration: userTweaks.visitedIndicators?.filtering?.animationDuration ?? 0.3
    },
    simple: userTweaks.visitedIndicators?.simple ?? true
  }
};
