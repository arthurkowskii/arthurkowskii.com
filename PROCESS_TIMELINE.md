# Atom Portfolio — Development Timeline

## Overview

This document traces the development of the Atom Portfolio from its initial concept to the current production-ready state. It highlights major milestones, breakthroughs, and paradigm shifts rather than every individual change.

---

## Phase 1: Foundation (Early Development)

### The Atom Metaphor — First Iteration
- **Commit**: First commits from Linux
- **Breakthrough**: Abandoned traditional portfolio layout in favor of an interactive atomic model where projects orbit a central nucleus
- **Key Technical Challenge**: Implementing GSAP-driven electron orbital motion with collision avoidance for random positioning
- **Core Files**: `OrbitSystem.js`, `electronPositioning.js`

### Nucleus and Shell Architecture
- **Milestone**: Central nucleus wired to `/Bio` route
- **Milestone**: Domain name labeling on shells (first visual naming iteration)
- **Milestone**: Drag-and-drop electrons feature
- **Milestone**: Dynamic scaling for the overall atom

### Bio Page Evolution
- **Bio page first iteration** → **Bio page V0.1** → **New Bio bento layout V1**
- Transition from text-heavy bio to bento-style grid layout with portrait, skills, and social links

---

## Phase 2: Bento Template System

### Bento Architecture Breakthrough
- **Commit**: `bento template V1 for projects`
- **Breakthrough**: Created a modular card-based layout system where each project could define its own card composition (hero, gallery, audio, links, etc.)
- **Key Files**: `ProjectBento.astro`, `content/config.ts`
- **Schema Evolution**: Projects gained `useBentoLayout` flag and `cards` configuration object

### Bento Feature Expansion
- Hero image scaling
- Gallery auto-layout with slider v1
- Hero video backgrounds with thumbnail support
- SoundCloud/Spotify integration (video and spotify card added)
- Music links card
- Results card with adaptive width

---

## Phase 3: Visual Design System

### Liquid Glass UI
- **Commit**: `liquid glass v1` → `liquid glass v2`
- **Breakthrough**: Sophisticated glassmorphic design language applied consistently across all components
- **Milestone**: Code spring cleanup — removed 470+ lines while improving functionality

### Dark Mode / Light Mode
- **Dark mode V1** implemented as primary theme
- Later refined with **modern design system** with sophisticated shadows and colors
- Theme toggle always visible in header
- **2025-09-08**: Dark mode set as guaranteed default; French enforced as default language

### Hover & Interaction Systems
- Game-like hitbox system for shell interactions
- Electron hover improvements with spotlight dimming
- Focus mode with improved readability
- Hover state transitions between electron and shell
- Micro-interactions: cursor ring, ripple effects, shell pulse

---

## Phase 4: Audio Engine Evolution

### First Sound Implementation
- **Commit**: First iteration of sound with tone.js (synced has to be fixed)
- **tone.js placeholder** for home atom
- **tone.js removed** and replaced with custom solution

### Howler.js Integration
- **Commit**: Integrated audio player implemented
- **Milestone**: Audio player redesign v0.2 with improved auto layout
- **Breakthrough**: Cross-browser audio with OGG/MP3/WAV format support
- **Location**: `audioPlayerClient.js` — shared module for overlays and project pages

### Audio Player Cards
- **2025-11-08**: Complete custom audio player card with glassmorphic design
- **2025-12-18**: Wide mode implementation for full-width audio cards
- Tracklist feature with clickable tracks
- Low-pass fade on overlay close/navigation

### Sampler / MPC System
- **2025-11-10**: Sample Pad Card (MPC-inspired SFX sampler) with 4 pads
- **2025-12-16**: Kubika Sampler with 45 custom OGG assets
- **Wide Mode**: Extended to 8 pads (4x2 grid) when audio card disabled
- **Per-project volume control** with configurable gain

---

## Phase 5: Content Management & CMS

### Decap CMS Integration
- **Admin at `/admin`** using local proxy backend
- Bio content managed via `src/content/bio/about.md`
- Project content via content collections with folder-driven domains
- Schema: `title`, `description`, `tech[]`, `link`, `github`, `status`, `date`, `useBentoLayout`

### Image & Gallery System
- Gallery slider v1 → gallery layout improved
- Auto wide mode for sampler card
- Hero video backgrounds with thumbnail fallbacks
- WebP optimization campaign (85.8% size reduction)
- Press card system with responsive grid

---

## Phase 6: Internationalization

### Bilingual Content System
- **Complete French/English bilingual system** implemented
- URL parameter-based locale detection (`?lang=fr`, `?lang=en`)
- Server-side locale handling
- All 9+ project files converted to bilingual structure

### UI Translation Infrastructure
- **2025-09-08**: Critical bug fix — resolved `[object Object]` display issue
- **2025-09-08**: Comprehensive translation audit and fix
- `src/utils/translations.js` for centralized UI translations
- French enforced as default language for new visitors

---

## Phase 7: Performance & Polish

### Asset Optimization Campaign
- **Commit**: `91% faster loading, DAMN`
- **hero.mp4**: 94.2% reduction (5.4MB → 318KB)
- **Screenshots**: 85.8% reduction (2.4MB → 340KB via WebP)
- **Overall**: 91% asset reduction (177MB → 15MB)
- H.264 CRF 23 video encoding with faststart flag

### Cross-Browser Compatibility
- **2025-09-19**: Firefox compatibility fixes for inline scripts
- Service worker video bypass for Firefox
- Safari-specific nucleus logo filter fixes
- High contrast support in both themes

### Accessibility
- `prefers-reduced-motion` support throughout
- Focus-visible implementation
- ARIA labels on interactive elements
- Health reading content in FMOD boss HUD

---

## Phase 8: Enterprise Features

### Phase 4 — Enterprise-Grade Transformation
- **Accessibility compliance** audit and fixes
- **Performance monitoring** with Core Web Vitals tracking
- **CI/CD pipeline** with GitHub Actions
- **Security automation** and enhanced security headers
- **Service worker** and PWA capabilities

### Press System
- Press card system with responsive grid
- Content schema extended for press articles
- Mixed URL/local image path support
- 4 press articles from major publications

---

## Phase 9: FMOD Integration

### FMOD Web API Integration
- **2026-02-21**: FMOD Boss Interactive Player created
- **Schema Extension**: `fmod` card type with `folder`, `banks`, `events`, `parameters` fields
- **Technical Implementation**: 
  - Dynamic `fmodstudio.wasm/.js` loading
  - Emscripten virtual filesystem for bank streaming
  - Lazy init via IntersectionObserver
  - `locateFile` configuration for asset paths

### Interactive Game Mode
- **2026-03-17**: Interactive Game Mode with `mode: "interactive-game"`
- Two-card battle arena (BOSS vs PLAYER)
- Health bars with phase-based boss reveals
- Action buttons: Attack, Special, Kill Mob
- 26s intro countdown with locked controls
- 30s special mode cooldown

### FMOD Frontend Polish
- **2026-03-18**: HUD redesign with scene art assets
- Compact Command Header + Theme-Native Arena layout
- Boss, player, and Flash Mob cutout art
- In-scene health UI and testing controls
- Light/dark theme adaptation

### FMOD Simplification Pass
- Flatter bento layout instead of stacked HUD
- Phase chip and compact CTA
- Simplified controls dock
- Theme-aware arena surfaces

---

## Current State

- **Production-ready** with enterprise monitoring, security, and performance
- **Complete UI design system** with dark mode default
- **Comprehensive bilingual support** (French/English)
- **Cross-browser compatible** (Chrome, Firefox, Safari)
- **Audio system** with Howler.js (player, sampler, FMOD)
- **CMS integration** with Decap at `/admin`
- **Self-documenting** portfolio (atom_portfolio.md showcases the project itself)

---

## Key Breakthroughs Summary

| # | Breakthrough | Impact |
|---|--------------|--------|
| 1 | Atomic metaphor for portfolio navigation | Unique, memorable UX |
| 2 | Bento template system | Modular, maintainable project pages |
| 3 | GSAP-driven orbital mechanics | Smooth 60fps electron animation |
| 4 | Howler.js cross-browser audio | Reliable audio across all browsers |
| 5 | Liquid glass design language | Cohesive premium aesthetic |
| 6 | Bilingual content schema | Accessible to French/English audiences |
| 7 | FMOD WebAssembly integration | Interactive audio demos in browser |
| 8 | 91% asset optimization | Fast loading despite rich media |
| 9 | PWA/service worker infrastructure | Offline capability, app-like feel |
| 10 | Phase 4 enterprise hardening | Production-ready reliability |
