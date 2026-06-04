// Logo letter tilt: letters rotate toward the cursor when it's near the logo.
// Skips touch devices and respects prefers-reduced-motion.

(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var header = document.getElementById('header');
  var logo = document.getElementById('logo');
  if (!header || !logo) return;

  var paths = Array.prototype.slice.call(logo.querySelectorAll('path'));
  var letters = paths.slice(1); // skip the tilde stroke
  if (!letters.length) return;

  var PROXIMITY_PX = 40;
  var MAX_TILT_DEG = 4;
  var FALLOFF_PX = 120;

  var centers = [];
  var logoBox = null;
  var pending = false;
  var lastEvent = null;

  function measure() {
    logoBox = logo.getBoundingClientRect();
    centers = letters.map(function (letter) {
      var b = letter.getBoundingClientRect();
      // transform-box: fill-box (set in CSS) makes the path's own bbox the
      // coordinate space, so 50% 50% pivots from the letter's own center.
      letter.style.transformOrigin = '50% 50%';
      return b.left + b.width / 2;
    });
  }

  function neutralize() {
    letters.forEach(function (letter) {
      letter.style.setProperty('--tilt', '0deg');
    });
  }

  function apply(event) {
    if (!logoBox) measure();
    var x = event.clientX;
    var y = event.clientY;
    var withinX = x >= logoBox.left - PROXIMITY_PX && x <= logoBox.right + PROXIMITY_PX;
    var withinY = y >= logoBox.top - PROXIMITY_PX && y <= logoBox.bottom + PROXIMITY_PX;
    if (!withinX || !withinY) {
      neutralize();
      return;
    }
    letters.forEach(function (letter, i) {
      var dx = x - centers[i];
      var t = Math.max(-1, Math.min(1, dx / FALLOFF_PX));
      letter.style.setProperty('--tilt', (t * MAX_TILT_DEG).toFixed(2) + 'deg');
    });
  }

  function onMove(event) {
    lastEvent = event;
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      apply(lastEvent);
    });
  }

  header.addEventListener('pointermove', onMove);
  header.addEventListener('pointerleave', neutralize);
  window.addEventListener('resize', function () { logoBox = null; measure(); });
  window.addEventListener('scroll', function () { logoBox = null; }, { passive: true });

  measure();
})();
