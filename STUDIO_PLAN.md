# Studio V2 Plan And Current State

Last updated: 2026-03-16
Status: In progress, implemented but not yet user-approved
Latest Studio commit: `e3d4d6a` (`Refine studio into page-first editor`)

## Purpose

This document centralizes the current Studio implementation state so future sessions do not depend on chat history alone. It records what has already been built, which files currently own the behavior, what has been verified, what is intentionally unchanged, and which UX issues are still open.

This should be read together with:

- `SESSION_CONTEXT.md`
- `DEVELOPMENT_LOG.md`
- `FRESH_AGENT_STUDIO_V2_HANDOFF.md`

## Timeline

### 2026-03-12: Studio V1

- Added local `/studio` project builder.
- Supported preset-based project creation.
- Saved directly to Markdown/frontmatter through Studio server endpoints.
- Used shared normalization utilities so new projects could appear on the homepage orbit without manual content wiring.

### 2026-03-13: Studio V2 Baseline Rebuild

- Replaced Studio V1 with a more structured Studio V2.
- Introduced:
  - `src/studio/studio-document.js`
  - `src/studio/studio-canvas.js`
  - `src/studio/studio-app.js`
- Normalized Studio load/save behavior around `__studio` APIs.
- Added published-preview parity work so editing could be compared against the public route.

### 2026-03-16: Save Hardening And Handoff Prep

- Fixed Studio serialization for blank action URLs.
- Repaired invalid test content that was breaking save/build flow.
- Added continuity artifacts for fresh agents and long Studio sessions.

### 2026-03-16: Preview-Backed / Page-First Reset

- Moved Studio away from an abstract mock canvas and onto the real preview iframe.
- Added editor-only hooks to `ProjectBento`.
- Reworked Studio into a page-first canvas with:
  - full-page iframe stage
  - floating corner menu
  - transient sheets for project/block settings
  - contextual insertion from inside the iframe
  - explicit Layout mode instead of always-on move/resize chrome

### 2026-03-16: Continuity Documentation

- Added the `DEVELOPMENT_LOG.md` entry for Studio documentation.
- Added this `STUDIO_PLAN.md` file to make the Studio state inspectable without replaying the full thread.

## Current Architecture

### Core Routes And Modules

- `src/pages/studio.astro`
- `src/studio/studio-app.js`
- `src/pages/studio/preview.astro`
- `src/components/ProjectBento.astro`
- `src/studio/studio-document.js`
- `src/studio/studio-canvas.js`
- `src/studio/server/project-files.js`
- `src/studio/server/preview-store.js`
- `src/utils/block-registry.js`

### Responsibilities

#### `src/pages/studio.astro`

Owns the Studio shell markup and global styles for the editor route.

Current shell direction:

- full-page stage
- design iframe and published preview iframe
- floating corner menu
- transient project settings sheet
- transient block settings sheet
- no permanent three-column shell
- no permanent top toolbar
- no permanent bottom dock

#### `src/studio/studio-app.js`

Owns the authoritative editor state in the parent page.

Current parent responsibilities:

- bootstrap/load current project and project list
- keep the Studio document in memory
- manage locale
- manage current mode (`canvas` vs `preview`)
- manage preview size (`desktop`, `tablet`, `mobile`)
- manage selected block
- manage active sheet
- manage menu state
- manage explicit `layoutMode`
- keep save/reload behavior and `__studio` APIs unchanged
- calculate and normalize placement through existing canvas utilities
- send design state into the iframe
- receive semantic editing events back from the iframe

Important parent state/bridge terms currently present in code:

- `studio:design-state`
- `studio:design-geometry`
- `studio:design-event`

#### `src/pages/studio/preview.astro`

Owns the iframe-side controller in `mode=design` and the clean non-editable rendering in `mode=preview`.

Current design-mode responsibilities:

- use the real `ProjectBento` rendering as the visible surface
- attach interaction behavior to `[data-studio-block]`
- attach text-edit hooks to `[data-studio-field]`
- post geometry back to the parent
- post semantic editing events back to the parent
- suppress normal published interactions while editing
- render contextual insertion controls in the iframe
- render layout handles only when Layout mode is active
- apply draft placement updates to the real card during layout interaction

#### `src/components/ProjectBento.astro`

Owns the actual published project-card rendering and the editor-only markers used by Studio.

Current editor-related responsibilities:

- supports `studioMode?: 'design' | 'preview'`
- emits stable `data-studio-block` markers
- emits stable `data-studio-field` markers on visible editable content
- keeps legacy/media cards as compact placeholders in design mode instead of full published embeds

#### `src/studio/studio-document.js`

Owns Studio document creation and normalization rules.

Important constraint:

- Studio document shape is intentionally preserved; current work should not rewrite the schema.

#### `src/studio/studio-canvas.js`

Owns the reusable placement/grid helpers.

Current role:

- still provides the placement math under the hood even though the visible editor is now page-first

#### `src/studio/server/project-files.js`

Owns Studio load/save normalization against project Markdown/frontmatter.

Important constraint:

- save pipeline should remain stable; current Studio work is not meant to rewrite project export contracts

## Current Editing Model

### Canvas Mode

The current direction is a page-first editing surface:

- the real project page is the primary visible surface
- the preview iframe is the source of truth for visible blocks
- the parent page should not render fake proxy blocks on top
- block selection should attach to real cards
- visible text editing should happen in place on real card content
- block insertion should come from contextual `+` affordances inside the page

### Published Preview Mode

- clean non-editable route preview
- same preview infrastructure
- no design chrome

### Layout Mode

- explicit secondary mode
- intended to isolate move/resize from normal content editing
- desktop-oriented because placement math is grid-based there
- should move/resize the real visible card, never a separate overlay block

## What Has Been Implemented

These items are the implemented direction to date and should be treated as the current baseline:

- Studio moved from a mock card canvas to a preview-backed iframe surface.
- `ProjectBento` exposes editor markers for blocks and visible fields.
- Parent and iframe communicate through a design bridge instead of independent render trees.
- Canvas mode was reset toward a page-first shell.
- Persistent top/bottom Studio chrome was removed from the main editing path.
- A floating corner control area exists for project/global actions.
- Project/block settings were moved into transient sheets instead of fixed sidebars.
- Contextual insertion was introduced inside the page surface.
- Layout controls were separated into an explicit Layout mode.
- Legacy/media blocks remain simplified placeholders in design mode.
- Save serialization was hardened for empty action URLs.

## Verified Behavior

These checks were already performed before this document was written:

- `/studio` loaded in a real browser.
- The page-first Studio shell loaded with the iframe stage.
- The floating menu opened.
- `Block Settings` sheet opened.
- Layout mode toggled separately from normal content editing.
- `Published Preview` removed editing controls.
- `/projects/etoilesenplastiques` returned `200`.
- `/` returned `200`.
- `npm run build` still failed only with the known Astro adapter issue (`NoAdapterInstalled`).

## Current UX State

Studio is no longer in the original three-column builder form, but it is also not yet considered finished.

Current state can be summarized as:

- architectural direction is established
- save/load contracts are stable
- iframe-backed editing bridge exists
- page-first shell exists
- user still finds the editing model confusing and not ready

## Known Open Problems

These issues remain important and should be treated as active follow-up work:

- move/resize is still not intuitive enough
- some editing affordances can still feel visually overlapping or messy
- alignment between controls and the visible card surface needs continued scrutiny
- the Studio experience still needs to feel closer to a Squarespace-style page editor
- the user wants the page itself to dominate, with only minimal visible controls

The latest user direction is to keep pushing toward:

- a full project-page editing feel
- minimal chrome
- contextual insertion first
- layout controls only when explicitly requested

## Constraints That Should Not Change Lightly

- Do not rewrite the Studio document schema.
- Do not rewrite the `__studio` bootstrap/read/save payload shapes unless there is a hard blocker.
- Do not break frontmatter export compatibility.
- Do not optimize only for `/projects/[slug]`; homepage overlay compatibility also matters.
- Do not reintroduce parent-layer fake proxy blocks as the main editing surface.

## File Ownership Map

Use this as the first-pass map when debugging or extending Studio:

- Shell/layout of the Studio route:
  - `src/pages/studio.astro`
- Parent-side editor state, save/load, mode toggles, selection, insertion, layout math:
  - `src/studio/studio-app.js`
- Iframe-side editor behavior and bridge wiring:
  - `src/pages/studio/preview.astro`
- Real project rendering and editor markers:
  - `src/components/ProjectBento.astro`
- Document creation/normalization:
  - `src/studio/studio-document.js`
- Placement/grid helpers:
  - `src/studio/studio-canvas.js`
- Save/load normalization:
  - `src/studio/server/project-files.js`
- Preview session store:
  - `src/studio/server/preview-store.js`
- Block capability/constraint metadata:
  - `src/utils/block-registry.js`

## Verification Rules For Future Sessions

Because Astro caches aggressively, future Studio work should keep following this order:

1. Stop the current dev server.
2. Restart `npm run dev` fresh.
3. Hard-refresh the browser.
4. Verify `/studio`.
5. Verify direct `/projects/[slug]`.
6. Verify the homepage overlay path still works.

When Studio changes touch rendering, layout, or block data, also check:

- selection behavior
- insertion behavior
- text editing
- layout mode behavior
- save/reload persistence

## Known Local Noise

These are known local issues/noise and should not automatically be treated as Studio regressions:

- Astro build currently fails with the known missing adapter error (`NoAdapterInstalled`).
- There has been local 404 noise for `/utils/monitoring.js`.
- There has been local 404 noise for `/audio/testtesttest/track-1.ogg`.
- There may be duplicate content-id/content warnings around `etoilesenplastiques`.
- Studio/browser sessions may show local favicon 404 noise.

## Dirty Workspace Notes

At the time this document was added, the worktree also contained unrelated existing changes outside this documentation task:

- `src/content/projects/3_tech/test_project.md` deleted
- `src/content/projects/3_tech/testtesttest.md` modified
- `FRESH_AGENT_STUDIO_V2_HANDOFF.md` untracked

Those should be treated carefully and not reverted casually.

## Recommended Reading Order For The Next Session

1. `AGENTS.md`
2. `SESSION_CONTEXT.md`
3. `DEVELOPMENT_LOG.md`
4. `STUDIO_PLAN.md`
5. `FRESH_AGENT_STUDIO_V2_HANDOFF.md`
6. `src/pages/studio.astro`
7. `src/studio/studio-app.js`
8. `src/pages/studio/preview.astro`
9. `src/components/ProjectBento.astro`

## Immediate Next Focus

The next meaningful Studio pass should prioritize clarity over feature breadth:

- simplify interaction discoverability
- keep the page surface calm
- reduce visual overlap between editing controls and content
- ensure move/resize only appears when explicitly needed
- make insertion and text editing feel obvious on first use
