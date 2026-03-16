# Studio V2 Fresh-Agent Handoff

Use this as the starting prompt for a fresh agent. Attach the current side-by-side screenshot pair from the handoff conversation when you send it.

## Ready-To-Paste Prompt

You are taking over the next phase of Studio V2 in `C:\Users\Arthur\Documents\GIT\Atom_Portfolio`.

Current baseline:
- Studio V2 exists and is working. Do not rebuild it from scratch.
- Improve the editing surface instead of changing the schema or redoing the save pipeline.
- The current baseline lives on branch `develop` at checkpoint `6c6c25f82e4d8f705671110c2c5ca254e30cabcc`, but the worktree is dirty.

Read these files first:
- `src/studio/studio-document.js`
- `src/studio/studio-canvas.js`
- `src/studio/studio-app.js`
- `src/studio/server/project-files.js`
- `src/pages/studio.astro`
- `src/components/ProjectBento.astro`
- `SESSION_CONTEXT.md`
- `DEVELOPMENT_LOG.md`

Locked product direction:
- Goal: turn Studio from a schematic block editor into a near-WYSIWYG design surface
- In scope: core blocks only for this pass (`hero`, `stats`, `actions`, `tech`, `process`, `gallery`, `challenges`, `results`)
- Out of scope: full fidelity for `audio`, `sampler`, `fmod`, `spotify`, `soundcloud`, `video`, and `musicLinks`
- Interaction model: common edits happen on the canvas; advanced edits stay in the inspector
- Visual rule: real-looking cards by default, editor chrome only on hover or selection
- Compatibility rule: no frontmatter/schema rewrite in this phase
- Verification rule: direct project pages and homepage overlay behavior must still work

Success criteria:
- Core cards on the Studio canvas look visually close to the published project page
- The canvas is understandable enough for layout/design work without constantly switching to Published Preview
- Always-visible chip clutter is reduced significantly
- Common content editing is canvas-first
- Inspector becomes secondary for advanced fields
- Save/load behavior remains unchanged
- Published preview still matches saved output
- Direct `/projects/[slug]` routes still render correctly
- Homepage overlay still renders correctly

Constraints:
- Restart `npm run dev` for every user request before reporting results
- Hard-refresh guidance must be given after the restart
- Verify overlay parity, not only direct project pages
- Do not introduce a new schema or change the Studio V2 document shape unless a concrete bug forces it
- Preserve current save compatibility with legacy published bento fields

Current dirty workspace state to preserve unless the user says otherwise:
- deleted: `src/content/projects/3_tech/test_project.md`
- modified: `src/content/projects/3_tech/testtesttest.md`

Known noise that is not the main Studio task:
- `npm run build` still fails because Astro needs a production adapter for server-rendered routes
- Local homepage may log `404 /utils/monitoring.js`
- Test content may request missing assets like `/audio/testtesttest/track-1.ogg`
- Recent logs showed a duplicate-id warning around `etoilesenplastiques`; verify it as a content-state issue if it appears again, but do not assume it is a Studio architecture bug

Important implementation context:
- Studio canvas visuals are currently simplified in `src/studio/studio-canvas.js`
- The real published visual language still lives in `src/components/ProjectBento.astro`
- The next pass should close that gap for core blocks without replacing the current save model
- The Studio page styling is global on purpose because the canvas DOM is injected dynamically

Deliverable expectation:
- Keep the current Studio V2 architecture
- Upgrade the editor into a near-parity design surface for core blocks
- Keep the repo in a state where a user can open `/studio`, design on the canvas, save, and still get correct published rendering

Manual handoff attachment:
- Attach the latest side-by-side screenshot pair showing the published project page next to Studio V2 and use it as the visual target
