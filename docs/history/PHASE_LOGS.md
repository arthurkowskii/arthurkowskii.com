# Phase Logs — Atom Portfolio

This file keeps the detailed, long‑form history of phases, architecture notes, and working behavior. The main DEVELOPMENT_LOG.md is a short executive summary.

---

## Phase 3A — One‑Page Project Overlay + Micro‑Interactions (2025‑08‑20)

### Overlay (in‑page) MVP
- Click an electron to open a full‑page project overlay using a circular `clip-path` that expands from the electron’s position.
- No route change during the animation; the atom remains in place.
- Overlay content comes from a small client‑side payload from the content collection.
- Close via “×” or Escape; reverse animation collapses the mask back to the origin.
- URL updated with `pushState` while open; reset on close.

### Config knobs
- `overlayTransition.openMs`, `closeMs`, `easing` (GSAP ease) in `src/user-tweaks.js`, wired via `src/atom.config.js`.

### Micro‑interactions (optional)
- Hover ring around electrons.
- Ripple on click.
- Shell pulse at click.
- All controlled under `userTweaks.micro`.

### Files touched
- `src/pages/index.astro` — overlay markup + script (open/close logic).
- `src/user-tweaks.js` — overlay + micro config.
- `src/atom.config.js` — exposes overlay + micro to client.

---

## Phase 1–2D Recap (2025‑08‑19 and before)

### Phase 1: Foundation
- Astro app, GSAP integration, content collections, `atom.config.js` configuration layer.
- SVG atom scaffold with nucleus, shells, and generated electrons.

### Phase 2A: Motion System
- `OrbitSystem.js` handles smooth orbital motion using GSAP transforms.
- Alternating shell directions, randomized starts, 60fps‑oriented.

### Phase 2A+: User Tweaks System
- Central `user-tweaks.js` controls sizes/speeds; `atom.config.js` consumes them.
- Fixed hover values with Astro CSS vars; live refresh workflow.

### Phase 2B+: Random Positioning + Collision Avoidance
- Electrons positioned randomly per shell with min angular distance.
- Wrap‑around distance calculation; fallback if attempts exhausted.

### Phase 2C+: Modern Shell Hover
- Dual triggers (shell/electron) with transparency and coordinated behavior.
- Debounced events; cross‑browser GSAP attribute animations.

### Phase 2D+: Advanced Spotlight
- Global spotlight on electron hover; shell hover distinct from electron hover.
- Motion pause only on electron hover; refined state logic.

---

## Current Architecture (Recap)

```
atom-portfolio/
├── src/
│   ├── atom/
│   │   └── core/OrbitSystem.js      # Electron animation system
│   ├── content/
│   │   ├── config.ts                # Collections schema
│   │   └── projects/                # Markdown projects
│   ├── pages/
│   │   └── index.astro              # Main atom page + overlay
│   ├── atom.config.js               # Core config (uses userTweaks)
│   └── user-tweaks.js               # User‑tunable parameters
```

---

## What Works (Recap)
- Static nucleus/shell layout with dynamic, content‑driven electrons.
- Smooth orbital motion, alternating directions, random starts.
- Configurable shells/electrons; respects reduced motion.
- Random placement with min angular distance.
- Differentiated shell vs electron hover; spotlight + pause logic.

---

## TODO — Electron Progressive Reveal Rollout (Planned 3B)

- Extend the nucleus→bio progressive reveal transition to all electrons.
- Abstract a reusable circular-mask transition util that mounts content early.
- Preload target route/content to ensure paint during mask expansion (no post-anim flash).
- Keep Phase 3A history semantics (push on open, restore on close); respect reduced motion.
- Validate performance on low-end devices; ensure GSAP tweens are cleaned up between transitions.

---

## Follow‑Ups (Ideas)
- Domain accents + "chip continuity" header (electron → overlay pill).
- Soft edge/squircle mask; gooey tether during initial open.
- Optional deep‑link auto‑open and backdrop close behind flags.

---

## Phase 3C — Custom Audio System (Planned)

### Audio Architecture Evolution
Current: Tone.js placeholder synthesis (working, configurable)
Planned: Custom OGG audio files with Web Audio API

### Design Decisions (2025-08-22)
- **Format**: OGG Vorbis (excellent compression, modern browser support)
- **Fallback**: Safari compatibility via MP3 or silence on load failure
- **Loading**: Preload all sounds on page load (zero latency + future atom sound effects)
- **Mapping**: One audio file per card type (hero, stats, actions, tech, gallery, process, challenges, results)
- **Delivery**: Sound designer will provide folder + naming guide txt file

### Architecture Requirements
- Web Audio API buffer management system
- Preloading with progress indication
- Graceful fallback (silence) on load failure  
- Maintain current timing precision with scheduled playback
- Keep Tone.js as development placeholder until custom sounds ready

### Current Implementation Notes
- Tone.js code marked as placeholder throughout `ProjectBento.astro`
- All timing/sync architecture ready for file-based audio
- Configuration system supports both modes via `user-tweaks.js`

### Future File Structure
```
src/assets/audio/bento/
├── hero.ogg
├── stats.ogg  
├── actions.ogg
├── tech.ogg
├── gallery.ogg
├── process.ogg
├── challenges.ogg
└── results.ogg
```
