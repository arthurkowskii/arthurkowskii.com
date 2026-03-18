- Status: Phase 4 complete. Stable motion/hover system; overlay and micro-interactions shipped; config-driven.
- CMS: Decap admin is local-only for now; choose production backend (git-gateway/GitHub) during deploy.

> [!IMPORTANT]
> **ALWAYS CHECK [`TODO.md`](./TODO.md) AT THE START OF EACH SESSION.**

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

### Press System Implementation (2025-08-31)
- **Press Card System**: Complete bio page press section with responsive grid layout
- **Content Schema**: Extended bio collection to support press articles with mixed URL/local image paths
- **Press Articles**: Added 4 press articles including Kowskii coverage from major publications
- **Image Management**: Proper static asset organization in public/images/press/ directory
- **Critical Bug Fix**: Fixed mobile detection false positives causing desktop Firefox overlay blocking

### Bilingual Content System Fix (2025-09-04)
- **Critical Bug Resolution**: Fixed `[object Object]` display issue throughout the portfolio
- **Root Cause**: ProjectBento components in home page overlays receiving raw bilingual objects instead of localized strings
- **Core Fixes Applied**:
  - Updated home page (`src/pages/index.astro`) to properly localize project data before passing to ProjectBento components
  - Fixed BioBento component to receive localized bio data instead of raw content
  - Created `localizedElectronsByDomain` for proper electron rendering with localized titles and descriptions
  - Fixed electron hover labels by updating data structure references (`project.data.domain` → `project.domain`)
  - Resolved initialization order issue preventing "Cannot access 'projectSummaries' before initialization" error
- **Defensive Systems**: Enhanced `getLocalizedContent()` function with robust fallback chains and object-to-string conversion safeguards
- **Testing Results**: 
  - Eliminated all `[object Object]` occurrences in HTML output
  - French/English locales working correctly for bilingual projects
  - Home page overlays displaying proper localized content
  - Dev server stable with no more `project.data.description.slice` errors
- **Backward Compatibility**: Projects not yet converted to bilingual format continue working normally
- **Infrastructure**: Bilingual content system now fully functional with server-side locale detection via URL parameters

### Comprehensive Bilingual Translation Fix (2025-09-08)
- **Translation System Recovery**: Restored accidentally deleted bilingual UI system that was showing both languages simultaneously
- **UI Translation Infrastructure**: Created `src/utils/translations.js` with centralized UI translations for header filters and domain labels
- **Complete Project Translations**: 
  - Converted all 3 Game Audio projects to full bilingual structure (heroes_showcase.md, fmod_showcase.md, chromestesia_showcase.md)
  - Added missing English translations to all Tech projects (yt_showcase.md, sg_showcase.md) including process steps and challenges
  - Fixed "free price" translations to proper "pay-what-you-want" across Music projects
  - Polished bio English translation for better phrasing
- **Translation Quality Audit**: Used french-english-web-translator agent to audit all translations and identify gaps
- **UI Enhancements**: 
  - Fixed language selection flag display issue on enter card
  - Replaced problematic Unicode flag emojis with custom PNG flag icons (france.png, united-kingdom.png)
  - Proper CSS styling for flag icons with responsive sizing
- **Results**: 
  - All content now has professional English equivalents maintaining marketing impact
  - Consistent technical terminology across Game Audio and Tech sections
  - Bilingual system fully functional with ?lang=fr and ?lang=en URL parameters
  - Complete coverage: 9 project files updated with comprehensive bilingual support

### Theme and Language Default Updates (2025-09-08 continued)
- **Critical YAML Fix**: Fixed YAML parsing errors in fmod_showcase.md caused by nested quotes around "INTERACTIVITY" parameter
- **Content Schema Validation**: Added missing bilingual content for challenge descriptions to resolve schema validation errors
- **Dark Mode Default**: Changed default theme from light to dark mode across all initialization points
  - Updated early theme detection script to default to dark
  - Modified main theme initialization logic 
  - Updated standalone toggle initial state
- **Welcome Card UX Refinements**: 
  - Initially implemented theme toggle (Light/Dark) matching language selection design
  - Removed theme toggle from welcome card for cleaner, focused UX
  - Maintained only language selection (FR/EN) for streamlined experience
- **French Language Enforcement**: Ensured French is always the default language for new visitors
  - Removed browser language auto-detection override
  - Fixed fallback logic to always default to French
  - Preserved user preference persistence for returning users
- **Development Stability**: Fixed development server startup issues and maintained clean build process

### Firefox Compatibility Fixes (2025-09-19)
- **Critical Script Loading Issues**: Resolved multiple variable declaration errors in Firefox caused by inline scripts
- **Root Cause**: ProjectBento script executed multiple times (once per bento project), causing redeclaration errors
- **Solutions Implemented**:
  - Added `is:inline` directive to ProjectBento script for global scope execution
  - Wrapped all variables (`__GLB`, `__audioUnlocked`, etc.) in window scope with existence checks
  - Converted ES module imports to dynamic imports for inline script compatibility
  - Implemented comprehensive initialization guards to prevent multiple declarations
- **ServiceWorker Video Fix**: Added bypass logic for video files to prevent streaming issues in Firefox
- **Results**: Full compatibility achieved across Firefox and Chrome browsers

### Portfolio Self-Documentation (2025-09-19)
- **Meta Project Page**: Created atom_portfolio.md showcasing the portfolio itself as a technical achievement
- **Personal Narrative**: Crafted bilingual content emphasizing personal journey and technical innovations
- **Key Highlights**:
  - Documented three major early-stage challenges: drag & drop physics, dynamic shell generation, circular overlay system
  - Created comprehensive project cards: stats, process, challenges, results
  - Established Atom_Assets folder structure for future hero and gallery images
- **Content Focus**: Emphasized design decisions (bento inspiration, minimalist electrons, accessibility features)

### Asset Optimization and Bilingual Support (2025-09-24)
- **Critical Bug Fixes**:
  - Fixed `ensureLightbox` redeclaration error causing startup failure by wrapping in typeof check
  - Resolved Git push error caused by Windows reserved filename `nul`
- **Bilingual System Enhancements**:
  - Fixed French translations: "Technology" → "Technologie", "Stats Projet" → "Infos Projet"
  - Added complete bilingual support for all bento card titles (actions, process, challenges)
  - Updated HR_showcase.md with missing French translations for Links, Process, Key Challenges sections
  - Extended bilingual support to sg_showcase.md and yt_showcase.md projects
- **Asset Optimization Campaign**:
  - **Images**: Converted PNG screenshots to WebP format with 85.8% size reduction (2.4MB → 340KB)
  - **Hero Video**: Optimized hero.mp4 with 94.2% reduction (5.4MB → 318KB) using H.264 CRF 23
  - **Thumbnail Generation**: Created thumbnail.jpg from hero.mp4 first frame for electron preview compatibility
  - **Web Optimization**: Applied faststart flag to videos for progressive download
- **Project Updates**:
  - Updated atom_portfolio.md stats: changed "91%" to "Astro / JS" for language stat
  - Maintained 10 projects count reflecting current portfolio state

### Audio Player Card System (2025-11-08)
- **Feature Implementation**: Complete custom audio player card for bento project pages
- **Library Integration**: Howler.js (7KB) for cross-browser audio playback with OGG/MP3/WAV format support
- **Content Schema Extension**:
  - Added `audio` object to bento cards schema in config.ts
  - Support for bilingual titles, track lists with metadata (title, artist, filename, duration)
  - Card toggle system: `cards.audio` boolean in project frontmatter
- **Component Architecture Evolution**:
  - **Initial Implementation**: Separate AudioCard.astro component with full playlist UI
  - **Complete Redesign**: Rebuilt inline in ProjectBento.astro following bento card patterns
  - **Design Direction**: Glassmorphic Premium - aligns with liquid glass aesthetic throughout portfolio
  - **Player Features**: Simplified controls (play/pause, prev/next), real-time progress bar, track display, bilingual UI
  - Location: [ProjectBento.astro:2421-2460](src/components/ProjectBento.astro#L2421-L2460) (HTML), [1086-1364](src/components/ProjectBento.astro#L1086-L1364) (CSS), [3093-3266](src/components/ProjectBento.astro#L3093-L3266) (JavaScript)
- **Design System**:
  - **Visual Hierarchy**: 72px play button (hero element), 48px skip buttons, gradient fills
  - **Micro-Interactions**: Glow effects on hover, pulsing ring animation when playing, progress bar expansion on hover (8px → 10px)
  - **Typography**: Uppercase heading with wide letter-spacing, Inter font stack, tabular nums for time display
  - **Color Strategy**: Accent color tints at 8-20% opacity, gradient progress fills, dual-layer shadows
  - **Accessibility**: `prefers-reduced-motion` support, ARIA labels, high contrast in both themes
- **Critical Slug Path Fix**:
  - Fixed slug propagation from content collections (full path `2_Game Audio/chromestesia_showcase`) to filename-only (`chromestesia_showcase`)
  - Updated [src/pages/projects/[slug].astro:257](src/pages/projects/[slug].astro#L257) to pass filename slug to ProjectBento
  - Updated [src/pages/index.astro:2450-2458](src/pages/index.astro#L2450-L2458) overlay system to extract filename from full path
- **Audio File Management**:
  - Local workflow: Audio files stored in `/public/audio/<ProjectFolder>/` (e.g., `/public/audio/Chromestesia/`)
  - Folder mapping system: `folderMap` object in JavaScript translates slugs to folder names
  - Git exclusions: `*.ogg`, `*.mp3`, `*.wav`, `/public/audio/` added to .gitignore
  - Browser handles URL encoding automatically for filenames with spaces
- **Configuration System**:
  - All 10 project files updated with `audio: false` default toggle
  - Chromestesia project configured as first implementation with 5 soundtrack files (.ogg format)
  - Bilingual track titles supporting French/English localization via `data-tracks` attribute
- **Known Patterns & Gotchas**:
  - Audio files NOT committed to git (too large, stored locally for dev, remote on production server)
  - ProjectSlug must be filename-only for folder mapping to work correctly
  - Overlay system and direct project URLs both require proper slug handling
  - **Content Collection Caching**: Astro caches content collections - manual track order/config changes require dev server restart
  - Song titles should NOT be translated - use original names in both FR/EN versions
  - **Session Cleanup Required**: Dev server must be killed and restarted at end of work sessions for cache clearing (see CLAUDE.md SESSION CLEANUP PROTOCOL)

## Current Status

✅ Production ready with enterprise-grade monitoring, security, and performance
✅ Complete UI design system with **dark mode as default**
✅ Asset optimization complete with 91% size reduction
✅ Social sharing system with French localization
✅ Advanced project filtering and interactive navigation
✅ Professional hover interactions across all components
✅ Comprehensive animation system with accessibility support
✅ Press card system with responsive design and content management
✅ Mobile detection system with cross-browser compatibility
✅ Bilingual content system with **French as guaranteed default language**
✅ Complete bilingual translation coverage with professional English content
✅ Streamlined welcome experience with focused language selection
✅ **Full Firefox compatibility** with proper script handling and video streaming
✅ **Portfolio self-documentation** with meta project page showcasing technical achievements
✅ **Comprehensive asset optimization** with 85-94% size reductions across images and videos
✅ **Complete bilingual support** for all bento cards with proper French translations
✅ **Audio player card system** with Howler.js integration, playlist support, and bilingual UI
✅ 2025-12-03: Sample Pad UI & Global Availability
  - **UI Refresh**: Replaced play/pause icon with a cleaner "instrument-style" design featuring LED indicators and larger typography
  - **Loading Animation**: Added visual pulse animation and 0.5s delay during sample regeneration for better feedback
  - **Global Fallback**: Implemented `DEFAULT_SAMPLER_CONFIG` in `ProjectBento.astro`
  - **Simplified Config**: Projects can now enable the sampler just by setting `sampler: true` in frontmatter; it automatically falls back to default samples (Chromestesia SFX) if no specific data is provided
✅ 2025-11-10: Sample Pad Card (MPC-inspired SFX sampler)
  - Added `cards.sampler` toggle + `sampler` config block (folder + samplePool) to `content/config.ts`
  - Introduced reusable sampler card in `ProjectBento.astro` with four fixed pads + regenerate control
  - Extended `audioPlayerClient.js` to manage sampler Howler instances, global stop hooks, random pad assignments, and click-to-refresh animation
  - First implementation wired to Chromestesia with `/audio/Chromestesia/SFX`; other projects can enable by specifying their sample folders
  - UI parity with audio player: glassmorphic styling, numbered pads, refresh button with spin animation + pad pulse feedback
✅ 2025-11-09: Audio engine refinements
  - Added configurable Howler/low-pass settings to `user-tweaks.js` + `atom.config.js` (volume, fade speed, low-pass frequency/Q, independent LPF fade duration)
  - Refactored audio card JS into dedicated `audioPlayerClient.js` module (shared by overlays + project pages; no inline imports)
  - Implemented graceful fade/low-pass on overlay close, navigation, and page unload via global `bento:audio:shutdown`
  - Ensured dev workflow restarts `npm run dev` each request to drop Astro caches + keep user previews accurate

✅ 2025-12-16: Kubika Sampler & Extended Kit (Wide Mode)
  - **Kubika Implementation**: Enabled Sampler card for Kubika project using 45 custom OGG assets in `/public/audio/Kubika/`
  - **Path Logic Fixes**:
    - Patched `ProjectBento.astro` inline script to correctly prepend `/audio/` to sampler paths
    - Corrected `chromestesia_showcase.md` to remove redundant path prefixes, resolving double-slash 404 errors
  - **Extended Kit (Plan 2)**:
    - Implemented smart "Wide Mode" for Sampler card when Audio card is disabled (`isWideSampler` logic)
    - Created `.sampler-card-wide` CSS variant spanning full width (columns 1-13)
    - Expanded functionality to support **8 pads** (4x2 grid) in Wide Mode, maximizing utility of the empty space
    - Maintained original 4-pad layout for standard configuration (e.g., Chromestesia)

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
- Bio system: skills with logo mapping, social links, modern card design, press articles with mixed image sources

## Performance & Optimization

- **Latest optimization results**: hero.mp4 94.2% reduction, screenshots 85.8% reduction (WebP conversion)
- 91% overall asset optimization: videos (H.264, CRF 23-28), images (WebP 75-88% quality)
- GSAP animations optimized for 60fps with Safari-specific enhancements
- Memory management: comprehensive cleanup, frame throttling
- Cross-browser compatibility: Chrome, Firefox, Safari tested
- Accessibility: prefers-reduced-motion support, focus-visible implementation

## Known Issues & Next Steps

- Dynamic shells testing across 1-5 domain configurations (low priority)
- Performance monitoring analysis and optimization opportunities (ongoing)
- **Next Session**: UI Sound Design implementation (using Howler.js for clicks, hovers, etc.)

### Layout & Responsive Fixes (2025-12-16)
- **Extended Sampler Kit (8 pads)**: Implemented 'Adaptive Stack' layout for mobile/tablet. Forces full-width container on small screens to prevent 'squashed' pads.
- **Results Card Layout Bug**: Fixed a persistent blank space on the right side of the Results card in the medium tablet breakpoint (900px-1199px). 
    - **Root Cause**: The grid was defined as 10 columns, but the card only spanned 7 columns (1 / 8), leaving 30% empty space. 
    - **Fix**: Updated grid-column span to '1 / 11' to fill the row.
    - **Hardening**: Added safety CSS (width: 100%, word-break: break-word) to internal list items.

### Sampler Volume Control (2025-12-17)
- **Feature Implementation**: Added per-project volume control for Sampler cards.
- **Config Update**: Extended `src/content/config.ts` to include optional `volume` number parameter in sampler schema.
- **Component Logic**: Updated `ProjectBento.astro` to pass volume data via `data-volume` attribute and apply it to Howler instances.
- **Volume Handling**: 
    - Default fallback: `0.7` (if not specified).
    - Range: `0.0` (mute) to `1.0+` (boost).
    - Hardening: Parsing checks to handle undefined/null values gracefully.
- **Verification**: Successfully tested muting Kubika sampler (`volume: 0.0`) and boosting Chromestesia (`volume: 1.5`).

### Sampler Volume Control (2025-12-17)
- **Feature Implementation**: Added per-project volume control for Sampler cards.
- **Config Update**: Extended `src/content/config.ts` to include optional `volume` number parameter in sampler schema.
- **Component Logic**: Updated `ProjectBento.astro` to pass volume data via `data-volume` attribute and apply it to Howler instances.
- **Volume Handling**: 
    - Default fallback: `0.7` (if not specified).
    - Range: `0.0` (mute) to `1.0+` (boost).
    - Hardening: Parsing checks to handle undefined/null values gracefully.
- **Verification**: Successfully tested muting Kubika sampler (`volume: 0.0`) and boosting Chromestesia (`volume: 1.5`).
### Build System & Dependency Resolution (2025-12-18)
- **Dependency Fix**: Resolved `MODULE_NOT_FOUND` error for `@rollup/rollup-win32-x64-msvc` by refreshing `node_modules`.
- **Validation Script Update**: Updated `scripts/validate-build.js` to correctly check for the PDF CV (`CV_ArthurCroqueboisKowskii.pdf`) instead of a deprecated `CV.jpg`.
- **Build Status**: Verified 100% clean build with zero warnings across 26 generated pages.

### Safari Compatibility Fix (2025-12-18)
- **Nucleus Logo Fix**: Resolved a Safari-specific rendering bug where the center logo failed to invert in dark mode.
- **Implementation**: 
    - Wrapped the SVG `<image>` in a `<g>` group tag to improve filter application consistency.
    - Added `-webkit-filter` support and `transform: translateZ(0)` to trigger hardware acceleration for filters.
    - Applied changes to both French and English versions.

### Audio Player & Tracklist Implementation (2025-12-18)
- **Wide Mode Implementation**: Enhanced `ProjectBento.astro` to support a full-width audio card when the sampler is disabled.
    - **Logic**: Added `isWideAudio` check (`cards.audio && !cards.sampler`).
    - **CSS**: Created `.audio-card-wide` variant with 2-column layout (player controls left, tracklist right).
- **Tracklist Feature**: Added scrollable tracklist for multi-track projects (e.g., Mouse Knight).
    - **UI**: Implemented modern, glassmorphic list items with hover effects and scrollbar styling.
    - **Interaction**: Added click handlers to play specific tracks directly from the list.
    - **State**: Active track highlighting synced with playback.
- **Bug Fix**: Reserved issues with audio player overlap by introducing `.audio-player-column` container with proper flex gap.
- **Bug Fix**: Resolved missing event listeners for tracklist items by injecting logic directly into the component's inline script.

### Final Refinements (2025-12-18)
- **Audio Link Fix**: Resolved 404 error for `mus_ThisCurseEndsWithYou` by checking for explicit file extensions in `ProjectBento.astro` and simplifying the filename to `mus_ThisCurse.mp3` in both the file system and markdown.
- **Dark Mode UI**: Implemented `accentColorDark` support for "Mouse Knight". Tuned the color to `#66bb6a` (Forest Light) to ensure optimal visibility and contrast in dark mode while maintaining the project's aesthetic identity.

### Sampler Layout Fix (2025-12-22)
- **Layout Bug Fix**: Decoupled `sampler-card-wide` CSS rule from `audio-card-wide`.
- **Result**: Sampler card now sizes naturally to its content in wide mode, eliminating excessive vertical whitespace while preserving the necessary height for the Audio Player's tracklist.

### Project Archiving (2025-12-18)
- **Archived FMOD Showcase**: Moved `fmod_showcase.md` and `Assets_FMOD` to a new root-level `Archive/` folder.
- **Reason**: Removed from active portfolio display while preserving source files and assets for reference.

### FMOD Boss Interactive Player (2026-02-21)
- **New Project**: Created `fmod_boss_showcase.md` — a live interactive FMOD demo embedded in the portfolio overlay.
- **FMOD Web API Integration**:
  - Added `fmod` card type to content schema (`config.ts`) with `folder`, `banks`, `events`, and `parameters` fields.
  - Full FMOD card UI + JS in `ProjectBento.astro`: loads `fmodstudio.wasm/.js` dynamically, initializes Studio system, streams banks into Emscripten virtual FS, and renders Play/Stop buttons + parameter sliders.
  - Lazy init via `IntersectionObserver` — FMOD only loads when the card enters the viewport, preventing AudioContext conflicts with Howler on other projects.
- **CSP Fix**: Added `blob:` to `script-src` in `index.astro` (FR + EN) to allow FMOD's AudioWorklet blob injection.
- **`locateFile` Fix**: Configured `window.FMOD.locateFile` before script injection to redirect `.wasm`/`.js` lookups to `/fmod/api/`, fixing `AbortError` from missing `document.currentScript` in dynamically injected scripts. `.aw.js` files excluded from redirection so FMOD handles them natively.
- **Parameter System**:
  - Sliders apply values to both `studioSystem` (global) and all active `EventInstance`s (local) simultaneously.
  - `ignoreSeekSpeed = true` on all `setParameterByName` calls — required for discrete parameters to respond immediately without interpolation delay.
  - Fixed name mismatch: `ismobKilled` → `is_MobKilled` to match exact FMOD Studio label.
- **Assets**: Bank files in `/public/fmod/FMOD-BOSS/`, Web API files in `/public/fmod/api/`. All excluded from git via `.gitignore`.
- **Lifecycle**: FMOD Studio system is cleanly released on overlay close / page unload via the existing `bento:audio:shutdown` custom event.

### FMOD Boss Interactive Game Mode (2026-03-17)
- **Interactive Game Mode**: Added `mode: "interactive-game"` option to FMOD cards for immersive boss battle demo experience.
- **UI Redesign**: Two-card battle arena layout (BOSS vs PLAYER) with yellow/orange health bars, prominent phase indicator, and 3 action buttons.
- **Simplified Controls**:
  - ⚔️ **Attack**: Reduces BOSS_HEALTH by 40 points directly
  - 🔥 **Special**: Toggle `isSpecial` parameter (0 ↔ 1) with visual ON/OFF state
  - 💀 **Kill Mob**: Toggle `is_mobKilled` parameter (0 ↔ 1) with visual Killed/Alive state
  - Removed: Defend button, automatic phase transitions, intro timer, special mode timer
- **Schema Extension**: Added `mode` and `introDuration` fields to FMOD config schema.
- **Code Cleanup**: Removed ~450 lines of legacy automatic phase logic, keeping only direct parameter control system.
- **Build Fix**: Resolved duplicate code issue causing JavaScript syntax errors.

### FMOD Action Buttons Fix (2026-03-17)
- **Issue**: Attack, Special, and Kill Mob buttons were clickable but didn't affect the audio.
- **Root Cause**: FMOD local parameters must be set on both `studioSystem` (global) AND `eventInstance` (local). Previous code only set parameters on `studioSystem`.
- **Fix Applied**:
  - Updated `updateHealthBars()` to set BOSS_HEALTH and PLAYER_HEALTH on all event instances
  - Updated "special" button handler to set isSpecial parameter on all event instances
  - Updated "killmob" button handler to set is_mobKilled parameter on all event instances
  - Updated Play button initial setup to set all parameters on the instance
  - Updated `resetGame()` to reset parameters on all event instances
  - Changed initial button state from disabled to enabled (`setButtonStates(true)`) so users can test parameters immediately
  - Updated status message to "Click buttons to test FMOD parameters"
- **Pattern**: All game mode parameter changes now follow the same pattern as standard slider mode: `studioSystem.setParameterByName()` + `eventInstances.forEach(instance => instance.setParameterByName())`.

### FMOD Interactive Demo Polish (2026-03-17)
- **Feature**: 26s Intro Countdown logic during which all action buttons are locked.
- **Feature**: 30s Special Mode Cooldown.
- **Bug Fix**: Polled `outfinal.val` instead of `outval.val` for `getParameterByName` to correctly detect direct audio-timeline value transitions before interpolation.
- **UI Logic**: Kill Mob button visibility changed from `display: none` to a visual `disabled` locked state, unlocking only when FMOD enters the Flash Mob phase (`is_MobKilled` = 0).
- **Cleanup**: Completely removed legacy Player Health card HTML and logic.

### FMOD Boss Frontend HUD Redesign (2026-03-18)
- **Schema + Content Extension**:
  - Extended `src/content/config.ts` FMOD schema with optional `images` fields (`boss`, `player`, `mob`).
  - Wired the FMOD boss showcase content to those images and served optimized public copies from `/public/fmod/FMOD-BOSS/images/`.
- **Scene Redesign**:
  - Replaced the old abstract FMOD boss card with an asset-driven arena inside `ProjectBento.astro`.
  - Phase copy now lives in a single full-width header block instead of split nested panels.
  - Boss, player, and Flash Mob visuals are now rendered directly in the stage using the imported cutout art.
- **HUD / Interaction Pass**:
  - Removed the separate boss/player health cards and moved health UI into the scene.
  - Added in-scene `Kill Player` testing control wired to `PLAYER_HEALTH = 0` on both the Studio system and all active event instances.
  - Boss health reveal now stays empty at event start, waits 14s, then fills over 4s before returning to normal live updates.
  - Reset, stop, and cleanup paths now cancel pending boss reveal timers/animations correctly.
- **Layout Iteration Notes**:
  - Simplified the top status area and removed redundant nested boxes.
  - Moved the boss health line back to the top of the stage and stripped the player HUD down to title + bar + `Kill Player`.
  - Rebalanced sprite scale/placement and responsive HUD positioning across desktop/tablet/mobile breakpoints.
- **Status**:
  - Functional state is now in much better shape and the FMOD encounter reads more like a game HUD.
  - The frontend still needs a **major visual polish pass** before it can be considered visually finished; current work should be treated as a strong structural base, not final art direction.

### FMOD Boss Card Simplification Pass (2026-03-18)
- **Direction Change**:
  - Simplified the FMOD interactive-game card into a flatter bento layout instead of a stacked HUD/dashboard.
  - Chosen polish direction: `Compact Command Header` + `Theme-Native Arena`.
  - Removed the separate engine-status block so the card reads as a portfolio item first and an interaction demo second.
- **Header / Hierarchy**:
  - Collapsed the top area into a shallow strip: badge + title on the left, compact phase chip and primary `Start Demo` CTA on the right.
  - Kept the long explanatory copy only in the lower controls dock to avoid duplicate messaging.
  - Reduced the overall vertical footprint so the scene begins higher on the card.
- **Theme Treatment**:
  - Reworked the scene tokens so the arena matches the active theme instead of staying permanently black.
  - Light mode now uses a warm neutral surface family; dark mode uses a deeper neutral version of the same family.
  - HUD chips, boss floor glow, and control cards were retuned to feel like overlays on the same surface system.
- **Controls / State**:
  - Simplified the secondary controls visually while keeping runtime behavior unchanged.
  - Remapped FMOD runtime status messages into the lower summary surface and removed dependencies on the old top status block.
  - Kept the phase indicator as a compact chip and preserved intro/live/attack/special/stop/reset flows.
- **Verification**:
  - `npm run build` passes after the simplification pass.
  - Verified FR and EN output on the direct project route.
  - Verified the homepage overlay rendering in both light and dark themes.
  - Confirmed the simplified card reads cleaner and more cohesive with the rest of the bento system.
