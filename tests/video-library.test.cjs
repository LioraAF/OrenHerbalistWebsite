const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function library(prefix = '') {
  const context = { window: {} };
  vm.runInNewContext(read(`${prefix}js/drive-videos.js`), context);
  const source = read(`${prefix}js/main.js`);
  const block = source.match(/const reelItems = (\[[\s\S]*?\n  \])\.map/);
  assert.ok(block, 'YouTube library is present');
  return [...vm.runInNewContext(block[1], {}), ...context.window.DRIVE_VIDEOS];
}

test('all 45 entries have specific titles, descriptions and valid topics', () => {
  const items = library();
  assert.equal(items.length, 45);
  assert.equal(new Set(items.map(item => item.id)).size, 45);
  for (const item of items) {
    assert.ok(item.title.length > 8, item.id);
    assert.ok(item.description.length > 40, item.id);
    assert.ok(item.description.length < 260, item.id);
    assert.ok(!item.description.includes('מפגש עם אורן ועם עולם הצמחים'), item.id);
    assert.ok(['foraging', 'medicinal-plants', 'natural-pharmacy'].includes(item.topic));
    if (item.driveId) assert.ok(fs.existsSync(path.join(root, item.thumbnail)));
  }
});

test('English copy matches the reviewed Hebrew entries and categories', () => {
  const hebrew = library();
  const english = library('en/');
  const translations = JSON.parse(read('translations/en.json'));
  assert.equal(english.length, hebrew.length);
  hebrew.forEach((item, index) => {
    assert.equal(english[index].id, item.id);
    assert.equal(english[index].topic, item.topic);
    assert.equal(english[index].title, translations[item.title]);
    assert.equal(english[index].description, translations[item.description]);
    assert.doesNotMatch(english[index].title + english[index].description, /[א-ת]/);
  });
});

test('titles use a single natural phrase without a dash-separated subtitle', () => {
  for (const prefix of ['', 'en/']) {
    for (const item of library(prefix)) {
      assert.doesNotMatch(item.title, /\s[—–-]\s/, item.id);
    }
  }
});

test('review index covers every entry and documents the six identical uploads', () => {
  const review = JSON.parse(read('output/video-subtitle-review-20261122/review.json'));
  const items = library();
  assert.equal(review.entries.length, 45);
  assert.equal(review.entries.filter(item => item.identicalRecordingTo).length, 6);
  for (const entry of review.entries) {
    const item = items.find(item => item.id === entry.id);
    assert.ok(item);
    assert.equal(item.title, entry.title);
    assert.equal(item.description, entry.description);
    assert.equal(item.topic, entry.topic);
    assert.ok(entry.evidenceSeconds.length);
    if (entry.identicalRecordingTo) {
      const original = items.find(item => item.id === entry.identicalRecordingTo);
      assert.equal(item.title, original.title);
      assert.equal(item.description, original.description);
    }
  }
});

test('safety-related summaries preserve the warnings in the recordings', () => {
  const items = library();
  for (const item of items.filter(item => /דודא/.test(item.title))) {
    assert.match(item.description, /רעיל/);
  }
  assert.match(items.find(item => item.id === 'dW3hDGr-1T8').description, /אזהרה מפני שימוש פנימי/);
});
