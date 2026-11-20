/**
 * A2 Organic Acquisition — Client Unit & Mock Test Suite
 * Executes via native Node.js Test Runner (zero extra test dependencies).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createOrganicClient,
  validateOrganicConfig,
  OrganicConfigError,
  OrganicAuthError,
  OrganicTimeoutError,
  OrganicNetworkError,
  OrganicClientError,
  type OrganicConfig,
} from '../index.ts';

const validConfig: OrganicConfig = {
  apiUrl: 'https://organic.a2business.com.br',
  publicationId: 'pub-a2max-test',
  installationKey: 'inst-a2max-test-01',
  timeoutMs: 1000,
  revalidateSeconds: 60,
};

describe('A2 Organic Client — Configuration Validation', () => {
  it('1. Successfully parses valid environment configuration', () => {
    const config = validateOrganicConfig({
      A2_ORGANIC_API_URL: 'https://organic.a2business.com.br/',
      A2_ORGANIC_PUBLICATION_ID: 'pub-a2max-01',
      A2_ORGANIC_INSTALLATION_KEY: 'inst-a2max-01',
      A2_ORGANIC_TIMEOUT_MS: '3000',
      A2_ORGANIC_REVALIDATE_SECONDS: '120',
      NODE_ENV: 'development',
    });

    assert.equal(config.apiUrl, 'https://organic.a2business.com.br');
    assert.equal(config.publicationId, 'pub-a2max-01');
    assert.equal(config.installationKey, 'inst-a2max-01');
    assert.equal(config.timeoutMs, 3000);
    assert.equal(config.revalidateSeconds, 120);
  });

  it('2. Fails when A2_ORGANIC_API_URL is missing or invalid', () => {
    assert.throws(
      () => validateOrganicConfig({ A2_ORGANIC_PUBLICATION_ID: 'p1', A2_ORGANIC_INSTALLATION_KEY: 'k1' }),
      (err: unknown) => err instanceof OrganicConfigError && err.message.includes('A2_ORGANIC_API_URL')
    );

    assert.throws(
      () =>
        validateOrganicConfig({
          A2_ORGANIC_API_URL: 'ftp://invalid-url',
          A2_ORGANIC_PUBLICATION_ID: 'p1',
          A2_ORGANIC_INSTALLATION_KEY: 'k1',
        }),
      (err: unknown) => err instanceof OrganicConfigError && err.message.includes('must start with http')
    );
  });

  it('3. Fails-closed in production when A2_ORGANIC_API_URL points to localhost', () => {
    assert.throws(
      () =>
        validateOrganicConfig({
          A2_ORGANIC_API_URL: 'http://localhost:3000',
          A2_ORGANIC_PUBLICATION_ID: 'p1',
          A2_ORGANIC_INSTALLATION_KEY: 'k1',
          NODE_ENV: 'production',
        }),
      (err: unknown) =>
        err instanceof OrganicConfigError &&
        err.message.includes('Production safety violation') &&
        err.message.includes('localhost')
    );

    assert.throws(
      () =>
        validateOrganicConfig({
          A2_ORGANIC_API_URL: 'http://127.0.0.1:3000',
          A2_ORGANIC_PUBLICATION_ID: 'p1',
          A2_ORGANIC_INSTALLATION_KEY: 'k1',
          NODE_ENV: 'production',
        }),
      (err: unknown) =>
        err instanceof OrganicConfigError && err.message.includes('Production safety violation')
    );
  });

  it('4. Successfully accepts production domain in production environment', () => {
    const config = validateOrganicConfig({
      A2_ORGANIC_API_URL: 'https://organic-api.a2business.com.br',
      A2_ORGANIC_PUBLICATION_ID: 'pub-a2max-prod',
      A2_ORGANIC_INSTALLATION_KEY: 'inst-a2max-prod',
      NODE_ENV: 'production',
    });
    assert.equal(config.apiUrl, 'https://organic-api.a2business.com.br');
  });

  it('5. Fails when publicationId or installationKey are missing', () => {
    assert.throws(
      () =>
        validateOrganicConfig({
          A2_ORGANIC_API_URL: 'https://api.a2.com',
          A2_ORGANIC_INSTALLATION_KEY: 'k1',
        }),
      (err: unknown) => err instanceof OrganicConfigError && err.message.includes('A2_ORGANIC_PUBLICATION_ID')
    );

    assert.throws(
      () =>
        validateOrganicConfig({
          A2_ORGANIC_API_URL: 'https://api.a2.com',
          A2_ORGANIC_PUBLICATION_ID: 'p1',
        }),
      (err: unknown) => err instanceof OrganicConfigError && err.message.includes('A2_ORGANIC_INSTALLATION_KEY')
    );
  });
});

describe('A2 Organic Client — HTTP Requests & Contract Compliance', () => {
  it('6. Successfully fetches article list with headers and formatting (200 OK)', async () => {
    let capturedUrl = '';
    let capturedHeader = '';

    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = String(input);
      const headers = init?.headers as Record<string, string>;
      capturedHeader = headers?.['X-Installation-Id'] || '';

      const payload = {
        data: {
          articles: [
            {
              slug: 'artigo-a2max-performance',
              title: 'Aceleração Comercial com o Método ACTION',
              excerpt: 'Como estruturar processos previsíveis de vendas...',
              author: { name: 'Consultoria A2Max' },
              tags: ['gestao', 'vendas'],
              publishedAt: '2026-11-13T10:00:00Z',
            },
          ],
          total: 1,
          limit: 10,
          offset: 0,
        },
      };

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);
    const result = await client.getArticles({ limit: 5, category: 'gestao' });

    assert.equal(capturedUrl, 'https://organic.a2business.com.br/api/public/v1/publications/pub-a2max-test/articles?limit=5&category=gestao');
    assert.equal(capturedHeader, 'inst-a2max-test-01');
    assert.equal(result.total, 1);
    assert.equal(result.articles[0].slug, 'artigo-a2max-performance');
  });

  it('7. Handles empty article list gracefully (200 OK com articles vazios)', async () => {
    const mockFetch = async () => {
      return new Response(JSON.stringify({ data: { articles: [], total: 0, limit: 10, offset: 0 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);
    const result = await client.getArticles();

    assert.equal(result.total, 0);
    assert.deepEqual(result.articles, []);
  });

  it('8. Successfully fetches single article by slug (200 OK)', async () => {
    let requestedSlug = '';

    const mockFetch = async (input: RequestInfo | URL) => {
      requestedSlug = String(input);
      return new Response(
        JSON.stringify({
          data: {
            slug: 'metodo-action',
            title: 'Metodologia A.C.T.I.O.N.',
            body: '# Conteúdo completo...',
            author: { name: 'Time A2Max' },
            tags: ['performance'],
            publishedAt: '2026-11-13T09:00:00Z',
            updatedAt: '2026-11-13T09:00:00Z',
            seo: { title: 'Metodologia ACTION', metaDescription: 'Descrição SEO' },
            related: [],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);
    const article = await client.getArticleBySlug('metodo-action');

    assert.ok(requestedSlug.includes('/articles/metodo-action'));
    assert.ok(article !== null);
    assert.equal(article?.slug, 'metodo-action');
    assert.equal(article?.title, 'Metodologia A.C.T.I.O.N.');
  });

  it('9. Returns null when article is not found (404 NOT_FOUND)', async () => {
    const mockFetch = async () => {
      return new Response(JSON.stringify({ error: 'NOT_FOUND', message: 'Article not found', status: 404 }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);
    const article = await client.getArticleBySlug('slug-inexistente');

    assert.equal(article, null);
  });

  it('10. Throws OrganicAuthError on invalid installation or unauthorized access (401 / 403)', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          error: 'INVALID_INSTALLATION',
          message: 'Installation key is suspended or domain mismatch',
          status: 403,
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);

    await assert.rejects(
      async () => client.getArticles(),
      (err: unknown) =>
        err instanceof OrganicAuthError &&
        err.status === 403 &&
        err.code === 'INVALID_INSTALLATION' &&
        err.message.includes('Installation key is suspended')
    );
  });

  it('11. Throws OrganicTimeoutError when request aborts due to timeout', async () => {
    const mockFetch = async (_url: RequestInfo | URL, init?: RequestInit) => {
      const signal = init?.signal;
      return new Promise<Response>((_, reject) => {
        if (signal) {
          signal.addEventListener('abort', () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          });
        }
      });
    };

    const fastTimeoutConfig = { ...validConfig, timeoutMs: 50 };
    const client = createOrganicClient(fastTimeoutConfig, mockFetch as unknown as typeof fetch);

    await assert.rejects(
      async () => client.getArticles(),
      (err: unknown) => err instanceof OrganicTimeoutError && err.status === 408
    );
  });

  it('12. Throws OrganicNetworkError when connection fails or service is unavailable (503)', async () => {
    const mockFetch = async () => {
      throw new TypeError('fetch failed: ECONNREFUSED');
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);

    await assert.rejects(
      async () => client.getArticles(),
      (err: unknown) =>
        err instanceof OrganicNetworkError &&
        err.status === 503 &&
        err.message.includes('Network connection failed')
    );
  });

  it('13. Throws OrganicClientError on upstream internal server error (500)', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          error: 'INTERNAL_ERROR',
          message: 'An unexpected internal database error occurred',
          status: 500,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);

    await assert.rejects(
      async () => client.getArticles(),
      (err: unknown) =>
        err instanceof OrganicClientError &&
        err.status === 500 &&
        err.code === 'INTERNAL_ERROR'
    );
  });

  it('14. Successfully retrieves categories list (200 OK)', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          data: {
            categories: [
              { slug: 'estrategia', name: 'Estratégia' },
              { slug: 'aquisicao', name: 'Aquisição' },
            ],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);
    const categories = await client.getCategories();

    assert.equal(categories.length, 2);
    assert.equal(categories[0].slug, 'estrategia');
    assert.equal(categories[1].name, 'Aquisição');
  });

  it('15. Successfully retrieves latest articles with limit clamping', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = String(input);
      return new Response(
        JSON.stringify({
          data: {
            articles: [
              { slug: 'artigo-1', title: 'Artigo 1', excerpt: '...', author: { name: 'A2' }, tags: [], publishedAt: '' },
            ],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);
    const latest = await client.getLatestArticles(5);

    assert.ok(capturedUrl.includes('/latest?limit=5'));
    assert.equal(latest.length, 1);
  });

  it('16. Successfully retrieves showcase articles with limit clamping and positions', async () => {
    let capturedUrl = '';
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedUrl = String(input);
      return new Response(
        JSON.stringify({
          data: {
            articles: [
              {
                slug: 'artigo-vitrine-1',
                title: 'Artigo Vitrine 1',
                excerpt: 'Resumo da vitrine',
                author: { name: 'A2Max Editorial' },
                category: { slug: 'estrategia', name: 'Estratégia' },
                tags: ['performance'],
                publishedAt: '2026-11-15T12:00:00Z',
                position: 1,
                canonical: 'https://www.a2max.com.br/blog/artigo-vitrine-1',
              },
              {
                slug: 'artigo-vitrine-2',
                title: 'Artigo Vitrine 2',
                excerpt: 'Resumo da vitrine 2',
                author: { name: 'A2Max Editorial' },
                tags: [],
                publishedAt: '2026-11-15T11:00:00Z',
                position: 2,
                canonical: 'https://www.a2max.com.br/blog/artigo-vitrine-2',
              },
            ],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);
    const showcase = await client.getShowcaseArticles(4);

    assert.ok(capturedUrl.includes('/showcase?limit=4'));
    assert.equal(showcase.length, 2);
    assert.equal(showcase[0].slug, 'artigo-vitrine-1');
    assert.equal(showcase[0].position, 1);
    assert.equal(showcase[0].canonical, 'https://www.a2max.com.br/blog/artigo-vitrine-1');
    assert.equal(showcase[1].position, 2);

    // Test limit clamping: 0 -> 1, 99 -> 10
    await client.getShowcaseArticles(0);
    assert.ok(capturedUrl.includes('/showcase?limit=1'));

    await client.getShowcaseArticles(99);
    assert.ok(capturedUrl.includes('/showcase?limit=10'));
  });

  it('17. Handles empty showcase list gracefully', async () => {
    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          data: {
            articles: [],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const client = createOrganicClient(validConfig, mockFetch as unknown as typeof fetch);
    const showcase = await client.getShowcaseArticles(4);

    assert.ok(Array.isArray(showcase));
    assert.equal(showcase.length, 0);
  });
});

