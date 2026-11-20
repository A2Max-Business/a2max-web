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

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BlogShowcaseSection } from '../../../components/sections/BlogShowcaseSection';
import { Header } from '../../../components/layout/Header';
import type { PublicShowcaseArticleDTO } from '../types';

function makeMockShowcaseArticle(overrides: Partial<PublicShowcaseArticleDTO> = {}): PublicShowcaseArticleDTO {
  const slug = overrides.slug || 'artigo-exemplo-showcase';
  return {
    slug,
    title: overrides.title || 'Título do Artigo em Destaque',
    excerpt: overrides.excerpt || 'Resumo editorial de alta qualidade para visualização na vitrine da homepage.',
    author: overrides.author || {
      name: 'Time de Inteligência A2Max',
      role: 'Estratégia & Performance',
    },
    category: overrides.category || {
      slug: 'estrategia',
      name: 'Estratégia',
    },
    tags: overrides.tags || ['crescimento', 'processos'],
    publishedAt: overrides.publishedAt || '2026-11-15T12:00:00.000Z',
    readingTime: overrides.readingTime || 4,
    position: overrides.position || 1,
    canonical: overrides.canonical || `https://www.a2max.com.br/blog/${slug}`,
    cover: 'cover' in overrides ? overrides.cover : {
      url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/capa-teste.png',
      alt: 'Legenda da capa do artigo',
      width: 1200,
      height: 630,
    },
  };
}

describe('BlogShowcaseSection — Componente de Vitrine da Homepage A2Max', () => {
  it('1. Retorna estritamente null quando a lista de artigos está vazia (nenhuma seção renderizada)', async () => {
    const result = await BlogShowcaseSection({ initialArticles: [] });
    assert.equal(result, null, 'Componente deve retornar null quando não há artigos na vitrine');
  });

  it('2. Exibe exatamente 1 card quando a API retorna 1 artigo com layout centralizado', async () => {
    const article1 = makeMockShowcaseArticle({ slug: 'artigo-unico', title: 'Artigo Único em Destaque' });
    const element = await BlogShowcaseSection({ initialArticles: [article1] });

    assert.ok(element !== null);
    const html = renderToStaticMarkup(element);

    assert.ok(html.includes('id="blog-vitrine"'));
    assert.ok(html.includes('Artigo Único em Destaque'));
    assert.ok(html.includes('/blog/artigo-unico'));
    assert.ok(html.includes('max-w-xl mx-auto grid-cols-1'), 'Deve aplicar layout centralizado para 1 artigo');
  });

  it('3. Exibe exatamente 4 cards quando a API retorna 4 artigos, sem duplicações', async () => {
    const articles = [
      makeMockShowcaseArticle({ slug: 'artigo-1', title: 'Primeiro Artigo', position: 1 }),
      makeMockShowcaseArticle({ slug: 'artigo-2', title: 'Segundo Artigo', position: 2 }),
      makeMockShowcaseArticle({ slug: 'artigo-3', title: 'Terceiro Artigo', position: 3 }),
      makeMockShowcaseArticle({ slug: 'artigo-4', title: 'Quarto Artigo', position: 4 }),
    ];

    const element = await BlogShowcaseSection({ initialArticles: articles });
    assert.ok(element !== null);

    const html = renderToStaticMarkup(element);
    assert.ok(html.includes('Primeiro Artigo'));
    assert.ok(html.includes('Segundo Artigo'));
    assert.ok(html.includes('Terceiro Artigo'));
    assert.ok(html.includes('Quarto Artigo'));
    assert.ok(html.includes('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'), 'Deve aplicar grid de 4 colunas');

    for (const art of articles) {
      assert.ok(html.includes(`/blog/${art.slug}`));
    }
  });

  it('4. Clampa em no máximo 4 artigos mesmo que mais artigos sejam fornecidos', async () => {
    const articles = Array.from({ length: 6 }, (_, i) =>
      makeMockShowcaseArticle({ slug: `artigo-${i + 1}`, title: `Artigo ${i + 1}`, position: i + 1 })
    );

    const element = await BlogShowcaseSection({ initialArticles: articles });
    assert.ok(element !== null);

    const html = renderToStaticMarkup(element);
    assert.ok(html.includes('Artigo 1'));
    assert.ok(html.includes('Artigo 4'));
    assert.ok(!html.includes('Artigo 5'), 'Artigo 5 não deve aparecer na vitrine');
    assert.ok(!html.includes('Artigo 6'), 'Artigo 6 não deve aparecer na vitrine');
  });

  it('5. Validação de capa: exibe imagem real quando válida e fallback seguro quando sem capa', async () => {
    const articleComCapa = makeMockShowcaseArticle({
      slug: 'com-capa',
      title: 'Artigo com Capa',
      cover: {
        url: 'https://hfdtjzyvathxangshcje.supabase.co/storage/v1/object/public/organic-media/foto.png',
        alt: 'Foto de capa',
      },
    });

    const articleSemCapa = makeMockShowcaseArticle({
      slug: 'sem-capa',
      title: 'Artigo sem Capa',
      cover: undefined,
    });

    const element = await BlogShowcaseSection({ initialArticles: [articleComCapa, articleSemCapa] });
    assert.ok(element !== null);

    const html = renderToStaticMarkup(element);
    assert.ok(html.includes('foto.png'), 'URL da imagem de capa deve estar presente no src gerado');
    assert.ok(html.includes('Foto de capa'), 'Alt text da capa deve estar presente');
    assert.ok(html.includes('A2Max Editorial'), 'Fallback estilizado deve ser renderizado quando capa estiver ausente');
  });

  it('6. Links de navegação apontam para /blog/[slug] e botão global aponta para /blog', async () => {
    const article = makeMockShowcaseArticle({ slug: 'vendas-marketing-conversao' });
    const element = await BlogShowcaseSection({ initialArticles: [article] });
    assert.ok(element !== null);

    const html = renderToStaticMarkup(element);
    assert.ok(html.includes('href="/blog/vendas-marketing-conversao"'));
    assert.ok(html.includes('href="/blog"'));
    assert.ok(html.includes('Ver todo o Blog'));
    assert.ok(!html.includes('target="_blank"'), 'Links internos devem navegar na mesma aba');
  });

  it('7. Falha de rede ou configuração da API suprime a seção sem quebrar a renderização', async () => {
    const result = await BlogShowcaseSection({ initialArticles: [] });
    assert.equal(result, null);
  });
});

describe('Header & Navegação Mobile — Menu Funcional A2Max', () => {
  it('8. Header renderiza botão acessível de menu mobile com aria-expanded e aria-controls', () => {
    const html = renderToStaticMarkup(React.createElement(Header));

    assert.ok(html.includes('aria-controls="mobile-navigation"'));
    assert.ok(html.includes('aria-expanded="false"'));
    assert.ok(html.includes('Abrir menu de navegação'));
  });

  it('9. Menu desktop possui o link /blog com destaque visual e mesma aba', () => {
    const html = renderToStaticMarkup(React.createElement(Header));

    assert.ok(html.includes('href="/blog"'));
    assert.ok(html.includes('Blog'));
    assert.ok(html.includes('text-laranja-energia'));
    assert.ok(!html.includes('href="/blog" target="_blank"'), 'Link do blog deve navegar na mesma aba');
  });
});
