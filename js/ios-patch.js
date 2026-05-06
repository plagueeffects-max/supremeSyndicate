// iOS / Safari scroll-performance patch.
// Loaded deferred in <head> after ScrollTrigger.min.js and before main.js,
// so normalizeScroll is active before any ScrollTriggers are created.
(function () {
  var ua = navigator.userAgent;
  var isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

  if (!isIOS) return;

  // ScrollTrigger.normalizeScroll makes GSAP poll scroll position via RAF instead
  // of relying on native iOS scroll events, which fire irregularly during momentum
  // scrolling. This is safe with Lenis when syncTouch is false (the default) because
  // Lenis does not intercept native touch scroll on iOS.
  if (window.ScrollTrigger) {
    ScrollTrigger.normalizeScroll(true);
  }
})();
