# FMOD Interactive Demo - Phase 2: UI Overhaul & SVG Polish

## Context
We have an interactive FMOD audio demo built in Astro (`src/components/ProjectBento.astro`). The underlying JavaScript logic is now fully complete and stable: it correctly initializes the FMOD Web API, synchronizes state parameters (Boss Health, Special Mode, Mob Killed), and manages the intro countdown and special ability timers.

*DO NOT touch the JavaScript polling logic or the FMOD parameter sync code. It works perfectly.*

## Goal
Your task is entirely focused on upgrading the **Visual Aesthetics** and **UI/UX animations**. 
We need to remove the basic, separated "Cards" (BOSS vs PLAYER) and transform the entire `.fmod-game-mode` container into a premium, immersive **"Massive Arena Scene"** using SVG animations and glassmorphic / bento box styling.

## The Design Brief
1. **The Arena Layout**:
   - Merge the visual layout into one massive central scene (`.fmod-scene`).
   - The top should have an elegant phase indicator ("PHASE FLASH MOB").
   - Center area: A large Boss avatar (use high-quality SVGs).
   - Lower area (orbiting or below boss): 6 smaller Mob avatars (use high-quality SVGs).
   - Bottom area: A sleek, dashboard-like control panel containing the action buttons (Attack, Special, Kill Mob).

2. **The Graphics (SVG)**:
   - Create premium, detailed SVG shapes for the Boss and the Mobs directly inline or via CSS backgrounds. Do not rely on external `boss.png` files unless the user explicitly provides them.
   - The SVGs should match a "Retro-Futuristic Holographic" or sleek cyber aesthetic—vibrant glows, glowing eyes, sharp vector shapes.

3. **The Animations (CSS & GSAP)**:
   - **Idle State**: The Boss should have a subtle floating/breathing animation.
   - **Attack Impact**: When the `Attack` button is clicked, the Boss SVG should blink or flash red (`animation: damageFlash 0.3s`).
   - **Mob Spawning**: When the Flash Mob phase starts (`is_MobKilled` drops to 0), the 6 Mob SVGs should scale-in and fade-in dramatically around the Boss.
   - **Mob Death**: When the `Kill Mob` button is clicked (`is_MobKilled` returns to 1), the Mobs should explode or burst-fade out.
   - **Action Buttons**: Enhance the buttons to feel premium. The "Kill Mob" button should have an intense pulsing glow when it enters its "Unlocked" state (which is currently managed via `disabled` attribute removal).

## Instructions for the Agent
1. Review the existing HTML structure inside `ProjectBento.astro` under the `if (isFmodBossGame)` condition.
2. Rip out the basic `.fmod-battle-cards` layout and replace it with your newly designed `.fmod-scene` & `.fmod-dashboard`.
3. Keep all the `id=""` and `data-action=""` attributes exactly the same on the Action Buttons, Health Bars, and Status variables, as the JavaScript relies heavily on them to update the UI text and states.
4. Implement the CSS animations and SVG designs in the `<style>` block.
5. Provide a polished, "WOW" factor experience.

**Let's build a spectacular interactive audio experience!**
