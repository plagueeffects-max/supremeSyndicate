// iOS scroll-performance patch.
// Loaded deferred, in <head>, after lenis.min.js and ScrollTrigger.min.js
// but BEFORE main.js — so window.Lenis is replaced before main.js calls new Lenis().
(function () {
  var ua = navigator.userAgent;
  var isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  if (!isIOS) return;

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. REPLACE LENIS WITH A NATIVE STUB
  //
  // Lenis with syncTouch:false (the default) does NOT apply custom easing on
  // iOS touch — but its RAF loop still runs at 60 fps via the GSAP ticker,
  // reading scrollY, computing velocity, and emitting events every frame.
  // That JS overhead competes with iOS's compositor thread during scroll.
  //
  // More critically: if anything calls ScrollTrigger.normalizeScroll(true)
  // alongside Lenis, both fight over touchmove events and iOS loses its native
  // momentum scroll entirely. Replacing Lenis with this stub removes all of
  // that overhead while keeping the interface intact so main.js doesn't error.
  // ─────────────────────────────────────────────────────────────────────────────
  if (window.Lenis) {
    var NativeLenis = function () {
      this._handlers = [];
    };

    NativeLenis.prototype = {
      constructor: NativeLenis,

      // main.js calls lenis.raf(time) from gsap.ticker — make it a pure no-op.
      raf: function () {},

      // main.js calls lenis.on('scroll', ScrollTrigger.update).
      // Bridge those listeners to real window scroll events so ScrollTrigger
      // still fires. Pass a minimal Lenis-shaped object so destructuring in
      // main.js doesn't throw.
      on: function (event, fn) {
        if (event !== 'scroll') return;
        var wrapped = function () {
          var scrollY = window.scrollY || window.pageYOffset || 0;
          var maxScroll = Math.max(1,
            document.body.scrollHeight - window.innerHeight);
          fn({
            scroll: scrollY,
            velocity: 0,
            direction: scrollY > (this._lastY || 0) ? 1 : -1,
            progress: scrollY / maxScroll
          });
          this._lastY = scrollY;
        }.bind(this);
        this._handlers.push({ fn: fn, wrapped: wrapped });
        window.addEventListener('scroll', wrapped, { passive: true });
      },

      off: function (event, fn) {
        this._handlers = this._handlers.filter(function (h) {
          if (h.fn === fn) {
            window.removeEventListener('scroll', h.wrapped);
            return false;
          }
          return true;
        });
      },

      // Used by nav links and hamburger menu to smooth-scroll to sections.
      scrollTo: function (target, opts) {
        opts = opts || {};
        var behavior = opts.immediate ? 'auto' : 'smooth';
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: behavior });
        } else if (typeof target === 'string') {
          var el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: behavior, block: 'start' });
        } else if (target && target.scrollIntoView) {
          target.scrollIntoView({ behavior: behavior, block: 'start' });
        }
      },

      // Stubs for the rest of the Lenis API — main.js may call these.
      emit: function () {},
      destroy: function () {
        this._handlers.forEach(function (h) {
          window.removeEventListener('scroll', h.wrapped);
        });
        this._handlers = [];
      },
      stop: function () {},
      start: function () {},
      resize: function () {}
    };

    window.Lenis = NativeLenis;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. MANAGE CARD VIDEO PLAYBACK
  //
  // The four .hc-img videos are WebM/VP9. iOS has no hardware VP9 decoder — all
  // four decode in software simultaneously, burning CPU that the browser needs
  // for scroll compositing. Pause videos that aren't in the viewport.
  // ─────────────────────────────────────────────────────────────────────────────
  window.addEventListener('load', function () {
    var videos = document.querySelectorAll('.hc-img video');
    if (!videos.length || !window.IntersectionObserver) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.play && e.target.play().catch(function () {});
        } else {
          e.target.pause && e.target.pause();
        }
      });
    }, { threshold: 0.1 });

    videos.forEach(function (v) { io.observe(v); });
  });
})();
