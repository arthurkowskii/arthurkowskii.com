// Radial reveal helper for navigation transitions
// Creates a fixed overlay and animates a circular clipPath from a point

import { gsap } from 'gsap/all';

function maxCoverRadius(x, y, vw, vh) {
  const dx = Math.max(x, vw - x);
  const dy = Math.max(y, vh - y);
  return Math.hypot(dx, dy);
}

function createOverlayContainer(debug = false) {
  const el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.inset = '0';
  el.style.background = 'transparent';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '2147483000';
  if (debug) el.style.outline = '1px solid rgba(255,0,0,0.25)';
  document.body.appendChild(el);
  return el;
}

export async function radialRevealOut(opts) {
  const {
    x,
    y,
    duration = 450,
    easing = 'power2.inOut',
    navigateTo,
    background = '#000',
    blockInput = true,
    debug = false,
    respectReducedMotion = false,
    edgeSoftnessPx = 0,
  } = opts;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (respectReducedMotion && prefersReduced) {
    if (navigateTo) window.location.assign(navigateTo);
    return;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const R = maxCoverRadius(x, y, vw, vh);

  const overlay = createOverlayContainer(debug);
  if (blockInput) overlay.style.pointerEvents = 'auto';

  // Create expanding circle element (contrasting color to be visible)
  const circle = document.createElement('div');
  circle.style.position = 'absolute';
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.width = `${2 * R}px`;
  circle.style.height = `${2 * R}px`;
  circle.style.transform = 'translate(-50%, -50%) scale(0)';
  circle.style.transformOrigin = '50% 50%';
  circle.style.borderRadius = '50%';
  circle.style.background = background;
  if (edgeSoftnessPx > 0) {
    circle.style.filter = `blur(${edgeSoftnessPx}px)`;
  }
  circle.style.willChange = 'transform';
  overlay.appendChild(circle);

  let navigated = false;
  return new Promise((resolve) => {
    // Ensure first frames paint before animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const t0 = performance.now();
        gsap.to(circle, {
          scale: 1,
          duration: duration / 1000,
          ease: easing,
          onUpdate: function () {
            const p = this.progress();
            const elapsed = performance.now() - t0;
            const minOnScreen = 180; // ms minimum on-screen before navigating
            if (!navigated && p >= 0.85 && navigateTo && elapsed >= minOnScreen) {
              navigated = true;
              window.location.assign(navigateTo);
            }
          },
          onComplete: () => {
            try { overlay.remove(); } catch {}
            resolve();
          }
        });
      });
    });
  });
}

// Reverse: run on destination page (e.g., home) after navigation
// Creates a full overlay then shrinks to point (x,y) and removes
export function radialConcealIn(opts) {
  const {
    x,
    y,
    duration = 380,
    easing = 'power2.inOut',
    background = '#000',
    edgeSoftnessPx = 0,
    debug = false,
  } = opts;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const R = maxCoverRadius(x, y, vw, vh);
  const overlay = createOverlayContainer(debug);
  overlay.style.pointerEvents = 'none';

  const circle = document.createElement('div');
  circle.style.position = 'absolute';
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.width = `${2 * R}px`;
  circle.style.height = `${2 * R}px`;
  circle.style.transform = 'translate(-50%, -50%) scale(1)';
  circle.style.transformOrigin = '50% 50%';
  circle.style.borderRadius = '50%';
  circle.style.background = background;
  if (edgeSoftnessPx > 0) {
    circle.style.filter = `blur(${edgeSoftnessPx}px)`;
  }
  circle.style.willChange = 'transform';
  overlay.appendChild(circle);

  gsap.to(circle, {
    scale: 0,
    duration: duration / 1000,
    ease: easing,
    onComplete: () => {
      try { overlay.remove(); } catch {}
    }
  });
}
