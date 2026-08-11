'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const optimizer = require('../static/admin/image-optimizer.js');

test('calculateDimensions keeps small images unchanged', () => {
  assert.deepEqual(optimizer.calculateDimensions(800, 600, 1600), {
    width: 800,
    height: 600,
  });
});

test('calculateDimensions resizes landscape and portrait images proportionally', () => {
  assert.deepEqual(optimizer.calculateDimensions(3200, 1800, 1600), {
    width: 1600,
    height: 900,
  });
  assert.deepEqual(optimizer.calculateDimensions(1000, 2000, 1600), {
    width: 800,
    height: 1600,
  });
});

test('scaleDimensions preserves narrow-image aspect ratios', () => {
  assert.deepEqual(
    optimizer.scaleDimensions({ width: 200, height: 1600 }, 0.5, 320),
    { width: 100, height: 800 },
  );
  assert.deepEqual(
    optimizer.scaleDimensions({ width: 100, height: 400 }, 0.2, 320),
    { width: 80, height: 320 },
  );
});

test('slugifyFilename creates safe ASCII names with a fallback', () => {
  assert.equal(optimizer.slugifyFilename('Workshop Photo 2026.JPG'), 'workshop-photo-2026');
  assert.equal(optimizer.slugifyFilename('ภาพงาน.png'), 'image');
});

test('uniqueFilename is deterministic when date and random source are supplied', () => {
  const result = optimizer.uniqueFilename(
    'Workshop Photo.JPG',
    new Date(2026, 7, 10, 14, 5, 6),
    new Uint32Array([123456789]),
  );
  assert.match(result, /^workshop-photo-20260810-140506-[a-z0-9]{6}\.webp$/);
});

test('Thai and duplicate source names receive safe, unique WebP names', () => {
  const date = new Date(2026, 7, 10, 14, 5, 6);
  const first = optimizer.uniqueFilename('ภาพงาน.png', date, new Uint32Array([1]));
  const second = optimizer.uniqueFilename('ภาพงาน.png', date, new Uint32Array([2]));
  assert.match(first, /^image-20260810-140506-[a-z0-9]{6}\.webp$/);
  assert.notEqual(first, second);
});

test('validateFile accepts supported images and rejects unsafe formats and large input', () => {
  ['image/jpeg', 'image/png', 'image/webp'].forEach((type) => {
    assert.doesNotThrow(() => optimizer.validateFile({ type, size: 10 * 1024 * 1024 }));
  });
  ['image/gif', 'image/svg+xml', 'image/tiff', 'image/bmp'].forEach((type) => {
    assert.throws(
      () => optimizer.validateFile({ type, size: 1024 }),
      /JPEG, PNG, or WebP/,
    );
  });
  assert.throws(
    () => optimizer.validateFile({ type: 'image/png', size: 21 * 1024 * 1024 }),
    /larger than 20 MB/,
  );
});
