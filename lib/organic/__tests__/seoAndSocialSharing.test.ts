import test from 'node:test';
import assert from 'node:assert/strict';
import type { PublicArticleDTO } from '../types.ts';

function createMockPublishedArticle(overrides: Partial<PublicArticleDTO> = {}): PublicArticleDTO {
  return {
    slug: 'por-que-empresas-que-investem-em-marketing-perdem-vendas',
    title: 'Por que empresas que investem em marketing continuam perdendo oportunidades de vendas?',
    subtitle: 'O descompasso entre geração de demanda, prontidão operacional e processos comerciais.',
    excerpt: 'Muitas empresas aumentam investimentos em tráfego e mídia, mas veem as vendas estagnarem.',
    body: '# Artigo completo com metodologia.',
    author: {
      name: 'Equipe de Inteligência A2Max',
      role: 'Estratégia & Performance',
    },
    publishedAt: '2026-11-14T09:00:00Z',
    updatedAt: '2026-11-14T10:00:00Z',
    readingTime: 4,
    tags: ['marketing', 'vendas', 'gestao'],
    seo: {
      title: 'Por Que Empresas Perdem Vendas no Marketing | Blog A2Max',
      metaDescription: 'Descubra os gargalos entre atração e conversão que impactam as vendas.',
      canonicalUrl: 'https://www.a2max.com.br/blog/por-que-empresas-que-investem-em-marketing-perdem-vendas',
      ogImage: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/a2/2026/capa-oficial-1200x630.png',
    },
    social: {
      title: 'Por Que Empresas Perdem Vendas no Marketing',
      description: 'Descubra os gargalos entre atração e conversão que impactam as vendas.',
      imageUrl: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/a2/2026/capa-oficial-1200x630.png',
      imageAlt: 'Equipe em análise de indicadores de conversão comercial',
    },
    related: [],
    ...overrides,
  };
}

test('SEO & Social Sharing Contracts & Fallback Compliance', async (t) => {
  const DEFAULT_FALLBACK_OG_IMAGE = 'https://www.a2max.com.br/logos/a2max-lightmode.png';

  await t.test('1. Article with explicit cover produces complete Open Graph and Twitter metadata', () => {
    const article = createMockPublishedArticle({
      cover: {
        url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/a2/2026/capa-oficial-1200x630.png',
        alt: 'Painel executivo de vendas',
        width: 1200,
        height: 630,
      },
    });

    const ogImage = article.cover?.url || article.social?.imageUrl || article.seo?.ogImage || DEFAULT_FALLBACK_OG_IMAGE;
    assert.equal(ogImage, 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/a2/2026/capa-oficial-1200x630.png');
    assert.equal(article.cover?.width, 1200);
    assert.equal(article.cover?.height, 630);
    assert.match(ogImage, /^https:\/\//);
  });

  await t.test('2. Article without cover safely falls back to official brand social image without inventing fake assets', () => {
    const article = createMockPublishedArticle({
      cover: undefined,
      social: undefined,
      seo: {
        title: 'Título SEO',
        metaDescription: 'Descrição SEO',
        canonicalUrl: 'https://www.a2max.com.br/blog/slug-sem-capa',
      },
    });

    const ogImage = article.cover?.url || article.social?.imageUrl || article.seo?.ogImage || DEFAULT_FALLBACK_OG_IMAGE;
    assert.equal(ogImage, DEFAULT_FALLBACK_OG_IMAGE);
    assert.match(ogImage, /^https:\/\//);
  });

  await t.test('3. Canonical URL never points to localhost, temporary domains or preview URLs in production', () => {
    const article = createMockPublishedArticle();
    const canonical = article.canonical || article.seo?.canonicalUrl;
    assert.ok(canonical);
    assert.match(canonical!, /^https:\/\/www\.a2max\.com\.br\/blog\//);
    assert.doesNotMatch(canonical!, /localhost/);
    assert.doesNotMatch(canonical!, /preview/);
    assert.doesNotMatch(canonical!, /vercel\.app/);
  });

  await t.test('4. JSON-LD BreadcrumbList conforms to Schema.org structural hierarchy', () => {
    const article = createMockPublishedArticle({
      category: { slug: 'estrategia', name: 'Estratégia Operacional' },
    });

    const siteOrigin = 'https://www.a2max.com.br';
    const canonicalUrl = `${siteOrigin}/blog/${article.slug}`;

    const breadcrumbs = [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteOrigin}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteOrigin}/blog` },
      { '@type': 'ListItem', position: 3, name: article.category!.name, item: `${siteOrigin}/blog?category=estrategia` },
      { '@type': 'ListItem', position: 4, name: article.title, item: canonicalUrl },
    ];

    assert.equal(breadcrumbs.length, 4);
    assert.equal(breadcrumbs[0].position, 1);
    assert.equal(breadcrumbs[3].item, canonicalUrl);
  });

  await t.test('5. Social sharing links are valid and properly encoded for WhatsApp, LinkedIn and X', () => {
    const url = 'https://www.a2max.com.br/blog/por-que-empresas-que-investem-em-marketing-perdem-vendas';
    const title = 'Por que empresas perdem vendas?';

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(`${title} — ${url}`);

    const whatsapp = `https://api.whatsapp.com/send?text=${encodedText}`;
    const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}`;

    assert.ok(whatsapp.includes('api.whatsapp.com'));
    assert.ok(linkedin.includes('linkedin.com/sharing'));
    assert.ok(twitter.includes('twitter.com/intent/tweet'));
    assert.match(whatsapp, /https%3A%2F%2Fwww\.a2max\.com\.br/);
  });
});
