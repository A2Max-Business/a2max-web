import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleCoverImage } from "@/components/blog/ArticleCoverImage";
import { SocialShareButtons } from "@/components/blog/SocialShareButtons";
import {
  validateOrganicConfig,
  createOrganicClient,
  getSiteOrigin,
  resolveAbsoluteSocialImage,
  getRobotsMetadata,
  type PublicArticleDTO,
} from "@/lib/organic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Cached article fetcher shared between generateMetadata and ArticlePage.
 * Automatically deduplicated by React during the same server render.
 */
const getArticle = cache(async (slug: string): Promise<PublicArticleDTO | null> => {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  try {
    const config = validateOrganicConfig();
    const client = createOrganicClient(config);
    return await client.getArticleBySlug(slug);
  } catch (err) {
    console.error(`[A2Max Blog] Erro ao buscar artigo "${slug}":`, err);
    return null;
  }
});

function formatDate(isoString?: string): string {
  if (!isoString) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(isoString));
  } catch {
    return "";
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Artigo não encontrado | Blog A2Max",
      description: "O artigo solicitado não foi encontrado ou não está mais disponível.",
      robots: getRobotsMetadata({ forceNoIndex: true }),
    };
  }

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = article.canonical || article.seo?.canonicalUrl || `${siteOrigin}/blog/${article.slug}`;
  const title = article.seo?.title || `${article.title} | Blog A2Max`;
  const description = article.seo?.metaDescription || article.excerpt;
  const rawOgImage = article.cover?.url || article.social?.imageUrl || article.seo?.ogImage;
  const ogImageUrl = resolveAbsoluteSocialImage(rawOgImage, siteOrigin);
  const ogImageAlt = article.cover?.alt || article.social?.imageAlt || article.title;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: getRobotsMetadata({ forceNoIndex: Boolean(article.preview) }),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "A2Max — Performance e Inteligência de Negócios",
      locale: "pt_BR",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: [
        {
          url: ogImageUrl,
          width: article.cover?.width || 1200,
          height: article.cover?.height || 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = article.canonical || article.seo?.canonicalUrl || `${siteOrigin}/blog/${article.slug}`;
  const rawOgImage = article.cover?.url || article.social?.imageUrl || article.seo?.ogImage;
  const ogImageUrl = resolveAbsoluteSocialImage(rawOgImage, siteOrigin);

  // JSON-LD: Schema.org Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo?.metaDescription || article.excerpt,
    inLanguage: "pt-BR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    image: ogImageUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author?.name || "Redação A2Max",
      jobTitle: article.author?.role || undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "A2Max",
      url: siteOrigin,
      logo: {
        "@type": "ImageObject",
        url: `${siteOrigin}/logos/a2max-lightmode.png`,
      },
    },
  };

  // JSON-LD: Schema.org BreadcrumbList
  const breadcrumbElements = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: `${siteOrigin}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${siteOrigin}/blog`,
    },
  ];

  if (article.category) {
    breadcrumbElements.push({
      "@type": "ListItem",
      position: 3,
      name: article.category.name,
      item: `${siteOrigin}/blog?category=${encodeURIComponent(article.category.slug)}`,
    });
    breadcrumbElements.push({
      "@type": "ListItem",
      position: 4,
      name: article.title,
      item: canonicalUrl,
    });
  } else {
    breadcrumbElements.push({
      "@type": "ListItem",
      position: 3,
      name: article.title,
      item: canonicalUrl,
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbElements,
  };

  return (
    <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
      {/* Header Institucional com tema claro */}
      <Header variant="light" />

      {/* JSON-LD Schemas de SEO Estruturado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="flex-1 pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          {/* Breadcrumb & Link Voltar */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#0B1220]/10 pb-4">
            <nav aria-label="Navegação estrutural">
              <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-[#FF8A00] focus:text-[#FF8A00] outline-none"
                  >
                    Início
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-300">
                  /
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-[#FF8A00] focus:text-[#FF8A00] outline-none"
                  >
                    Blog
                  </Link>
                </li>
                {article.category && (
                  <>
                    <li aria-hidden="true" className="text-slate-300">
                      /
                    </li>
                    <li className="text-slate-500">{article.category.name}</li>
                  </>
                )}
              </ol>
            </nav>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF8A00] hover:text-[#E67A00] transition-colors"
            >
              &larr; Voltar para o Blog
            </Link>
          </div>

          {/* Cabeçalho do Artigo */}
          <header className="mx-auto max-w-4xl text-center md:text-left mb-8 md:mb-12">
            <div className="mb-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {article.category && (
                <span className="rounded-full bg-[#FF8A00]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
                  {article.category.name}
                </span>
              )}
              {article.readingTime && (
                <span className="text-xs font-medium text-slate-500">
                  • {article.readingTime} min de leitura
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#0B1220] leading-[1.18]">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
                {article.subtitle}
              </p>
            )}

            {/* Byline do Autor e Data */}
            <div className="mt-8 pt-6 border-t border-[#0B1220]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                {article.author?.avatarUrl ? (
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-300">
                    <Image
                      src={article.author.avatarUrl}
                      alt={article.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1220] text-xs font-bold text-white uppercase shadow-sm">
                    {article.author?.name ? article.author.name.charAt(0) : "A"}
                  </div>
                )}
                <div className="text-left">
                  <span className="block text-sm font-bold text-[#0B1220]">
                    {article.author?.name || "Redação A2Max"}
                  </span>
                  <span className="text-slate-500">
                    {article.author?.role || "Inteligência & Performance"}
                  </span>
                </div>
              </div>

              <div className="sm:text-right text-slate-500">
                <span className="block">Publicado em</span>
                <span className="font-semibold text-[#0B1220]">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
            </div>

            {/* Social Share Buttons (Topo da Leitura) */}
            <div className="mt-6 pt-4 border-t border-[#0B1220]/5">
              <SocialShareButtons url={canonicalUrl} title={article.title} />
            </div>
          </header>

          {/* Imagem de Capa (Proporção Editorial 1200x630 com Responsividade — Renderizada somente se válida) */}
          <ArticleCoverImage
            cover={article.cover}
            fallbackAlt={article.title}
            priority
          />

          {/* Coluna Central de Leitura com Fundo Branco Confortável */}
          <div className="mx-auto max-w-4xl">
            <article className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 md:p-16 shadow-sm">
              <ArticleBody
                content={article.body}
                articleTitle={article.title}
                suppressDuplicateTitle={true}
              />

              {/* Tags do Artigo (se existirem) */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
                    Temas relacionados:
                  </span>
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-[#F5F3EC] px-3 py-1 text-xs font-medium text-[#0B1220] border border-slate-200/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Share Buttons (Fim da Matéria) */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <SocialShareButtons url={canonicalUrl} title={article.title} />
              </div>
            </article>
          </div>

          {/* CTA Comercial ao Final do Artigo */}
          <section
            aria-label="Diagnóstico da sua operação"
            className="mx-auto max-w-4xl mt-12 rounded-2xl border border-[#FF8A00]/30 bg-gradient-to-r from-[#FF8A00]/10 via-[#FF8A00]/5 to-white p-8 md:p-12 shadow-sm text-left flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF8A00]">
                Aceleração & Performance Operacional
              </span>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#0B1220]">
                Gostou deste conteúdo? Mapeie os gargalos da sua operação.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Descubra como o Método A.C.T.I.O.N. e o ecossistema da A2Max integram estratégia,
                tecnologia e processos para alavancar sua receita com eficiência.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
              <Link
                href="/#diagnostico"
                className="inline-flex items-center justify-center gap-2 rounded bg-[#FF8A00] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#E67A00] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 text-center"
              >
                Solicitar Diagnóstico &rarr;
              </Link>
              <Link
                href="/#solucoes"
                className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#0B1220] transition-colors hover:border-[#FF8A00] hover:text-[#FF8A00] focus:outline-none text-center"
              >
                Conhecer Soluções
              </Link>
            </div>
          </section>

          {/* Artigos Relacionados (Aparece SOMENTE quando houver dados reais de recomendação) */}
          {article.related && article.related.length > 0 && (
            <section
              aria-label="Artigos recomendados"
              className="mx-auto max-w-4xl mt-16 pt-12 border-t border-[#0B1220]/10"
            >
              <h3 className="text-2xl font-bold tracking-tight text-[#0B1220] mb-8">
                Continue lendo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {article.related.map((rel) => (
                  <article
                    key={rel.slug}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#FF8A00]/50"
                  >
                    <div className="flex flex-1 flex-col p-6">
                      {rel.category && (
                        <span className="text-[11px] font-bold text-[#FF8A00] uppercase mb-2">
                          {rel.category.name}
                        </span>
                      )}
                      <h4 className="text-base font-bold text-[#0B1220] group-hover:text-[#FF8A00] transition-colors line-clamp-2">
                        <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      {rel.excerpt && (
                        <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      )}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{formatDate(rel.publishedAt)}</span>
                        <span className="font-bold text-[#FF8A00]">Ler &rarr;</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer Institucional Escuro Preservado */}
      <Footer />
    </div>
  );
}
