# Development Log
# DO NOT DELETE THIS FILE
# This file tracks the active development history of the project.

To preserve AI context limits, ONLY keep the most recent month of logs here. Older logs go to archives.
Each entry MUST follow this strict 2-bullet structure (MAX 1 sentence per bullet):
## Session Log Format (Ultra-Compact)
## [YYYY-MM-DD] - [Task or Bug Name]
- **Action**: [What was done]
- **Bug/Lesson**: [The bug that occurred, how it was fixed, and the lesson for future AIs]

---------------------------------------

## [2025-08-24] - Phase 4: Enterprise-Grade Transformation
- **Action**: Implemented accessibility compliance, performance monitoring with Core Web Vitals, CI/CD pipeline with GitHub Actions, service worker/PWA capabilities, security headers, and comprehensive asset optimization (91% reduction: 177MB → 15MB).
- **Bug/Lesson**: N/A - feature implementation

## [2025-08-25] - Enhanced Systems
- **Action**: Added header navigation with project filtering, video card support (YouTube/Vimeo), SoundCloud/Spotify card systems, hero video backgrounds with thumbnails, and advanced 3D hover effects.
- **Bug/Lesson**: N/A - feature implementation

## [2025-08-28] - UI/UX Improvements
- **Action**: Implemented modern design system with sophisticated shadows/colors, bio page enhancements, welcome overlay with audio prewarming, visited project indicators, and French social sharing meta tags.
- **Bug/Lesson**: N/A - feature implementation

## [2025-08-31] - Recent Optimizations
- **Action**: Removed 470+ lines of dead code, deleted unused components (BioBW, welcome page, backups), cleaned debug console statements while preserving production monitoring, and optimized AI agent tokens.
- **Bug/Lesson**: N/A - code cleanup

## [2025-08-31] - Press Card System Implementation
- **Action**: Created press card system for bio page with responsive grid, extended content schema for mixed URL/local image paths, added 4 press articles, organized static assets in public/images/press/.
- **Bug/Lesson**: **Bug**: Fixed mobile detection false positives causing desktop Firefox overlay blocking - implemented proper user agent and feature detection checks.

## [2025-09-04] - Bilingual Content System Fix
- **Action**: Fixed [object Object] display issue by updating home page to localize project data before passing to ProjectBento, fixed BioBento to receive localized data, created localizedElectronsByDomain, fixed electron hover label data structure references, and resolved initialization order issues.
- **Bug/Lesson**: **Bug**: ProjectBento receiving raw bilingual objects instead of localized strings caused [object Object] to display. **Fix**: Implemented getLocalizedContent() with robust fallback chains and object-to-string conversion. **Lesson**: Always validate data structure passing between server and client components; defensive coding for object shape assumptions.

## [2025-09-08] - Comprehensive Bilingual Translation Fix
- **Action**: Restored deleted bilingual UI system, created src/utils/translations.js, converted all Game Audio projects to full bilingual, added English translations to Tech projects, fixed "free price" translations, polished bio English, fixed flag emoji display with custom PNG icons.
- **Bug/Lesson**: **Bug**: Nested quotes in YAML (fmod_showcase.md) caused parsing errors. **Fix**: Used proper YAML escaping. **Lesson**: Test content schema validation after content changes.

## [2025-09-08] - Theme and Language Default Updates
- **Action**: Changed dark mode to default, updated theme detection to default dark, removed theme toggle from welcome card for cleaner UX, enforced French as default language (removed browser auto-detection), preserved user preference persistence.
- **Bug/Lesson**: **Bug**: Browser language auto-detection was overriding French default. **Fix**: Removed auto-detection override, fixed fallback logic to always default to French. **Lesson**: Explicit default beats implicit detection for targeted audience.

## [2025-09-19] - Firefox Compatibility Fixes
- **Action**: Fixed inline script variable redeclaration errors, added is:inline directive, wrapped variables in window scope with existence checks, converted ES module imports to dynamic imports, added ServiceWorker video bypass.
- **Bug/Lesson**: **Bug**: Firefox failed with variable declaration errors because inline scripts executed multiple times causing redeclaration. **Fix**: Added typeof guards and window scope wrapping. **Lesson**: Inline scripts need defensive initialization guards; test in Firefox early.

## [2025-09-19] - Portfolio Self-Documentation
- **Action**: Created atom_portfolio.md meta project page showcasing portfolio as technical achievement with bilingual content, documented three major challenges (drag & drop, dynamic shells, circular overlay), created project cards with stats/process/challenges/results.
- **Bug/Lesson**: N/A - feature implementation

## [2025-09-24] - Asset Optimization and Bilingual Support
- **Action**: Fixed ensureLightbox redeclaration error, resolved Windows reserved filename 'nul' Git push error, added bilingual translations (Technologie, Infos Projet), converted PNG screenshots to WebP (85.8% reduction), optimized hero.mp4 (94.2% reduction), created thumbnail.jpg from video.
- **Bug/Lesson**: **Bug**: ensureLightbox caused startup failure due to redeclaration. **Fix**: Wrapped in typeof check. **Lesson**: Always use typeof guards for global function checks. **Bug**: Windows reserved filename 'nul' caused Git push failure. **Fix**: Renamed file.

## [2025-11-08] - Audio Player Card System
- **Action**: Implemented Howler.js-based audio player with cross-browser support, added audio object to bento schema, created glassmorphic premium design with 72px play button, real-time progress bar, playlist controls, fixed slug propagation from content collections to filename-only.
- **Bug/Lesson**: **Bug**: Slug propagated as full path (2_Game Audio/chromestesia_showcase) instead of filename. **Fix**: Updated slug extraction in overlay system and project pages to extract filename from full path. **Lesson**: Content collection slugs vs. file paths need explicit conversion.

## [2025-11-09] - Audio Engine Refinements
- **Action**: Added configurable Howler/low-pass settings to user-tweaks.js and atom.config.js, refactored audio JS into dedicated audioPlayerClient.js module, implemented graceful fade/low-pass on overlay close/navigation/unload via bento:audio:shutdown event.
- **Bug/Lesson**: N/A - feature enhancement

## [2025-11-10] - Sample Pad Card (MPC-inspired SFX Sampler)
- **Action**: Added cards.sampler toggle + sampler config to schema, created reusable sampler card with 4 fixed pads + regenerate, extended audioPlayerClient.js with Howler instances, global stop hooks, random pad assignments.
- **Bug/Lesson**: N/A - feature implementation

## [2025-12-03] - Sample Pad UI & Global Availability
- **Action**: Replaced play/pause icon with instrument-style design (LED indicators), added visual pulse animation during sample regeneration, implemented DEFAULT_SAMPLER_CONFIG fallback, simplified config to just sampler: true in frontmatter.
- **Bug/Lesson**: N/A - UI refinement

## [2025-12-16] - Kubika Sampler & Extended Kit (Wide Mode)
- **Action**: Enabled Sampler for Kubika project with 45 custom OGG assets, implemented smart Wide Mode for Sampler when Audio disabled (8-pad grid vs 4-pad), created .sampler-card-wide CSS variant.
- **Bug/Lesson**: **Bug**: Double-slash 404 errors in audio paths. **Fix**: Removed redundant path prefixes in chromestesia_showcase.md. **Lesson**: Path concatenation needs normalization.

## [2025-12-16] - Layout & Responsive Fixes
- **Action**: Implemented Adaptive Stack layout for mobile/tablet (full-width container), fixed Results card layout bug (grid span 7 → 10 columns to fill 30% empty space), added safety CSS (width: 100%, word-break: break-word).
- **Bug/Lesson**: **Bug**: Results card had blank space on right side at 900px-1199px breakpoint. **Fix**: Updated grid-column span from '1 / 8' to '1 / 11'. **Lesson**: Test grid layouts at all breakpoints; empty space often indicates column span mismatch.

## [2025-12-17] - Sampler Volume Control
- **Action**: Added per-project volume control (0.0 mute to 1.0+ boost, default 0.7), extended config.ts with optional volume parameter, updated ProjectBento to pass volume via data-volume attribute to Howler instances.
- **Bug/Lesson**: N/A - feature enhancement

## [2025-12-18] - Build System & Dependency Resolution
- **Action**: Resolved MODULE_NOT_FOUND for @rollup/rollup-win32-x64-msvc by refreshing node_modules, updated validate-build.js to check for CV_ArthurCroqueboisKowskii.pdf, verified clean build with zero warnings.
- **Bug/Lesson**: **Bug**: MODULE_NOT_FOUND error on Windows. **Fix**: Refreshed node_modules. **Lesson**: Platform-specific native modules can fail; npm ci or node_modules refresh resolves.

## [2025-12-18] - Safari Compatibility Fix
- **Action**: Wrapped SVG image in group tag for filter consistency, added -webkit-filter and transform: translateZ(0) for hardware acceleration, applied to both FR/EN versions.
- **Bug/Lesson**: **Bug**: Center logo failed to invert in dark mode on Safari. **Fix**: Group wrapper + webkit-filter + GPU acceleration. **Lesson**: SVG filters need explicit -webkit prefixes and GPU triggers for Safari.

## [2025-12-18] - Audio Player & Tracklist Implementation
- **Action**: Implemented Wide Mode for audio card (2-column layout when sampler disabled), added scrollable tracklist with glassmorphic items, click-to-play functionality, active track highlighting, fixed overlap issues with audio-player-column container.
- **Bug/Lesson**: **Bug**: Event listeners missing on tracklist items. **Fix**: Injected logic directly into component's inline script. **Lesson**: Dynamically added DOM elements need event delegation or inline handlers.

## [2025-12-18] - Final Refinements
- **Action**: Fixed audio file 404 (mus_ThisCurseEndsWithYou → mus_ThisCurse.mp3), implemented accentColorDark support (#66bb6a Forest Light for Mouse Knight).
- **Bug/Lesson**: **Bug**: 404 error for audio file with long name. **Fix**: Shortened filename in both filesystem and markdown. **Lesson**: Check file extensions explicitly in path logic; shorter filenames avoid URL encoding issues.

## [2025-12-22] - Sampler Layout Fix
- **Action**: Decoupled sampler-card-wide CSS from audio-card-wide, allowing natural sizing for Sampler in wide mode.
- **Bug/Lesson**: **Bug**: Sampler card had excessive vertical whitespace in wide mode due to coupling with Audio card styles. **Fix**: Decoupled CSS rules. **Lesson**: Component variants need independent styling hooks, not shared dependencies.

## [2025-12-18] - Project Archiving
- **Action**: Moved fmod_showcase.md and Assets_FMOD to Archive/ folder, removed from active portfolio.
- **Bug/Lesson**: N/A - maintenance

## [2026-02-21] - FMOD Boss Interactive Player
- **Action**: Created fmod_boss_showcase.md with live FMOD demo, added FMOD card type to schema, implemented dynamic FMOD Web API loading with IntersectionObserver lazy init, added blob: to CSP script-src, configured locateFile for wasm/js redirection, implemented parameter sliders with ignoreSeekSpeed, fixed FMOD parameter name mismatch (ismobKilled → is_MobKilled).
- **Bug/Lesson**: **Bug**: FMOD AbortError from missing document.currentScript in dynamically injected scripts. **Fix**: Configured locateFile before script injection to redirect to /fmod/api/. **Bug**: FMOD parameters not responding to slider. **Fix**: Set ignoreSeekSpeed=true for discrete parameters. **Lesson**: Dynamic script loading needs pre-configuration before injection; FMOD parameters need explicit seek speed flags.

## [2026-03-12] - Local Project Studio v1
- **Action**: Added a local `/studio` builder with preset creation, direct Markdown/frontmatter save APIs, shared block/orbit normalization utilities, and deterministic homepage electron placement so new projects can be created and appear on the atom without hand-coding new files.
- **Bug/Lesson**: **Bug**: Studio-generated YAML let implicit scalars turn `bento.stats[].value` into a number and `date` into an invalid empty string. **Fix**: Added save-time normalization and safer YAML serialization in `src/studio/server/project-files.js`. **Lesson**: Builder output must be schema-valid before Astro content reloads, and YAML implicit typing should never be trusted.

## [2026-03-13] - Studio V2 Baseline Rebuild
- **Action**: Replaced `/studio` with a Studio V2 builder built around `studio-document`, `studio-canvas`, `studio-app`, normalized server load/save APIs, and published-preview parity.
- **Bug/Lesson**: **Bug**: Dynamic canvas cards initially missed their route CSS because the DOM was injected after Astro style scoping. **Fix**: Switched the Studio route styles to global so canvas cards and resize handles receive the intended styling. **Lesson**: Dynamically injected editor surfaces cannot rely on scoped route CSS unless the styling strategy is designed for it.

## [2026-03-16] - Studio V2 Save Hardening And Fresh-Agent Handoff
- **Action**: Fixed Studio save serialization for empty action URLs, repaired invalid test content, and added fresh-agent continuity artifacts plus a ready-to-paste Studio V2 handoff prompt.
- **Bug/Lesson**: **Bug**: `bento.actions.primary.url` was being omitted when blank, which broke the content collection schema on save. **Fix**: Studio export and frontmatter normalization now preserve required action URLs as empty strings. **Lesson**: Legacy mirror fields must remain schema-valid even when Studio treats a value as visually optional.

## [2026-03-16] - Studio V2 Page-First Canvas Reset
- **Action**: Reworked `/studio` into a page-first editor with a floating corner menu, transient project/block sheets, iframe-native contextual `+` insertion, and an explicit Layout mode instead of permanent shell chrome.
- **Bug/Lesson**: **Bug**: Persistent bars and rail-based move controls made the preview-backed canvas harder to understand than the published page. **Fix**: Moved editing affordances onto the real iframe surface and hid layout controls behind a dedicated mode. **Lesson**: For visual builders, the default state must read like the final page, not like editor scaffolding.
