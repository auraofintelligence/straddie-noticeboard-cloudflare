import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { nextPilotChangeAfter, pilotNoticesAt, pilotZone, validatePilotFeed } from '../public/pilot-feed.js';
import { notices as practiceNotices } from '../public/notices.js';

const file = new URL('../public/data/pilot-notices.json', import.meta.url);
const record = {
  id: 'test-community-session',
  status: 'approved',
  title: 'Test community session',
  publisher: 'Fixture publisher',
  place: 'Dunwich',
  category: 'Volunteering',
  summary: 'A test record used to verify display timing.',
  sourceUrl: 'https://example.org/fixture',
  reviewedBy: 'Fixture reviewer',
  reviewedAt: '2026-11-24T08:00:00+10:00',
  startsAt: '2026-11-24T10:00:00+10:00',
  expiresAt: '2026-11-24T11:00:00+10:00',
};

function feedWith(...notices) {
  return { schema: 'notice-feed.v1', zone: pilotZone, notices };
}

test('the maintained feed passes schema and publication checks', async () => {
  validatePilotFeed(JSON.parse(await readFile(file, 'utf8')));
});

test('an empty pilot feed displays no practice notices', () => {
  const feed = validatePilotFeed(feedWith());
  assert.deepEqual(pilotNoticesAt(feed, Date.parse(record.startsAt)), []);
  assert.equal(nextPilotChangeAfter(feed, Date.parse(record.startsAt)), Infinity);
  assert.throws(() => validatePilotFeed(feedWith({ ...record, id: practiceNotices[0].id })), /distinct from practice notices/);
});

test('a scheduled notice begins at start and disappears at exact expiry', () => {
  const feed = validatePilotFeed(feedWith(record));
  const start = Date.parse(record.startsAt);
  const expiry = Date.parse(record.expiresAt);
  assert.deepEqual(pilotNoticesAt(feed, start - 1), []);
  assert.equal(nextPilotChangeAfter(feed, start - 1), start);
  assert.deepEqual(pilotNoticesAt(feed, start), [record]);
  assert.deepEqual(pilotNoticesAt(feed, expiry - 1), [record]);
  assert.equal(nextPilotChangeAfter(feed, start), expiry);
  assert.deepEqual(pilotNoticesAt(feed, expiry), []);
});

test('review time gates a notice with no start or an earlier start', () => {
  const { startsAt, ...unscheduled } = record;
  const lateReview = { ...record, id: 'test-late-review', reviewedAt: '2026-11-24T10:15:00+10:00' };
  const feed = validatePilotFeed(feedWith(unscheduled, lateReview));
  const review = Date.parse(record.reviewedAt);
  assert.deepEqual(pilotNoticesAt(feed, review - 1), []);
  assert.deepEqual(pilotNoticesAt(feed, review), [unscheduled]);
  assert.deepEqual(pilotNoticesAt(feed, Date.parse(startsAt)), [unscheduled]);
  assert.deepEqual(pilotNoticesAt(feed, Date.parse(lateReview.reviewedAt)), [unscheduled, lateReview]);
});

test('a corrected and extended notice uses the same ID and can be withdrawn', () => {
  const revised = {
    ...record,
    summary: 'Updated fixture wording.',
    reviewedAt: '2026-11-24T10:30:00+10:00',
    expiresAt: '2026-11-24T12:00:00+10:00',
  };
  const previousExpiry = Date.parse(record.expiresAt);
  assert.deepEqual(pilotNoticesAt(validatePilotFeed(feedWith(record)), previousExpiry), []);
  assert.deepEqual(pilotNoticesAt(validatePilotFeed(feedWith(revised)), previousExpiry), [revised]);
  const withdrawn = validatePilotFeed(feedWith({ id: record.id, status: 'withdrawn' }));
  assert.deepEqual(pilotNoticesAt(withdrawn, previousExpiry), []);
  assert.throws(() => validatePilotFeed(feedWith({ ...record, status: 'withdrawn' })), /remove all details/);
});

test('invalid timestamps, states, source links, categories and unknown fields fail the check', () => {
  for (const change of [
    { reviewedAt: '2026-11-24T08:00:00' },
    { reviewedAt: '2026-02-30T08:00:00Z' },
    { expiresAt: record.startsAt },
    { status: 'draft' },
    { sourceUrl: 'https://person:password@example.org/' },
    { sourceUrl: 'http://example.org/' },
    { category: 'Emergency warnings' },
    { privateContact: 'Internal field' },
  ]) {
    assert.throws(() => validatePilotFeed(feedWith({ ...record, ...change })));
  }
  assert.throws(() => validatePilotFeed(feedWith(record, record)), /unique public ID/);
  assert.throws(() => validatePilotFeed({ ...feedWith(record), zone: 'other-zone' }), /Minjerribah feed/);
  assert.doesNotThrow(() => validatePilotFeed(feedWith({ ...record, category: 'Paid work' })));
});
