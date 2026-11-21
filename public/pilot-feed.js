import { categories, noticeOutlets, notices as practiceNotices, places } from './notices.js';

export const pilotZone = 'minjerribah';
const feedUrl = new URL('./data/pilot-notices.json', import.meta.url);
const practiceIds = new Set(practiceNotices.map((notice) => notice.id));
const approvedFields = [
  'id', 'status', 'title', 'publisher', 'place', 'category', 'summary', 'sourceUrl', 'reviewedBy', 'reviewedAt', 'startsAt', 'expiresAt', 'outlets',
];
const refreshDelay = 60_000;
const requestLimit = 8_000;

function requireValid(condition, message) {
  if (!condition) throw new Error(message);
}

function hasAllowedFields(record, fields) {
  return record && typeof record === 'object' && !Array.isArray(record)
    && Object.keys(record).every((field) => fields.includes(field));
}

function validText(value, limit) {
  return typeof value === 'string' && value === value.trim() && value.length > 0 && value.length <= limit;
}

function validSource(value) {
  if (!validText(value, 2048) || !value.startsWith('https://')) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function timestamp(value) {
  if (typeof value !== 'string') return NaN;
  const parts = /^(\d{4})-(\d{2})-(\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:(?:0\d|1[0-3]):[0-5]\d|14:00))$/.exec(value);
  if (!parts) return NaN;

  const [, year, month, day] = parts.map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return NaN;
  return Date.parse(value);
}

export function validatePilotFeed(feed) {
  requireValid(hasAllowedFields(feed, ['schema', 'zone', 'notices']) && feed.schema === 'notice-feed.v1'
    && feed.zone === pilotZone && Array.isArray(feed.notices), 'Expected the notice-feed.v1 Minjerribah feed.');

  const ids = new Set();
  for (const [index, record] of feed.notices.entries()) {
    const row = `Notice ${index + 1}`;
    requireValid(record && typeof record.id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)
      && record.id.length <= 80 && !ids.has(record.id) && !practiceIds.has(record.id), `${row} needs a unique public ID distinct from practice notices.`);
    ids.add(record.id);

    if (record.status === 'withdrawn') {
      requireValid(hasAllowedFields(record, ['id', 'status']), `${row} must remove all details of a withdrawn notice.`);
      continue;
    }

    requireValid(hasAllowedFields(record, approvedFields) && record.status === 'approved', `${row} needs approved status and supported fields.`);
    requireValid(validText(record.title, 100) && validText(record.publisher, 100) && validText(record.summary, 600)
      && validText(record.reviewedBy, 100), `${row} needs a title, publisher, summary and public reviewer credit or role.`);
    requireValid(places.includes(record.place) && categories.includes(record.category), `${row} has an unknown place or category.`);
    requireValid(validSource(record.sourceUrl), `${row} needs a public HTTPS source without embedded credentials.`);
    if ('outlets' in record) {
      const { outlets } = record;
      requireValid(Array.isArray(outlets) && outlets.length > 0 && outlets.length <= noticeOutlets.length
        && new Set(outlets).size === outlets.length && outlets.every(outlet => noticeOutlets.includes(outlet)),
      `${row} needs a nonempty list of distinct outlets chosen from ${noticeOutlets.join(', ')}.`);
    }

    const reviewed = timestamp(record.reviewedAt);
    const expiry = timestamp(record.expiresAt);
    requireValid(Number.isFinite(reviewed) && Number.isFinite(expiry) && reviewed < expiry
      && (record.startsAt === undefined || (Number.isFinite(timestamp(record.startsAt)) && timestamp(record.startsAt) < expiry)),
    `${row} needs valid ISO timestamps including time zones and an expiry after review and any optional start.`);
  }
  return feed;
}

export function pilotNoticesAt(feed, now) {
  return feed.notices.filter((notice) => notice.status === 'approved'
    && Date.parse(notice.reviewedAt) <= now
    && (!notice.startsAt || Date.parse(notice.startsAt) <= now)
    && now < Date.parse(notice.expiresAt));
}

export function nextPilotChangeAfter(feed, now) {
  let next = Infinity;
  for (const notice of feed.notices) {
    if (notice.status !== 'approved') continue;
    const start = Math.max(Date.parse(notice.reviewedAt), notice.startsAt ? Date.parse(notice.startsAt) : -Infinity);
    const expiry = Date.parse(notice.expiresAt);
    if (start > now) next = Math.min(next, start);
    if (expiry > now) next = Math.min(next, expiry);
  }
  return next;
}

export function formatPilotTime(value) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Australia/Brisbane',
  }).format(new Date(value));
}

export function watchPilotFeed(onView) {
  let previousView = '';
  let boundaryTimer;

  function sendView(state, notices) {
    const key = JSON.stringify({ state, notices });
    if (previousView === key) return;
    previousView = key;
    onView(state, notices);
  }

  function showCurrent(feed) {
    const now = Date.now();
    sendView('ready', pilotNoticesAt(feed, now));
    const next = nextPilotChangeAfter(feed, now);
    if (Number.isFinite(next)) {
      boundaryTimer = window.setTimeout(() => showCurrent(feed), Math.min(next - now, 2_147_483_647));
    }
  }

  async function refresh() {
    const network = new AbortController();
    const timeout = window.setTimeout(() => network.abort(), requestLimit);
    let feed;
    try {
      const response = await fetch(feedUrl, { cache: 'no-store', redirect: 'error', signal: network.signal });
      if (!response.ok) throw new Error('Could not load the reviewed notice file.');
      feed = validatePilotFeed(await response.json());
    } catch {
      feed = null;
    } finally {
      window.clearTimeout(timeout);
    }

    window.clearTimeout(boundaryTimer);
    if (feed) showCurrent(feed);
    else sendView('unavailable', []);
    window.setTimeout(refresh, refreshDelay);
  }

  sendView('loading', []);
  refresh();
}
