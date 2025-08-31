// Gallery lightbox component

import { gsap } from 'gsap';

class GalleryLightbox {
  constructor() {
    this.root = null;
    this.scrim = null;
    this.container = null;
    this.viewport = null;
    this.counter = null;
    this.btnPrev = null;
    this.btnNext = null;
    this.btnClose = null;
    this.items = [];
    this.index = 0;
    this.opened = false;
    this.lastActive = null;
    this.keyHandler = this.onKeyDown.bind(this);
    this.pointer = { active: false, x: 0, y: 0 };
  }

  ensureDom() {
    if (this.root) return;

    const root = document.createElement('div');
    root.className = 'glb-root';
    root.setAttribute('aria-hidden', 'true');

    const scrim = document.createElement('div');
    scrim.className = 'glb-scrim';
    scrim.addEventListener('click', () => this.close());

    const container = document.createElement('div');
    container.className = 'glb-container';
    container.setAttribute('role', 'dialog');
    container.setAttribute('aria-modal', 'true');
    container.setAttribute('aria-label', 'Gallery viewer');

    const btnClose = document.createElement('button');
    btnClose.className = 'glb-close';
    btnClose.setAttribute('aria-label', 'Close');
    btnClose.textContent = '×';
    btnClose.addEventListener('click', () => this.close());

    const btnPrev = document.createElement('button');
    btnPrev.className = 'glb-nav glb-prev';
    btnPrev.setAttribute('aria-label', 'Previous');
    btnPrev.textContent = '‹';
    btnPrev.addEventListener('click', () => this.prev());

    const btnNext = document.createElement('button');
    btnNext.className = 'glb-nav glb-next';
    btnNext.setAttribute('aria-label', 'Next');
    btnNext.textContent = '›';
    btnNext.addEventListener('click', () => this.next());

    const viewport = document.createElement('div');
    viewport.className = 'glb-viewport';

    const counter = document.createElement('div');
    counter.className = 'glb-counter';

    container.appendChild(btnClose);
    container.appendChild(btnPrev);
    container.appendChild(viewport);
    container.appendChild(btnNext);
    container.appendChild(counter);

    root.appendChild(scrim);
    root.appendChild(container);
    document.body.appendChild(root);

    // Swipe gestures
    const onPointerDown = (e) => {
      this.pointer.active = true;
      this.pointer.x = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      this.pointer.y = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    };
    const onPointerMove = (e) => {
      if (!this.pointer.active) return;
    };
    const onPointerUp = (e) => {
      if (!this.pointer.active) return;
      const x = e.clientX || (e.changedTouches && e.changedTouches[0]?.clientX) || 0;
      const dx = x - this.pointer.x;
      const threshold = Math.max(40, window.innerWidth * 0.05);
      if (dx > threshold) this.prev();
      else if (dx < -threshold) this.next();
      this.pointer.active = false;
    };
    viewport.addEventListener('mousedown', onPointerDown);
    viewport.addEventListener('mousemove', onPointerMove);
    viewport.addEventListener('mouseup', onPointerUp);
    viewport.addEventListener('mouseleave', onPointerUp);
    viewport.addEventListener('touchstart', onPointerDown, { passive: true });
    viewport.addEventListener('touchend', onPointerUp);

    this.root = root;
    this.scrim = scrim;
    this.container = container;
    this.viewport = viewport;
    this.counter = counter;
    this.btnPrev = btnPrev;
    this.btnNext = btnNext;
    this.btnClose = btnClose;
  }

  lockScroll() {
    document.documentElement.classList.add('glb-scroll-lock');
  }
  unlockScroll() {
    document.documentElement.classList.remove('glb-scroll-lock');
  }

  onKeyDown(e) {
    if (!this.opened) return;
    // Prevent overlay from handling Esc while lightbox is open
    if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.stopPropagation();
      e.preventDefault();
      this.prev();
      return;
    }
    if (e.key === 'ArrowRight') {
      e.stopPropagation();
      e.preventDefault();
      this.next();
      return;
    }
    if (e.key === 'Tab') {
      // Focus trap: loop within the container
      const focusables = this.container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  async open({ items, startIndex = 0, returnFocusTo } = {}) {
    this.ensureDom();
    if (!Array.isArray(items) || items.length === 0) return;
    this.items = items;
    this.index = Math.min(Math.max(0, startIndex), items.length - 1);
    this.lastActive = returnFocusTo || document.activeElement;

    this.root.style.display = 'block';
    this.root.setAttribute('aria-hidden', 'false');
    this.opened = true;
    this.lockScroll();

    // Initial render
    this.renderSlide(true);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      this.scrim.style.opacity = '1';
      this.container.style.opacity = '1';
      this.container.style.transform = 'none';
    } else {
      gsap.set([this.scrim, this.container], { clearProps: 'all' });
      gsap.fromTo(this.scrim, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
      gsap.fromTo(this.container, { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
    }

    // Focus management
    this.btnClose.focus({ preventScroll: true });
    document.addEventListener('keydown', this.keyHandler, true);
  }

  close() {
    if (!this.opened) return;
    this.opened = false;

    const done = () => {
      this.root.style.display = 'none';
      this.root.setAttribute('aria-hidden', 'true');
      this.unlockScroll();
      // Clear viewport to stop any playing videos
      this.viewport.innerHTML = '';
      // Restore focus
      try { this.lastActive?.focus({ preventScroll: true }); } catch {}
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.removeEventListener('keydown', this.keyHandler, true);

    if (prefersReduced) {
      done();
    } else {
      gsap.to(this.scrim, { opacity: 0, duration: 0.18, ease: 'power1.in' });
      gsap.to(this.container, { opacity: 0, y: 20, scale: 0.98, duration: 0.2, ease: 'power2.in', onComplete: done });
    }
  }

  updateCounter() {
    if (!this.counter) return;
    const total = this.items.length;
    this.counter.textContent = `${this.index + 1} / ${total}`;
  }

  renderSlide(initial = false) {
    const item = this.items[this.index];
    if (!item) return;

    // Pause any existing video in viewport
    const existingVideo = this.viewport.querySelector('video');
    try { existingVideo?.pause(); } catch {}

    const el = document.createElement(item.isVideo ? 'video' : 'img');
    if (item.isVideo) {
      el.src = item.src;
      el.controls = true;
      el.playsInline = true;
      el.preload = 'metadata';
      el.style.maxWidth = '100%';
      el.style.maxHeight = '100%';
    } else {
      el.alt = item.alt || '';
      el.src = item.src;
      el.decoding = 'async';
      el.loading = 'eager';
      el.style.maxWidth = '100%';
      el.style.maxHeight = '100%';
    }

    const nextIn = () => {
      // Preload neighbors (images only)
      const prev = this.items[this.index - 1];
      const next = this.items[this.index + 1];
      [prev, next].forEach(n => {
        if (n && !n.isVideo) {
          const img = new Image();
          img.src = n.src;
        }
      });
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (initial || prefersReduced) {
      this.viewport.innerHTML = '';
      this.viewport.appendChild(el);
      this.updateCounter();
      nextIn();
      return;
    }

    // Crossfade
    const old = this.viewport.firstElementChild;
    this.viewport.appendChild(el);
    gsap.set(el, { opacity: 0 });
    gsap.to(el, { opacity: 1, duration: 0.18, ease: 'power1.out' });
    if (old) {
      gsap.to(old, { opacity: 0, duration: 0.18, ease: 'power1.in', onComplete: () => { old.remove(); } });
    }
    this.updateCounter();
    nextIn();
  }

  next() {
    if (!this.items || this.items.length < 2) return;
    this.index = (this.index + 1) % this.items.length;
    this.renderSlide();
  }
  prev() {
    if (!this.items || this.items.length < 2) return;
    this.index = (this.index - 1 + this.items.length) % this.items.length;
    this.renderSlide();
  }
}

const instance = new GalleryLightbox();
export default instance;

