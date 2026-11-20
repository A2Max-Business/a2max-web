/**
 * A2 Organic Acquisition — Live Contract Verification
 * Tests the real HTTP connection against http://localhost:3000 to prove
 * isolation and safe behavior when A2Max publication is queried.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createOrganicClient, type OrganicConfig } from '../index.ts';

const liveServerUrl = 'http://localhost:3000';

describe('A2 Organic Live Contract — Publication & Brand Isolation', () => {
  it('1. Live connection: A2Max publication returns exactly 0 articles (ZERO leak from A2 Revista)', async () => {
    const a2maxConfig: OrganicConfig = {
      apiUrl: liveServerUrl,
      publicationId: 'a2max', // Key for A2Max publication (not yet populated in DB)
      installationKey: 'inst-a2max-poc',
      timeoutMs: 5000,
      revalidateSeconds: 60,
    };

    const client = createOrganicClient(a2maxConfig);
    const result = await client.getArticles();

    // Must return empty list, proving zero cross-publication leak
    assert.equal(result.total, 0);
    assert.deepEqual(result.articles, []);
  });

  it('2. Live connection: Non-existent slug in A2Max returns null (404 NOT_FOUND)', async () => {
    const a2maxConfig: OrganicConfig = {
      apiUrl: liveServerUrl,
      publicationId: 'a2max',
      installationKey: 'inst-a2max-poc',
      timeoutMs: 5000,
      revalidateSeconds: 60,
    };

    const client = createOrganicClient(a2maxConfig);
    const article = await client.getArticleBySlug('artigo-inexistente-a2max');

    assert.equal(article, null);
  });

  it('3. Live connection: Querying A2 Revista explicitly returns its own 6 published articles', async () => {
    const revistaConfig: OrganicConfig = {
      apiUrl: liveServerUrl,
      publicationId: 'a2-organic', // A2 Revista publication key
      installationKey: 'inst-demo-business-01',
      timeoutMs: 5000,
      revalidateSeconds: 60,
    };

    const client = createOrganicClient(revistaConfig);
    const result = await client.getArticles();

    assert.equal(result.total, 6);
    assert.equal(result.articles.length, 6);
    const slugs = result.articles.map((a) => a.slug);
    assert.ok(slugs.includes('como-divulgar-um-evento'));
    assert.ok(slugs.includes('o-futuro-dos-eventos-e-experiencias-ao-vivo'));
  });
});

