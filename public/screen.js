import { notices, places } from './notices.js';
import { formatPilotTime, watchPilotFeed } from './pilot-feed.js';

const placeSelect = document.querySelector('#screen-place');
const formatSelect = document.querySelector('#screen-format');
const wallGuide = document.querySelector('#screen-wall-guide');
const portraitGuide = document.querySelector('#screen-portrait-guide');
const previous = document.querySelector('#screen-previous');
const next = document.querySelector('#screen-next');
const play = document.querySelector('#screen-play');
const fullscreen = document.querySelector('#screen-fullscreen');
const outage = document.querySelector('#screen-outage');
const workbench = document.querySelector('#screen-workbench');
const display = document.querySelector('#screen-display');
const announcement = document.querySelector('#screen-announcement');
const slide = document.querySelector('#screen-slide');
const meta = document.querySelector('#screen-meta');
const title = document.querySelector('#screen-title');
const summary = document.querySelector('#screen-summary');
const source = document.querySelector('#screen-source');
const sourceDetails = document.querySelector('#screen-source-details');
const sourceLink = document.querySelector('#screen-source-link');
const media = document.querySelector('#screen-media');
const image = document.querySelector('#screen-image');
const credit = document.querySelector('#screen-credit');
const empty = document.querySelector('#screen-empty');
const position = document.querySelector('#screen-position');
const status = document.querySelector('#screen-status');
const badge = document.querySelector('#screen-badge');
const cacheNote = document.querySelector('#screen-cache');
const touch = document.querySelector('#screen-touch');
const touchPrevious = document.querySelector('#touch-previous');
const touchNext = document.querySelector('#touch-next');
const island = document.querySelector('#screen-island');
const rotationMs = 12000;
const address = new URLSearchParams(window.location.search);
const isPilot = address.get('mode') === 'pilot';
const itemLabel = isPilot ? 'reviewed pilot' : 'sample';
const sampleLoadedAt = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Australia/Brisbane'
}).format(new Date());

let filtered = [];
let index = 0;
let rotation = null;
let outageDrill = false;
let feedState = isPilot ? 'loading' : 'ready';
let displayNotices = isPilot ? [] : notices;

function render() {
  const notice = filtered[index];
  slide.hidden = !notice;
  empty.hidden = Boolean(notice);
  position.hidden = !notice;
  previous.disabled = filtered.length < 2;
  next.disabled = filtered.length < 2;
  touchPrevious.disabled = previous.disabled;
  touchNext.disabled = next.disabled;
  play.disabled = filtered.length < 2;
  if (isPilot) badge.textContent = notice ? 'Reviewed pilot notice' : 'Reviewed pilot feed';

  if (!notice) {
    if (feedState === 'loading') empty.textContent = 'Checking the reviewed pilot feed…';
    else if (feedState === 'unavailable') empty.textContent = 'The reviewed pilot feed is unavailable. This screen will try again shortly.';
    else empty.textContent = `There are no current ${itemLabel} notices for this selection.`;
    return;
  }

  meta.textContent = `${notice.place} · ${notice.category}`;
  title.textContent = notice.title;
  summary.textContent = notice.summary;
  position.textContent = `${index + 1} of ${filtered.length}`;
  if (isPilot) {
    sourceDetails.textContent = `${notice.publisher} · Expires ${formatPilotTime(notice.expiresAt)} AEST`;
    sourceLink.href = notice.sourceUrl;
    source.hidden = false;
  }

  media.hidden = outageDrill || !notice.image;
  if (!media.hidden) {
    image.alt = notice.imageAlt || '';
    image.src = notice.image;
    credit.textContent = notice.credits || '';
    credit.hidden = !notice.credits;
  }
  island.href = `./island.html?${new URLSearchParams({ place: notice.place })}`;
}

function move(step) {
  if (filtered.length < 2) return;
  index = (index + step + filtered.length) % filtered.length;
  render();
}

function pauseRotation() {
  if (rotation === null) return;
  window.clearInterval(rotation);
  rotation = null;
  announcement.setAttribute('aria-live', 'polite');
  play.textContent = 'Start rotation';
  status.textContent = 'Rotation paused.';
}

function toggleRotation() {
  if (rotation !== null) {
    pauseRotation();
    return;
  }

  announcement.setAttribute('aria-live', 'off');
  play.textContent = 'Pause rotation';
  status.textContent = `Rotation playing. Each ${itemLabel} notice is shown for 12 seconds.`;
  rotation = window.setInterval(() => move(1), rotationMs);
}

function updateAddress() {
  const address = new URL(window.location.href);
  address.searchParams.delete('place');
  address.searchParams.delete('format');
  address.searchParams.delete('outage');
  if (!filtered.some(notice => notice.id === address.searchParams.get('notice'))) {
    address.searchParams.delete('notice');
  }
  if (placeSelect.value) address.searchParams.set('place', placeSelect.value);
  if (formatSelect.value === 'portrait') address.searchParams.set('format', 'portrait');
  if (outageDrill) address.searchParams.set('outage', '1');
  history.replaceState(null, '', address);
}

function updatePlace(initialNoticeId, pause = true) {
  const place = placeSelect.value;
  filtered = displayNotices.filter(notice => !place || notice.place === place);
  if (pause || filtered.length < 2) pauseRotation();
  index = Math.max(0, filtered.findIndex(notice => notice.id === initialNoticeId));
  render();
}

function updateFormat() {
  const isTouchscreen = formatSelect.value === 'portrait';
  display.classList.toggle('is-portrait', isTouchscreen);
  touch.hidden = !isTouchscreen;
  wallGuide.hidden = isTouchscreen;
  portraitGuide.hidden = !isTouchscreen;
  formatSelect.setAttribute('aria-describedby', isTouchscreen ? portraitGuide.id : wallGuide.id);
}

function setOutageDrill(enabled) {
  outageDrill = enabled;
  outage.setAttribute('aria-pressed', String(enabled));
  badge.textContent = enabled ? 'Outage drill · sample copy' : 'Sample notice';
  cacheNote.hidden = !enabled;
  cacheNote.textContent = enabled
    ? `Sample text loaded ${sampleLoadedAt} Queensland time. In an outage, a saved notice could be out of date.`
    : '';
  display.classList.toggle('is-outage', enabled);
  render();
}

function stepManually(direction) {
  pauseRotation();
  move(direction);
}

for (const place of places) {
  placeSelect.add(new Option(place, place));
}

const requestedPlace = address.get('place');
const requestedNotice = address.get('notice');
if (places.includes(requestedPlace)) placeSelect.value = requestedPlace;
if (address.get('format') === 'portrait') formatSelect.value = 'portrait';
placeSelect.disabled = false;
formatSelect.disabled = false;
outage.disabled = isPilot;
updatePlace(requestedNotice);
updateFormat();
if (isPilot) {
  document.title = 'Pilot screen | Straddie Noticeboard Network';
  document.querySelector('#screen-page-title').textContent = 'Pilot screen';
  document.querySelector('#screen-page-description').textContent = 'Show current reviewed notices from the Minjerribah pilot feed on a venue TV or touchscreen.';
  const boardLink = document.querySelector('#screen-board-link');
  boardLink.href = './board.html?mode=pilot';
  boardLink.textContent = 'Back to the reviewed pilot board';
  outage.hidden = true;
  document.querySelector('#screen-outage-guide').hidden = true;
  document.querySelector('#screen-pilot-guide').hidden = false;
  status.textContent = 'This screen refreshes from the reviewed pilot feed.';
  watchPilotFeed((state, currentNotices) => {
    const activeNotice = filtered[index]?.id || requestedNotice;
    feedState = state;
    displayNotices = currentNotices;
    updatePlace(activeNotice, false);
  });
} else if (address.get('outage') === '1') setOutageDrill(true);

placeSelect.addEventListener('change', () => {
  updatePlace();
  updateAddress();
});
formatSelect.addEventListener('change', () => {
  updateFormat();
  updateAddress();
});
outage.addEventListener('click', () => {
  setOutageDrill(!outageDrill);
  status.textContent = outageDrill ? 'Outage drill active. Displaying text from loaded samples.' : 'Outage drill ended.';
  updateAddress();
});
for (const button of [previous, touchPrevious]) button.addEventListener('click', () => stepManually(-1));
for (const button of [next, touchNext]) button.addEventListener('click', () => stepManually(1));
play.addEventListener('click', toggleRotation);
image.addEventListener('error', () => {
  media.hidden = true;
});

if (document.fullscreenEnabled && typeof workbench.requestFullscreen === 'function') {
  fullscreen.hidden = false;
  document.addEventListener('fullscreenchange', () => {
    fullscreen.textContent = document.fullscreenElement === workbench ? 'Exit full screen' : 'Full screen';
  });
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === workbench) {
        await document.exitFullscreen();
      } else {
        await workbench.requestFullscreen();
      }
    } catch {
      status.textContent = 'This browser could not open the full-screen preview.';
    }
  });
}
