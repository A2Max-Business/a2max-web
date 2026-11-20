// Must be set before any Next.js imports
(process.env as Record<string, string | undefined>).NODE_ENV = 'test';
process.env.__NEXT_IMAGE_OPTS = JSON.stringify({
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  domains: ['hfdtjzyvathxangshcje.supabase.co'],
  remotePatterns: [
    { protocol: 'https', hostname: '**.supabase.co' },
    { protocol: 'https', hostname: 'hfdtjzyvathxangshcje.supabase.co' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'www.a2max.com.br' },
  ],
  path: '/_next/image',
  loader: 'default',
  dangerouslyAllowSVG: false,
  unoptimized: false,
});

import http from 'node:http';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Consumer imports
import BlogPage from '../../../app/blog/page';
import ArticlePage from '../../../app/blog/[slug]/page';
import { BlogShowcaseSection } from '../../../components/sections/BlogShowcaseSection';
import sitemap, { _resetSitemapCache } from '../../../app/sitemap';
import { handleRevalidation } from '../../../app/api/revalidate/route';
import { createOrganicClient } from '../client';
import crypto from 'node:crypto';
import { NextRequest } from 'next/server';

function computeHmacSignature(rawBody: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  return hmac.digest('hex');
}

const TEST_SECRET = 'audit-test-revalidate-secret-32ch!';
const TEST_PORT = 3098;
const TEST_API_URL = `http://127.0.0.1:${TEST_PORT}`;

// Mutable Data Store for isolated testing
interface StoredArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: { id: string; slug: string; name: string };
  author: { name: string; role: string };
  cover: { url: string; alt: string; width: number; height: number };
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  canonical: string;
  showcaseEnabled?: boolean;
  showcasePosition?: number;
  status: 'PUBLISHED' | 'ARCHIVED';
}

let store: {
  articles: StoredArticle[];
} = {
  articles: [],
};

let invalidatedPaths: string[] = [];
let invalidatedTags: string[] = [];

// Create lightweight mock Core Public API server
let mockServer: http.Server;

function startMockServer(): Promise<void> {
  return new Promise((resolve) => {
    mockServer = http.createServer((req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      const pathname = url.pathname;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Organic-API', 'v1');

      // 1. /api/public/v1/publications/a2max/articles/:slug
      const slugMatch = pathname.match(/^\/api\/public\/v1\/publications\/a2max\/articles\/([a-z0-9-]+)$/);
      if (slugMatch) {
        const slug = slugMatch[1];
        const found = store.articles.find((a) => a.slug === slug && a.status === 'PUBLISHED');
        if (!found) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'NOT_FOUND', message: `Article "${slug}" not found` }));
          return;
        }
        res.writeHead(200);
        res.end(JSON.stringify({
          data: {
            id: found.id,
            slug: found.slug,
            title: found.title,
            excerpt: found.excerpt,
            body: found.body,
            category: found.category,
            author: found.author,
            cover: found.cover,
            tags: found.tags,
            publishedAt: found.publishedAt,
            updatedAt: found.updatedAt,
            canonical: found.canonical,
            seo: {
              title: `${found.title} | Blog A2Max`,
              metaDescription: found.excerpt,
              canonicalUrl: found.canonical,
            },
          },
        }));
        return;
      }

      // 2. /api/public/v1/publications/a2max/articles
      if (pathname === '/api/public/v1/publications/a2max/articles') {
        const published = store.articles.filter((a) => a.status === 'PUBLISHED');
        res.writeHead(200);
        res.end(JSON.stringify({
          data: {
            articles: published.map((a) => ({
              id: a.id,
              slug: a.slug,
              title: a.title,
              excerpt: a.excerpt,
              category: a.category,
              author: a.author,
              cover: a.cover,
              tags: a.tags,
              publishedAt: a.publishedAt,
              updatedAt: a.updatedAt,
              canonical: a.canonical,
            })),
            total: published.length,
            limit: 50,
            offset: 0,
          },
        }));
        return;
      }

      // 3. /api/public/v1/publications/a2max/showcase
      if (pathname === '/api/public/v1/publications/a2max/showcase') {
        const showcaseArticles = store.articles
          .filter((a) => a.status === 'PUBLISHED' && a.showcaseEnabled)
          .sort((a, b) => (a.showcasePosition || 99) - (b.showcasePosition || 99))
          .map((a) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            category: a.category,
            author: a.author,
            cover: a.cover,
            tags: a.tags,
            publishedAt: a.publishedAt,
            position: a.showcasePosition || 1,
            readingTime: 4,
            canonical: a.canonical,
          }));

        res.writeHead(200);
        res.end(JSON.stringify({
          data: {
            articles: showcaseArticles,
          },
        }));
        return;
      }

      // 4. /api/public/v1/publications/a2max/categories
      if (pathname === '/api/public/v1/publications/a2max/categories') {
        res.writeHead(200);
        res.end(JSON.stringify({
          data: {
            categories: [
              { id: 'cat-1', slug: 'estrategia', name: 'Estratégia' },
              { id: 'cat-2', slug: 'tecnologia', name: 'Tecnologia' },
            ],
          },
        }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: 'NOT_FOUND' }));
    });

    mockServer.listen(TEST_PORT, '127.0.0.1', () => {
      resolve();
    });
  });
}

function stopMockServer(): Promise<void> {
  return new Promise((resolve) => {
    mockServer.close(() => resolve());
  });
}

// Helper to trigger consumer revalidation via NextRequest to handleRevalidation
async function triggerRevalidate(payload: Record<string, unknown>) {
  invalidatedPaths = [];
  invalidatedTags = [];

  const rawBody = JSON.stringify(payload);
  const signature = computeHmacSignature(rawBody, TEST_SECRET);

  const req = new NextRequest('http://localhost:3001/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-organic-signature': signature,
    },
    body: rawBody,
  });

  return await handleRevalidation(req, {
    secret: TEST_SECRET,
    expectedPublicationId: 'a2max',
    revalidatePath: (path) => {
      invalidatedPaths.push(path);
    },
    revalidateTag: (tag) => {
      invalidatedTags.push(tag);
    },
  });
}

describe('Content Actually Updated Audit — Full Editorial Lifecycle Test', () => {
  before(async () => {
    await startMockServer();
    process.env.A2_ORGANIC_API_URL = TEST_API_URL;
    process.env.A2_ORGANIC_PUBLICATION_ID = 'a2max';
    process.env.A2_ORGANIC_INSTALLATION_KEY = 'inst-test-audit';
    process.env.A2_ORGANIC_REVALIDATE_SECRET = TEST_SECRET;
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.a2max.com.br';
  });

  after(async () => {
    await stopMockServer();
  });

  it('Fase 0: Estado Inicial Limpo (zero artigos)', async () => {
    store.articles = [];
    _resetSitemapCache();

    // Blog HTML
    const blogJsx = await BlogPage();
    const blogHtml = renderToStaticMarkup(blogJsx);
    assert.ok(
      blogHtml.includes('Nenhum artigo publicado no momento') || blogHtml.includes('Blog &amp; Inteligência'),
      'Blog renderiza estado sem artigos'
    );
    assert.ok(!blogHtml.includes('Estratégia de Aquisição Orgânica'), 'Nenhum artigo deve estar presente');

    // Article Page 404 for non-existent slug
    await assert.rejects(
      async () => {
        await ArticlePage({ params: Promise.resolve({ slug: 'inexistente-artigo-inicial' }) });
      },
      /NEXT_HTTP_ERROR_FALLBACK;404/,
      'Slug inexistente deve lançar 404'
    );

    // Sitemap XML
    const sitemapEntries = await sitemap();
    assert.equal(sitemapEntries.length, 2, 'Sitemap inicial deve conter apenas homepage e /blog');
    assert.equal(sitemapEntries[0].url, 'https://www.a2max.com.br');
    assert.equal(sitemapEntries[1].url, 'https://www.a2max.com.br/blog');

    // Showcase
    const client = createOrganicClient({
      apiUrl: TEST_API_URL,
      publicationId: 'a2max',
      installationKey: 'inst-test-audit',
      timeoutMs: 3000,
      revalidateSeconds: 60,
    });
    const showcaseArticles = await client.getShowcaseArticles();
    const showcaseJsx = await BlogShowcaseSection({ initialArticles: showcaseArticles });
    assert.equal(showcaseJsx, null, 'Vitrine vazia deve retornar null');
  });

  it('Fase 1: Publicação de Artigo (content.published)', async () => {
    const articleTitle = 'Estratégia de Aquisição Orgânica de Alta Performance';
    const articleSlug = 'estrategia-aquisicao-organica';

    // 1. Persist article in mock mutable store
    store.articles.push({
      id: 'art-001',
      slug: articleSlug,
      title: articleTitle,
      excerpt: 'Guia definitivo de aquisição orgânica para marcas B2B.',
      body: '<p>Este é o conteúdo aprofundado do artigo sobre aquisição orgânica.</p>',
      category: { id: 'cat-1', slug: 'estrategia', name: 'Estratégia' },
      author: { name: 'Alexandre', role: 'Head de Inteligência' },
      cover: {
        url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/capa.png',
        alt: 'Capa Estratégia',
        width: 1200,
        height: 630,
      },
      tags: ['b2b', 'aquisicao'],
      publishedAt: '2026-11-15T15:00:00.000Z',
      canonical: `https://www.a2max.com.br/blog/${articleSlug}`,
      showcaseEnabled: true,
      showcasePosition: 1,
      status: 'PUBLISHED',
    });

    // 2. Dispatch revalidation webhook
    const revalRes = await triggerRevalidate({
      eventId: 'evt-pub-01',
      event: 'content.published',
      publicationId: 'a2max',
      slug: articleSlug,
      timestamp: Date.now(),
    });
    const revalJson = await revalRes.json();
    assert.equal(revalRes.status, 200);
    assert.equal(revalJson.ok, true);
    assert.ok(invalidatedPaths.includes('/blog'), 'Invalida /blog');
    assert.ok(invalidatedPaths.includes('/sitemap.xml'), 'Invalida /sitemap.xml');
    assert.ok(invalidatedPaths.includes(`/blog/${articleSlug}`), 'Invalida rota do artigo');
    assert.ok(invalidatedTags.includes('organic:a2max:articles'), 'Invalida tag de artigos');

    // 3. Verify Blog HTML contains article title
    const blogJsx = await BlogPage();
    const blogHtml = renderToStaticMarkup(blogJsx);
    assert.ok(
      blogHtml.includes(articleTitle),
      `Blog HTML deve conter o título publicado "${articleTitle}"`
    );

    // 4. Verify Article Page HTML renders 200 with title and body
    const articleJsx = await ArticlePage({ params: Promise.resolve({ slug: articleSlug }) });
    const articleHtml = renderToStaticMarkup(articleJsx);
    assert.ok(articleHtml.includes(articleTitle), 'Article Page HTML deve conter o título');
    assert.ok(articleHtml.includes('conteúdo aprofundado do artigo'), 'Article Page HTML deve conter o corpo');

    // 5. Verify Sitemap includes new article URL
    _resetSitemapCache();
    const sitemapEntries = await sitemap();
    assert.equal(sitemapEntries.length, 3, 'Sitemap deve conter 3 URLs');
    const articleEntry = sitemapEntries.find((e) => e.url === `https://www.a2max.com.br/blog/${articleSlug}`);
    assert.ok(articleEntry, 'Sitemap deve listar a URL canônica do novo artigo');

    // 6. Verify Showcase renders 1 card with article title
    const client = createOrganicClient({
      apiUrl: TEST_API_URL,
      publicationId: 'a2max',
      installationKey: 'inst-test-audit',
      timeoutMs: 3000,
      revalidateSeconds: 60,
    });
    const showcaseArticles = await client.getShowcaseArticles();
    assert.equal(showcaseArticles.length, 1);
    const showcaseJsx = await BlogShowcaseSection({ initialArticles: showcaseArticles });
    assert.notEqual(showcaseJsx, null);
    const showcaseHtml = renderToStaticMarkup(showcaseJsx!);
    assert.ok(showcaseHtml.includes(articleTitle), 'Vitrine deve renderizar card com o título do artigo');
  });

  it('Fase 2: Atualização de Título (content.updated)', async () => {
    const oldTitle = 'Título Original Anterior';
    const newTitle = 'Estratégia Avançada de Escalar Receita B2B';
    const articleSlug = 'artigo-atualizacao-titulo';

    // Seed new article for title update test
    store.articles.push({
      id: 'art-002',
      slug: articleSlug,
      title: oldTitle,
      excerpt: 'Resumo original.',
      body: '<p>Conteúdo de teste para atualização.</p>',
      category: { id: 'cat-1', slug: 'estrategia', name: 'Estratégia' },
      author: { name: 'Alexandre', role: 'Head de Inteligência' },
      cover: {
        url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/capa.png',
        alt: 'Capa',
        width: 1200,
        height: 630,
      },
      tags: ['b2b'],
      publishedAt: '2026-11-15T15:00:00.000Z',
      canonical: `https://www.a2max.com.br/blog/${articleSlug}`,
      showcaseEnabled: true,
      showcasePosition: 1,
      status: 'PUBLISHED',
    });

    // 1. Update title in mutable store
    const article = store.articles.find((a) => a.slug === articleSlug)!;
    article.title = newTitle;
    article.updatedAt = '2026-11-15T18:00:00.000Z';

    // 2. Dispatch revalidation webhook
    const revalRes = await triggerRevalidate({
      eventId: 'evt-upd-01',
      event: 'content.updated',
      publicationId: 'a2max',
      slug: articleSlug,
      timestamp: Date.now(),
    });
    assert.equal(revalRes.status, 200);

    // 3. Verify Blog HTML contains NEW title and OLD title is GONE
    const blogJsx = await BlogPage();
    const blogHtml = renderToStaticMarkup(blogJsx);
    assert.ok(blogHtml.includes(newTitle), 'Blog HTML deve conter o NOVO título');
    assert.ok(!blogHtml.includes(oldTitle), 'Blog HTML NÃO DEVE conter o título antigo');

    // 4. Verify Article Page HTML contains NEW title
    const articleJsx = await ArticlePage({ params: Promise.resolve({ slug: articleSlug }) });
    const articleHtml = renderToStaticMarkup(articleJsx);
    assert.ok(articleHtml.includes(newTitle), 'Article Page HTML deve conter o NOVO título');
    assert.ok(!articleHtml.includes(oldTitle), 'Article Page HTML NÃO DEVE conter o título antigo');

    // 5. Verify Showcase HTML contains NEW title
    const client = createOrganicClient({
      apiUrl: TEST_API_URL,
      publicationId: 'a2max',
      installationKey: 'inst-test-audit',
      timeoutMs: 3000,
      revalidateSeconds: 60,
    });
    const showcaseArticles = await client.getShowcaseArticles();
    const showcaseJsx = await BlogShowcaseSection({ initialArticles: showcaseArticles });
    const showcaseHtml = renderToStaticMarkup(showcaseJsx!);
    assert.ok(showcaseHtml.includes(newTitle), 'Vitrine deve conter o NOVO título');
    assert.ok(!showcaseHtml.includes(oldTitle), 'Vitrine NÃO DEVE conter o título antigo');
  });

  it('Fase 3: Renomeação de Slug (content.updated com previousSlug)', async () => {
    const oldSlug = 'slug-antigo-para-renomear';
    const newSlug = 'receita-previsivel-b2b';

    // Add article with old slug
    store.articles.push({
      id: 'art-003',
      slug: oldSlug,
      title: 'Artigo Sobre Receita Previsível B2B',
      excerpt: 'Resumo sobre receita previsível.',
      body: '<p>Conteúdo sobre receita previsível.</p>',
      category: { id: 'cat-2', slug: 'tecnologia', name: 'Tecnologia' },
      author: { name: 'Alexandre', role: 'Head de Inteligência' },
      cover: {
        url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/capa.png',
        alt: 'Capa',
        width: 1200,
        height: 630,
      },
      tags: ['receita'],
      publishedAt: '2026-11-15T15:00:00.000Z',
      canonical: `https://www.a2max.com.br/blog/${oldSlug}`,
      status: 'PUBLISHED',
    });

    // 1. Rename slug in store
    const article = store.articles.find((a) => a.slug === oldSlug)!;
    article.slug = newSlug;
    article.canonical = `https://www.a2max.com.br/blog/${newSlug}`;

    // 2. Dispatch revalidation webhook with previousSlug
    const revalRes = await triggerRevalidate({
      eventId: 'evt-slug-01',
      event: 'content.updated',
      publicationId: 'a2max',
      slug: newSlug,
      previousSlug: oldSlug,
      timestamp: Date.now(),
    });
    assert.equal(revalRes.status, 200);
    assert.ok(invalidatedPaths.includes(`/blog/${oldSlug}`), 'Invalida slug antigo');
    assert.ok(invalidatedPaths.includes(`/blog/${newSlug}`), 'Invalida slug novo');

    // 3. Verify OLD slug returns 404 (NEXT_HTTP_ERROR_FALLBACK;404)
    await assert.rejects(
      async () => {
        await ArticlePage({ params: Promise.resolve({ slug: oldSlug }) });
      },
      /NEXT_HTTP_ERROR_FALLBACK;404/,
      'Slug antigo deve responder 404 (NEXT_HTTP_ERROR_FALLBACK;404)'
    );

    // 4. Verify NEW slug renders 200 with article content
    const articleJsx = await ArticlePage({ params: Promise.resolve({ slug: newSlug }) });
    const articleHtml = renderToStaticMarkup(articleJsx);
    assert.ok(articleHtml.includes('Artigo Sobre Receita Previsível B2B'));

    // 5. Verify Sitemap: old slug is gone, new slug is present
    _resetSitemapCache();
    const sitemapEntries = await sitemap();
    const oldEntry = sitemapEntries.find((e) => e.url.includes(oldSlug));
    const newEntry = sitemapEntries.find((e) => e.url.includes(newSlug));
    assert.equal(oldEntry, undefined, 'Sitemap NÃO DEVE listar slug antigo');
    assert.ok(newEntry, 'Sitemap DEVE listar o novo slug');
    assert.equal(newEntry.url, `https://www.a2max.com.br/blog/${newSlug}`);
  });

  it('Fase 4: Arquivamento de Artigo (content.archived)', async () => {
    const activeSlug = 'artigo-para-arquivar-teste';

    // Seed article
    store.articles = [
      {
        id: 'art-004',
        slug: activeSlug,
        title: 'Artigo a Ser Arquivado',
        excerpt: 'Resumo do artigo arquivado.',
        body: '<p>Este artigo será removido.</p>',
        category: { id: 'cat-1', slug: 'estrategia', name: 'Estratégia' },
        author: { name: 'Alexandre', role: 'Head de Inteligência' },
        cover: {
          url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/capa.png',
          alt: 'Capa',
          width: 1200,
          height: 630,
        },
        tags: ['teste'],
        publishedAt: '2026-11-15T15:00:00.000Z',
        canonical: `https://www.a2max.com.br/blog/${activeSlug}`,
        showcaseEnabled: true,
        showcasePosition: 1,
        status: 'PUBLISHED',
      },
    ];

    // 1. Mark article as ARCHIVED in store
    const article = store.articles.find((a) => a.slug === activeSlug)!;
    article.status = 'ARCHIVED';

    // 2. Dispatch revalidation webhook
    const revalRes = await triggerRevalidate({
      eventId: 'evt-arch-01',
      event: 'content.archived',
      publicationId: 'a2max',
      slug: activeSlug,
      timestamp: Date.now(),
    });
    assert.equal(revalRes.status, 200);

    // 3. Verify Article Page returns 404
    await assert.rejects(
      async () => {
        await ArticlePage({ params: Promise.resolve({ slug: activeSlug }) });
      },
      /NEXT_HTTP_ERROR_FALLBACK;404/,
      'Artigo arquivado deve responder 404 (NEXT_HTTP_ERROR_FALLBACK;404)'
    );

    // 4. Verify Blog HTML no longer contains article
    const blogJsx = await BlogPage();
    const blogHtml = renderToStaticMarkup(blogJsx);
    assert.ok(!blogHtml.includes('Artigo a Ser Arquivado'), 'Artigo arquivado deve ser removido da listagem do Blog');

    // 5. Verify Sitemap no longer includes article URL
    _resetSitemapCache();
    const sitemapEntries = await sitemap();
    assert.equal(sitemapEntries.length, 2, 'Sitemap deve conter apenas as 2 páginas estáticas após arquivamento');
    const archivedEntry = sitemapEntries.find((e) => e.url.includes(activeSlug));
    assert.equal(archivedEntry, undefined, 'Sitemap NÃO DEVE listar artigo arquivado');

    // 6. Verify Showcase returns null
    const client = createOrganicClient({
      apiUrl: TEST_API_URL,
      publicationId: 'a2max',
      installationKey: 'inst-test-audit',
      timeoutMs: 3000,
      revalidateSeconds: 60,
    });
    const showcaseArticles = await client.getShowcaseArticles();
    assert.equal(showcaseArticles.length, 0);
    const showcaseJsx = await BlogShowcaseSection({ initialArticles: showcaseArticles });
    assert.equal(showcaseJsx, null, 'Vitrine deve retornar null após arquivamento do artigo');
  });
});
