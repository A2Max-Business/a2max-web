import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidCover } from '../cover.ts';

test('Article Cover Validation & Placeholder Suppression', async (t) => {
  await t.test('1. Rejects null or undefined cover objects', () => {
    assert.equal(isValidCover(null), false);
    assert.equal(isValidCover(undefined), false);
  });

  await t.test('2. Rejects empty string or whitespace-only cover URLs', () => {
    assert.equal(isValidCover({ url: '', alt: 'Empty' }), false);
    assert.equal(isValidCover({ url: '   ', alt: 'Spaces' }), false);
  });

  await t.test('3. Rejects invalid protocols and non-web URLs', () => {
    assert.equal(isValidCover({ url: 'javascript:alert(1)', alt: 'XSS' }), false);
    assert.equal(isValidCover({ url: 'ftp://example.com/pic.png', alt: 'FTP' }), false);
    assert.equal(isValidCover({ url: 'data:image/png;base64,123', alt: 'Data URI' }), false);
  });

  await t.test('4. Rejects synthetic test placeholder artifacts', () => {
    assert.equal(
      isValidCover({
        url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/a2/2026/homologacao-persistencia-a2-organic-d7598db9.png',
        alt: 'Test Dummy',
      }),
      false
    );
  });

  await t.test('5. Accepts authentic, valid HTTP/HTTPS and relative URLs', () => {
    assert.equal(
      isValidCover({
        url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
        alt: 'Real Photo',
      }),
      true
    );
    assert.equal(
      isValidCover({
        url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/a2/2026/capa-estrategica-1200x630.png',
        alt: 'Capa Estratégica',
      }),
      true
    );
    assert.equal(
      isValidCover({
        url: '/images/blog/cover-sample.jpg',
        alt: 'Local Image',
      }),
      true
    );
  });
});
