# Phase 3B — Electron Progressive Reveal Transition

Status: shipped
Owner: core
Created: 2025-08-21
Shipped: 2025-08-21

## Summary

Roll out the progressive reveal navigation (circular mask that lets the destination page paint during the animation) to all electron clicks, mirroring the current nucleus→bio experience.

## Rationale

- Prevents “flash after animation” by painting destination content early.
- Unifies navigation feel across nucleus and electrons.
- Keeps motion tasteful while respecting reduced-motion preferences.

## Scope

- Apply to electron→overlay/project navigation across the atom scene. (Done)
- Reuse/extend circular-mask logic for one-page overlay with GSAP-driven radius. (Done)
- Integrate with history semantics (push on open, restore on close). (Done)

Non-goals

- Redesigning overlay content or project data model.
- Changing external API contracts.

## Acceptance Criteria

- Clicking any electron triggers the circular reveal; destination starts rendering during expansion. (Met)
- Input blocked until ~85% of open; then enabled. (Met)
- Reduced motion: configurable respect via `navTransition.respectReducedMotion`; default true. (Met)
- No flicker; performs at 60fps on target hardware. (Met under local testing)
- GSAP tweens cleaned up on close; overlay removed/reset. (Met)

## Implementation Notes

- Overlay content paints during open: `.inner { opacity: 1; }` to avoid post-anim pop-in.
- Circular mask: clip-path + mask-image; `--r / --x / --y` driven by GSAP for cross-browser reliability.
- Soft edge (optional): `navTransition.edgeSoftnessPx` controls feathered edge via CSS mask; bio uses `overlayTransition.edgeSoftnessPx`.
- Input block: Pointer events disabled until progress ≥ 0.85; then re-enabled.
- History: `pushState` on open, `replaceState` on close; Escape/× close supported.
- Config: `user-tweaks.js` → `navTransition` (enabled, inMs, outMs, easing, respectReducedMotion, edgeSoftnessPx, blockInput).
- Reduced motion: honored when enabled; skip animations and open/close instantly.

## Tasks

- [x] Integrate circular mask open/close for electrons in `src/pages/index.astro` with GSAP.
- [x] Early paint: mount/populate overlay content before expansion.
- [x] Add `navTransition` config in `src/user-tweaks.js`; expose in `src/atom.config.js`.
- [x] Block input during early open; cleanup on complete/close.
- [x] Respect reduced motion (configurable).
- [x] Cross-browser sanity (Chrome, Firefox, Safari) locally.
- [x] Update `DEVELOPMENT_LOG.md` after ship.

## Risks / Mitigations

- Early paint race conditions → ensured content mounted prior to anim; mask progress thresholds.
- Event leakage during transition → pointer events blocked until ≥85% progress.
- GSAP tween buildup → tween cleanup on close; label/electron tweens paused/resumed appropriately.

## Follow-ups

- Optional: per-domain transition accents (color/edge) and chip continuity.
- Validate reduced-motion behavior in production; consider defaulting nucleus/electrons to same softness settings.

## Links

- Design/behavior: `docs/history/PHASE_LOGS.md` (TODO section for Phase 3B)
- Current helper: `src/atom/transition/radial.js`
