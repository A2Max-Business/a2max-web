import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { verifyConsumerPreviewToken } from '../preview.ts';
import { createOrganicClient } from '../client.ts';
import { validateOrganicConfig } from '../config.ts';
import { OrganicTimeoutError } from '../errors.ts';
import type { OrganicConfig } from '../types.ts';

function createSignedTestToken(
  payload: Record<string, unknown>,
  secret: string = 'test-shared-secret'
): string {
  const encPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encPayload).digest('base64url');
  return `${encPayload}.${signature}`;
}

test('Consumer Preview Token Verification & Scoping', async (t) => {
  const secret = 'test-consumer-secret-key-456';
  const expectedPub = 'a2max';
  const contentId = 'bf124eb8-090f-4125-96f9-adffc46d71e8';
  const now = Math.floor(Date.now() / 1000);

  await t.test('1. Valid token is accepted and decoded accurately', () => {
    const token = createSignedTestToken(
      {
        tenantId: 'a2',
        publicationId: 'a2max',
        contentId,
        slug: 'marketing-perdem-vendas',
        exp: now + 900,
        iat: now,
      },
      secret
    );

    const result = verifyConsumerPreviewToken(token, expectedPub, secret);
    assert.equal(result.valid, true);
    if (result.valid) {
      assert.equal(result.payload.contentId, contentId);
      assert.equal(result.payload.publicationId, 'a2max');
    }
  });

  await t.test('2. Missing or empty token returns code MISSING', () => {
    const res1 = verifyConsumerPreviewToken(null, expectedPub, secret);
    assert.equal(res1.valid, false);
    if (!res1.valid) assert.equal(res1.code, 'MISSING');

    const res2 = verifyConsumerPreviewToken('', expectedPub, secret);
    assert.equal(res2.valid, false);
    if (!res2.valid) assert.equal(res2.code, 'MISSING');
  });

  await t.test('3. Malformed token returns code MALFORMED', () => {
    const res = verifyConsumerPreviewToken('invalid-token-no-dot', expectedPub, secret);
    assert.equal(res.valid, false);
    if (!res.valid) assert.equal(res.code, 'MALFORMED');
  });

  await t.test('4. Tampered signature returns code INVALID_SIGNATURE', () => {
    const token = createSignedTestToken(
      {
        tenantId: 'a2',
        publicationId: 'a2max',
        contentId,
        slug: 'marketing-perdem-vendas',
        exp: now + 900,
        iat: now,
      },
      secret
    );

    const tampered = token.slice(0, -6) + 'xxxxxx';
    const res = verifyConsumerPreviewToken(tampered, expectedPub, secret);
    assert.equal(res.valid, false);
    if (!res.valid) assert.equal(res.code, 'INVALID_SIGNATURE');
  });

  await t.test('5. Expired token returns code EXPIRED', () => {
    const expiredToken = createSignedTestToken(
      {
        tenantId: 'a2',
        publicationId: 'a2max',
        contentId,
        slug: 'marketing-perdem-vendas',
        exp: now - 300, // 5 minutes ago
        iat: now - 1200,
      },
      secret
    );

    const res = verifyConsumerPreviewToken(expiredToken, expectedPub, secret);
    assert.equal(res.valid, false);
    if (!res.valid) {
      assert.equal(res.code, 'EXPIRED');
      assert.match(res.error, /expirou/i);
    }
  });

  await t.test('6. Publication mismatch returns code PUBLICATION_MISMATCH', () => {
    const tokenOtherPub = createSignedTestToken(
      {
        tenantId: 'a2',
        publicationId: 'a2-organic', // token belongs to Revista
        contentId,
        slug: 'marketing-perdem-vendas',
        exp: now + 900,
        iat: now,
      },
      secret
    );

    // a2max-web expects publicationId 'a2max'
    const res = verifyConsumerPreviewToken(tokenOtherPub, 'a2max', secret);
    assert.equal(res.valid, false);
    if (!res.valid) {
      assert.equal(res.code, 'PUBLICATION_MISMATCH');
      assert.match(res.error, /incompatível/i);
    }
  });

  await t.test('7. Client getPreviewArticle makes authenticated server request with cache: no-store', async () => {
    const config: OrganicConfig = {
      apiUrl: 'http://mock-organic:3000',
      publicationId: 'a2max',
      installationKey: 'inst-a2max-web',
      timeoutMs: 3000,
      revalidateSeconds: 60,
    };

    let requestedUrl = '';
    let requestHeaders: Record<string, string> = {};
    let requestCache: string | undefined = undefined;

    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      requestedUrl = String(input);
      requestHeaders = (init?.headers as Record<string, string>) || {};
      requestCache = init?.cache;

      return new Response(
        JSON.stringify({
          data: {
            slug: 'marketing-perdem-vendas',
            title: 'Mock Preview Title',
            body: '# Preview Content',
            excerpt: 'Mock excerpt',
            publishedAt: '2026-11-13T00:00:00Z',
            tags: ['marketing'],
            author: { name: 'Autor Teste' },
            status: 'DRAFT',
            preview: true,
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    };

    const client = createOrganicClient(config, mockFetch as unknown as typeof fetch);
    const result = await client.getPreviewArticle(contentId, 'valid.token');

    assert.ok(result);
    assert.equal(result.title, 'Mock Preview Title');
    assert.equal(result.preview, true);
    assert.equal(requestedUrl, `http://mock-organic:3000/api/editorial/v1/preview/${contentId}`);
    assert.equal(requestHeaders['Authorization'], 'Bearer valid.token');
    assert.equal(requestHeaders['X-Preview-Token'], 'valid.token');
    assert.equal(requestHeaders['X-Installation-Id'], 'inst-a2max-web');
    assert.equal(requestCache, 'no-store');
  });

  await t.test('8. Preview timeout fallback: defaults to 15000ms in dev and matches timeoutMs in prod', () => {
    const devConfig = validateOrganicConfig({
      NODE_ENV: 'development',
      A2_ORGANIC_API_URL: 'http://localhost:3000',
      A2_ORGANIC_PUBLICATION_ID: 'a2max',
      A2_ORGANIC_INSTALLATION_KEY: 'inst-a2max-web',
    });
    assert.equal(devConfig.timeoutMs, 5000);
    assert.equal(devConfig.previewTimeoutMs, 15000);

    const prodConfig = validateOrganicConfig({
      NODE_ENV: 'production',
      A2_ORGANIC_API_URL: 'https://organic.a2max.com.br',
      A2_ORGANIC_PUBLICATION_ID: 'a2max',
      A2_ORGANIC_INSTALLATION_KEY: 'inst-a2max-web',
    });
    assert.equal(prodConfig.timeoutMs, 5000);
    assert.equal(prodConfig.previewTimeoutMs, 5000);

    const customConfig = validateOrganicConfig({
      NODE_ENV: 'development',
      A2_ORGANIC_API_URL: 'http://localhost:3000',
      A2_ORGANIC_PUBLICATION_ID: 'a2max',
      A2_ORGANIC_INSTALLATION_KEY: 'inst-a2max-web',
      A2_ORGANIC_PREVIEW_TIMEOUT_MS: '20000',
    });
    assert.equal(customConfig.previewTimeoutMs, 20000);
  });

  await t.test('9. Client getPreviewArticle automatically retries once if first attempt aborts with timeout', async () => {
    let callCount = 0;
    const mockFetchWithRetry = async (): Promise<Response> => {
      callCount++;
      if (callCount === 1) {
        const abortErr = new Error('The operation was aborted');
        abortErr.name = 'AbortError';
        throw abortErr;
      }
      return new Response(
        JSON.stringify({
          data: {
            slug: 'marketing-perdem-vendas',
            title: 'Recovered After Cold Compile',
            body: '# Ready',
            status: 'DRAFT',
            author: { name: 'Dev' },
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const config: OrganicConfig = {
      apiUrl: 'http://mock-organic:3000',
      publicationId: 'a2max',
      installationKey: 'inst-a2max-web',
      timeoutMs: 3000,
      previewTimeoutMs: 3000,
      revalidateSeconds: 60,
    };

    const client = createOrganicClient(config, mockFetchWithRetry as unknown as typeof fetch);
    const result = await client.getPreviewArticle(contentId, 'token-123');

    assert.equal(callCount, 2);
    assert.ok(result);
    assert.equal(result.title, 'Recovered After Cold Compile');
  });

  await t.test('10. Client getPreviewArticle throws OrganicTimeoutError if retried attempt also aborts', async () => {
    let callCount = 0;
    const mockFetchAlwaysTimeout = async (): Promise<Response> => {
      callCount++;
      const abortErr = new Error('The operation was aborted');
      abortErr.name = 'AbortError';
      throw abortErr;
    };

    const config: OrganicConfig = {
      apiUrl: 'http://mock-organic:3000',
      publicationId: 'a2max',
      installationKey: 'inst-a2max-web',
      timeoutMs: 3000,
      previewTimeoutMs: 3000,
      revalidateSeconds: 60,
    };

    const client = createOrganicClient(config, mockFetchAlwaysTimeout as unknown as typeof fetch);
    await assert.rejects(
      async () => client.getPreviewArticle(contentId, 'token-123'),
      (err: unknown) => {
        assert.ok(err instanceof OrganicTimeoutError);
        assert.equal(err.code, 'TIMEOUT');
        assert.equal(err.status, 408);
        return true;
      }
    );
    assert.equal(callCount, 2);
  });
});

