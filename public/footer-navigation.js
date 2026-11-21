const mode = new URLSearchParams(window.location.search).get('mode') === 'pilot' ? 'pilot' : 'practice';
for (const sequence of document.querySelectorAll('[data-sequence-mode]')) {
  sequence.hidden = sequence.dataset.sequenceMode !== mode;
}

const topLink = document.querySelector('.page-top');
const topTarget = document.querySelector('#main h1') || document.querySelector('#main');
const footerControls = topLink.closest('.page-navigation');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let positionFrame = 0;

function positionTopLink() {
  positionFrame = 0;
  const threshold = Math.min(320, window.innerHeight * .55);
  const overlay = !topLink.hasAttribute('data-inline-top') && !document.fullscreenElement
    && document.documentElement.scrollHeight - window.innerHeight > threshold
    && window.scrollY > threshold && footerControls.getBoundingClientRect().top > window.innerHeight;
  topLink.classList.toggle('is-floating', overlay);
}

function schedulePosition() {
  if (!positionFrame) positionFrame = window.requestAnimationFrame(positionTopLink);
}

window.addEventListener('scroll', schedulePosition, { passive: true });
window.addEventListener('resize', schedulePosition);
window.addEventListener('load', schedulePosition);
document.addEventListener('fullscreenchange', positionTopLink);
positionTopLink();

topLink.addEventListener('click', (event) => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (!topTarget.hasAttribute('tabindex')) topTarget.setAttribute('tabindex', '-1');
  topTarget.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
