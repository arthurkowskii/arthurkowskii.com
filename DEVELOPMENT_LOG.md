# Atom Portfolio — Development Log (Concise)

**🤖 For Agents**: Start with `CLAUDE.md` for startup protocol, then `SESSION_CONTEXT.md` for current status.

Full details: `docs/history/PHASE_LOGS.md`, `docs/history/ERRORS_LESSONS.md`

Last updated: 2025-08-31 (Code spring cleaning + DEVELOPMENT_LOG optimization)

## Project Snapshot

- Purpose: Interactive "atom" portfolio. Nucleus + concentric shells. Electrons represent projects grouped by domain. Smooth orbital motion, rich hover states, and an in-page project overlay.
- Stack: Astro + GSAP (client only), Astro Content Collections (projects, bio), Decap CMS (admin; local proxy), SVG.
- Status: Phase 4 complete. Stable motion/hover system; overlay and micro-interactions shipped; config-driven.
- CMS: Decap admin is local-only for now; choose production backend (git-gateway/GitHub) during deploy.

## Quickstart

- Run: `npm install`, then `npm run dev` (opens at http://localhost:4324).
- Build/Preview: `npm run build`, then `npm run preview`.
- Admin CMS: visit `/admin` (Decap uses local proxy; production backend TBD).

## Key Files

- src/pages/index.astro: Main scene, overlay, event wiring, dynamic shell/viewport generator.
- src/atom/core/OrbitSystem.js: Electron orbital motion (GSAP transforms).
- src/atom/utils/electronPositioning.js: Random positions with min angular distance.
- src/atom.config.js: Client-safe config exported from user tweaks.
- src/user-tweaks.js: Central knobs (sizes, speeds, transitions, micro, labels, dynamicShells).
- src/content/config.ts: Content schema; folder-driven domains.
- src/components/ProjectBento.astro: Bento layout, gallery card grid + lightbox.

## How It Works

- Static geometry: Nucleus and shell rings are non-moving; electrons move via GSAP x/y transforms computed from angles.
- Domains → shells (dynamic): Top-level folders under `src/content/projects/` determine domains. Numeric prefixes (e.g., `1_Music`, `2_Sound-Design`) drive order; names are transformed to slugs (kebab) and display (UPPERCASE). Up to 5 shells are rendered (extras hidden).
- Random placement: Each electron gets a random angle with collision avoidance (min angular distance, wrap-around aware).
- Hover model: Two distinct systems coordinated by a single state source:
  - Shell hover: Opacity/thickness change only; motion continues.
  - Electron hover: Electron grows, global spotlight dims others, shell may accent, orbit pauses for that shell.
- Overlay: Clicking an electron opens a full-page circular masked overlay; pushes URL to /projects/:slug and restores on close.

## Configure Quickly (user-tweaks.js)

- atomScale, nucleusSize, nucleusHoverSize
- electronSpeeds.*, shellDistances.*, minElectronDistance
- overlayTransition.openMs|closeMs|easing (bio/nucleus)
- navTransition.enabled|inMs|outMs|easing|blockInput (electrons)
- dynamicShells.enabled|baseRadius|baseGap|directionMode|speed
- labels: mode (ringPattern|orbiting), fontSize, offsetPx, pattern settings
- micro.hoverCursorRing|ripple|shellPulse (toggles + durations/colors)
- bentoAnimations: enabled|staggerDelayMs|easing, cardEnabled toggles, audio settings
- electronPreview: enabled|width|height|offsetX|offsetY, multiStage animation settings
- bentoSkillsUI, bioText, modernDesign: UI styling parameters

## Content Authoring

- Structure: Organize projects under `src/content/projects/<order>_<DomainName>/project.md`.
- Order: `<order>_` numeric prefix controls shell order; max 5 shells.
- Display: `<DomainName>` is transformed to display (UPPERCASE) and slug (kebab-case).
- Project fields: title, description, tech[], link, github, status, date; useBentoLayout boolean.

## Bio Page

- Route: `/bio` via `src/pages/bio.astro` rendering `src/components/BioBento.astro`.
- Content: `src/content/bio/about.md` validated by `src/content/config.ts`.
- API: `GET /api/bio.json` returns bio data with safe defaults.
- Admin: Decap CMS at `/admin` using proxy backend for local editing.
- Style: Modern bento-style grid layout; portrait centered; logo-only skill displays.

## Debug Checklist

- Angles in degrees for OrbitSystem; convert to radians only for trig.
- Cross-browser: Firefox cannot CSS-animate SVG r; use GSAP attr for radius.
- Inline JSON: Inject with set:html; avoid HTML-escaped JSON that breaks JSON.parse.
- Lightbox CSS must be global (Astro style scoping won't reach dynamically injected DOM).
- Event flood: Use rAF throttling for mousemove; precompute squared distances.
- State: Keep single state machine; kill GSAP tweens on transitions to avoid buildup.
- Scope: Pass server-only values through atom.config.js; don't import userTweaks in client code.

## Recent Major Changes

### Phase 4 (2025-08-24/26): Enterprise-Grade Transformation
- Accessibility compliance & bug fixes (electron motion, focus-visible, bio overlay)
- Performance monitoring system with Core Web Vitals tracking
- CI/CD pipeline with GitHub Actions, security automation, performance budgets
- Service worker, PWA capabilities, enhanced security headers
- Comprehensive asset optimization (91% reduction: 177MB → 15MB)

### Enhanced Systems (2025-08-25/27)
- Header navigation with project filtering system
- Video card support (YouTube/Vimeo embeds)
- SoundCloud/Spotify card systems with positioning logic
- Hero video backgrounds with thumbnail support
- Advanced hover effects and 3D interaction system

### UI/UX Improvements (2025-08-28/29)
- Modern design system with sophisticated shadows and colors
- Bio page UI enhancement with professional skills grid
- Welcome overlay animation system with audio prewarming
- Visited project indicators with dragging synchronization
- French social sharing meta tags for target audience

### Recent Optimizations (2025-08-31)
- Code spring cleaning: removed 470+ lines, optimized comments
- Deleted unused components (BioBW, welcome page, backup files)
- Cleaned debug console statements while preserving production monitoring
- Token optimization for AI agents (~30-40% reduction)
- Mobile development message: French informational overlay for mobile users

## Current Status

✅ Production ready with enterprise-grade monitoring, security, and performance
✅ Complete UI design system with light/dark modes  
✅ Asset optimization complete with 91% size reduction
✅ Social sharing system with French localization
✅ Advanced project filtering and interactive navigation
✅ Professional hover interactions across all components
✅ Comprehensive animation system with accessibility support

## Technical Architecture Notes

- Welcome overlay: Inline overlay system with audio prewarming, no route changes
- Filtering: Domain-based with GSAP transitions, visual hierarchy management
- Overlay system: Circular clip-path with resize handling, dual overlay support
- Asset system: Auto-detection of hero/thumbnail files, video support
- Configuration chain: user-tweaks.js → atom.config.js → components
- Mobile detection: Multi-method detection (viewport, touch, user agent) with French message overlay

## Content Management

- Projects support both atomic and bento layouts via useBentoLayout flag
- Bento projects: assetsFolder auto-scanning, hero/logo detection, gallery population
- Music projects: musicLinks card system, SoundCloud/Spotify integration
- Video support: hero backgrounds, gallery integration, thumbnail fallbacks
- Bio system: skills with logo mapping, social links, modern card design

## Performance & Optimization

- 91% asset optimization: videos (H.264, CRF 23-28), images (WebP 75% quality)  
- GSAP animations optimized for 60fps with Safari-specific enhancements
- Memory management: comprehensive cleanup, frame throttling
- Cross-browser compatibility: Chrome, Firefox, Safari tested
- Accessibility: prefers-reduced-motion support, focus-visible implementation

## Known Issues & Next Steps

- Gallery slider design needs spacing/caption polish
- Production Decap backend selection needed for deployment
- Dynamic shells testing across 1-5 domain configurations
- Performance monitoring analysis and optimization opportunities