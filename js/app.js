/* ==========================================================================
   CV Builder — App Core
   Theme, navbar, GSAP animations, shared utilities
   ========================================================================== */

(function (global) {
  'use strict';

  /* ---------- Theme ---------- */
  const THEME_KEY = 'cvbuilder-theme';
  const Theme = {
    init() {
      const stored = localStorage.getItem(THEME_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
      this.updateToggle(theme);
      const btn = document.getElementById('themeToggle');
      if (btn) btn.addEventListener('click', () => this.toggle());
    },
    toggle() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      this.updateToggle(next);
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    },
    updateToggle(theme) {
      const btn = document.getElementById('themeToggle');
      if (!btn) return;
      const label = theme === 'dark'
        ? (global.CVI18n ? global.CVI18n.t('theme.switchToLight', 'Switch to light mode') : 'Switch to light mode')
        : (global.CVI18n ? global.CVI18n.t('theme.switchToDark', 'Switch to dark mode') : 'Switch to dark mode');
      btn.setAttribute('aria-label', label);
    }
  };

  /* ---------- Navbar ---------- */
  const Navbar = {
    init() {
      const nav = document.querySelector('.navbar');
      if (!nav) return;
      const onScroll = () => {
        if (window.scrollY > 8) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      // Mobile toggle
      const toggle = document.querySelector('.nav-toggle');
      const links = document.querySelector('.nav-links');
      if (toggle && links) {
        toggle.addEventListener('click', () => {
          links.classList.toggle('open');
          toggle.setAttribute('aria-expanded', links.classList.contains('open'));
        });
        // close on link click (mobile)
        links.addEventListener('click', e => {
          if (e.target.matches('.nav-link')) links.classList.remove('open');
        });
      }
    }
  };

  /* ---------- Toast ---------- */
  const Toast = {
    el: null,
    ensure() {
      if (this.el) return this.el;
      this.el = document.createElement('div');
      this.el.className = 'toast';
      this.el.setAttribute('role', 'status');
      this.el.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.el);
      return this.el;
    },
    show(message, duration = 2400) {
      const el = this.ensure();
      el.textContent = message;
      el.classList.add('show');
      clearTimeout(this._t);
      this._t = setTimeout(() => el.classList.remove('show'), duration);
    }
  };

  /* ---------- Data loader (cached) ---------- */
  const DataCache = {};
  async function loadJSON(path) {
    if (DataCache[path]) return DataCache[path];
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load ' + path);
    const data = await res.json();
    DataCache[path] = data;
    return data;
  }

  /* ---------- Icons (lucide-style inline SVG) ---------- */
  const Icons = {
    _cache: new Map(),
    get(name) {
      if (this._cache.has(name)) return this._cache.get(name);
      const map = {
        code: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        palette: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
        megaphone: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
        'trending-up': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
        file: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>',
        download: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        'arrow-right': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
        'menu-icon': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        sun: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
        moon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
        shield: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        layout: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
        target: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        zap: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        layers: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        mail: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
        phone: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
        globe: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/><path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/></svg>',
        star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        upload: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
        github: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>'
      };
      const svg = map[name] || '';
      this._cache.set(name, svg);
      return svg;
    }
  };

  /* ---------- Animations (GSAP) ---------- */
  const Motion = {
    reduceMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    hasGSAP() { return typeof gsap !== 'undefined'; },
    initHero() {
      if (this.reduceMotion() || !this.hasGSAP()) return;
      gsap.registerPlugin(ScrollTrigger);
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.6 })
        .from('.hero h1', { y: 30, opacity: 0, duration: 0.8 }, '-=0.3')
        .from('.hero .lead', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-cta .btn', { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .from('.hero-trust', { opacity: 0, duration: 0.5 }, '-=0.2')
        .from('.float-cv', {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power2.out'
        }, '-=0.6');

      // Floating idle animation
      gsap.to('.float-cv-1', { y: '+=12', duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 });
      gsap.to('.float-cv-2', { y: '+=10', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.8 });
      gsap.to('.float-cv-3', { y: '+=14', duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.0 });
    },
    /**
     * Reveal-on-scroll. Items stay visible by default — we only animate a subtle
     * entrance when they enter the viewport. This keeps the page accessible
     * without JS and renders correctly in any capture context.
     */
    initReveal(scope) {
      const root = scope || document;
      const reduce = this.reduceMotion();
      const gsapOK = this.hasGSAP();
      if (gsapOK) gsap.registerPlugin(ScrollTrigger);

      const groups = [
        { sel: '.section-head > *', y: 16, stagger: 0.06 },
        { sel: '.template-card', y: 20, stagger: 0.05 },
        { sel: '.category-card', y: 20, stagger: 0.05 },
        { sel: '.feature-card', y: 14, stagger: 0.05 },
        { sel: '.pricing-card', y: 20, stagger: 0.06 },
        { sel: '.step', y: 14, stagger: 0.05 }
      ];

      groups.forEach(({ sel, y, stagger }) => {
        const items = root.querySelectorAll(sel);
        if (!items.length) return;
        if (reduce || !gsapOK) return;

        // Use IntersectionObserver for reliability. Don't pre-hide — the
        // tween fromTo handles the entrance, so items stay visible if IO
        // never fires (e.g., capture contexts, very tall pages).
        const io = new IntersectionObserver(entries => {
          const visible = entries.filter(e => e.isIntersecting).map(e => e.target);
          if (!visible.length) return;
          gsap.fromTo(visible,
            { y, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger, ease: 'power3.out' }
          );
          visible.forEach(el => io.unobserve(el));
        }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });

        items.forEach(item => io.observe(item));
      });

      if (gsapOK) {
        setTimeout(() => ScrollTrigger.refresh(), 50);
      }
    },
    fadeIn(el) {
      if (this.reduceMotion() || !this.hasGSAP()) return;
      gsap.from(el, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' });
    }
  };

  /* ---------- Reveal on scroll fallback (if no GSAP) ---------- */
  function initFallbackReveal() {
    if (typeof gsap !== 'undefined') return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- Public API ---------- */
  const App = {
    Theme, Navbar, Toast, Motion, Icons, loadJSON,
    init() {
      Theme.init();
      Navbar.init();
      // Mark active link
      const path = location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-link').forEach(a => {
        if (a.getAttribute('href') === path) a.classList.add('active');
      });
      // Inject icon SVGs where data-icon
      document.querySelectorAll('[data-icon]').forEach(el => {
        const name = el.getAttribute('data-icon');
        el.innerHTML = Icons.get(name);
      });
      initFallbackReveal();
      // Re-apply theme label when language changes
      document.addEventListener('langchange', () => {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        Theme.updateToggle(theme);
      });
    }
  };

  global.CVApp = App;
  document.addEventListener('DOMContentLoaded', () => App.init());
})(window);
