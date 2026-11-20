import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  validateOrganicConfig,
  createOrganicClient,
  getSiteOrigin,
  DEFAULT_OG_IMAGE,
  getRobotsMetadata,
  type PublicArticleSummaryDTO,
  type PublicCategoryDTO,
} from "@/lib/organic";

const origin = getSiteOrigin();

export const metadata: Metadata = {
  title: "Blog & Inteligência | A2Max — Performance e Inteligência de Negócios",
  description:
    "Análises aprofundadas, metodologia prática e inteligência sobre estratégia, aquisição orgânica, automação e alta performance empresarial.",
  alternates: {
    canonical: `${origin}/blog`,
  },
  openGraph: {
    title: "Blog & Inteligência | A2Max — Performance e Inteligência de Negócios",
    description:
      "Artigos estratégicos sobre processos, aquisição, tecnologia e dados para operações corporativas de alta performance.",
    type: "website",
    url: `${origin}/blog`,
    siteName: "A2Max — Performance e Inteligência de Negócios",
    locale: "pt_BR",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Blog & Inteligência | A2Max",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Inteligência | A2Max — Performance e Inteligência de Negócios",
    description:
      "Artigos estratégicos sobre processos, aquisição, tecnologia e dados para operações corporativas de alta performance.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: getRobotsMetadata(),
};

interface BlogData {
  articles: PublicArticleSummaryDTO[];
  total: number;
  categories: PublicCategoryDTO[];
  error?: string;
}

async function fetchBlogData(): Promise<BlogData> {
  try {
    const config = validateOrganicConfig();
    const client = createOrganicClient(config);

    const [articlesRes, categories] = await Promise.all([
      client.getArticles({ limit: 12 }).catch((err) => {
        console.error("[A2Max Blog] Erro ao carregar artigos:", err);
        return { articles: [], total: 0, limit: 12, offset: 0 };
      }),
      client.getCategories().catch((err) => {
        console.error("[A2Max Blog] Erro ao carregar categorias:", err);
        return [];
      }),
    ]);

    return {
      articles: articlesRes.articles || [],
      total: articlesRes.total || 0,
      categories: categories || [],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.warn("[A2Max Blog] Cliente Organic em modo inicial:", message);
    return {
      articles: [],
      total: 0,
      categories: [],
      error: message,
    };
  }
}

function formatDate(isoString?: string): string {
  if (!isoString) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(isoString));
  } catch {
    return "";
  }
}

export default async function BlogPage() {
  const { articles, categories, error } = await fetchBlogData();
  const hasArticles = articles.length > 0;
  const [featuredArticle, ...regularArticles] = articles;

  return (
    <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
      {/* Header Institucional adaptado para modo claro */}
      <Header variant="light" />

      <main className="flex-1 pt-10 pb-20 md:pt-14 md:pb-28">
        <div className="mx-auto max-w-[1340px] px-6 md:px-12">
          {/* Breadcrumb Editorial */}
          <nav aria-label="Navegação estrutural" className="mb-8">
            <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
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
              <li aria-current="page" className="text-[#FF8A00]">
                Blog & Inteligência
              </li>
            </ol>
          </nav>

          {/* Cabeçalho Editorial com Hierarquia Tipográfica Forte */}
          <header className="mb-14 md:mb-18 max-w-4xl border-b border-[#0B1220]/10 pb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF8A00]/40 bg-[#FF8A00]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#FF8A00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00] animate-pulse" />
              Publicações & Conteúdo Estratégico
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0B1220] leading-[1.12]">
              Inteligência e método para operações de{" "}
              <span className="text-[#FF8A00]">alta performance</span>.
            </h1>

            <p className="mt-6 text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Análises aplicadas, processos de escala, arquitetura de aquisição orgânica
              e governança de dados para negócios que buscam eficiência de capital e crescimento previsível.
            </p>
          </header>

          {/* Filtros de Categorias (visíveis quando existirem dados reais no backend) */}
          {categories.length > 0 && (
            <section aria-label="Filtro de categorias" className="mb-12">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1220] mr-2">
                  Eixos:
                </span>
                <span className="rounded-full bg-[#0B1220] px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
                  Todos
                </span>
                {categories.map((cat) => (
                  <span
                    key={cat.slug}
                    className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-[#FF8A00] hover:text-[#FF8A00] cursor-pointer"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* CENÁRIO 1: Quando houver artigos publicados da A2Max */}
          {hasArticles && (
            <div className="space-y-16">
              {/* Artigo Destaque Principal */}
              {featuredArticle && (
                <section aria-label="Artigo em destaque" className="relative">
                  <Link href={`/blog/${featuredArticle.slug}`} className="block focus:outline-none">
                    <article className="group grid grid-cols-1 gap-8 rounded-2xl border border-slate-200/90 bg-white p-6 md:p-8 lg:grid-cols-12 lg:gap-10 shadow-sm transition-all hover:shadow-md hover:border-[#FF8A00]/50">
                      {featuredArticle.cover && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 lg:col-span-7">
                          <Image
                            src={featuredArticle.cover.url}
                            alt={featuredArticle.cover.alt || featuredArticle.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                          />
                        </div>
                      )}
                      <div
                        className={`flex flex-col justify-center ${featuredArticle.cover ? "lg:col-span-5" : "lg:col-span-12"
                          }`}
                      >
                        <div className="mb-4 flex items-center gap-3 text-xs text-slate-500">
                          {featuredArticle.category && (
                            <span className="rounded bg-[#FF8A00]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FF8A00]">
                              {featuredArticle.category.name}
                            </span>
                          )}
                          {featuredArticle.readingTime && (
                            <span>{featuredArticle.readingTime} min de leitura</span>
                          )}
                          {featuredArticle.publishedAt && (
                            <span>• {formatDate(featuredArticle.publishedAt)}</span>
                          )}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-[#0B1220] group-hover:text-[#FF8A00] transition-colors leading-snug">
                          {featuredArticle.title}
                        </h2>

                        {featuredArticle.excerpt && (
                          <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
                            {featuredArticle.excerpt}
                          </p>
                        )}

                        <div className="mt-6 flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
                            Ler artigo completo &rarr;
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </section>
              )}

              {/* Grade de Artigos Secundários */}
              {regularArticles.length > 0 && (
                <section aria-label="Lista de artigos recentes">
                  <h3 className="mb-8 text-xl md:text-2xl font-bold tracking-tight text-[#0B1220]">
                    Publicações Recentes
                  </h3>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {regularArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/blog/${article.slug}`}
                        className="block focus:outline-none"
                      >
                        <article className="group flex flex-col h-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#FF8A00]/50">
                          {article.cover ? (
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                              <Image
                                src={article.cover.url}
                                alt={article.cover.alt || article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-100 via-slate-50 to-white p-6 flex items-end border-b border-slate-100">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
                                {article.category?.name || "Artigo"}
                              </span>
                            </div>
                          )}

                          <div className="flex flex-1 flex-col p-6">
                            <div className="mb-3 flex items-center gap-2 text-[11px] text-slate-500">
                              {article.category && (
                                <span className="font-bold text-[#FF8A00] uppercase">
                                  {article.category.name}
                                </span>
                              )}
                              {article.readingTime && (
                                <span>• {article.readingTime} min</span>
                              )}
                            </div>

                            <h4 className="text-lg font-bold text-[#0B1220] group-hover:text-[#FF8A00] transition-colors line-clamp-2 leading-snug">
                              {article.title}
                            </h4>

                            {article.excerpt && (
                              <p className="mt-3 flex-1 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                                {article.excerpt}
                              </p>
                            )}

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                              <span>{formatDate(article.publishedAt)}</span>
                              <span className="font-bold text-[#FF8A00]">
                                Ler &rarr;
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* CENÁRIO 2: Estado Vazio Editorial no Tema Claro (Estado Real Atual) */}
          {!hasArticles && (
            <section
              aria-label="Status editorial em preparação"
              className="mx-auto max-w-4xl rounded-2xl border border-slate-200/90 bg-white p-8 md:p-14 shadow-sm"
            >
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#FF8A00]">
                  <span className="h-2 w-2 rounded-full bg-[#FF8A00] animate-ping" />
                  Curadoria & Produção Ativa
                </span>

                <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-[#0B1220]">
                  Nossos primeiros artigos estratégicos estão em fase de finalização.
                </h2>

                <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
                  A equipe de especialistas da A2Max está estruturando conteúdos aprofundados sobre metodologia operacional,
                  aquisição sustentável de clientes e inteligência de gestão sem dependência de tráfego pago predatório.
                </p>
              </div>

              {/* 3 Pilares Editoriais Planejados em Cards Claros com Bom Contraste */}
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200/80 bg-[#F5F3EC]/50 p-6 text-left transition-colors hover:border-[#FF8A00]/50 hover:bg-[#F5F3EC]/80">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#FF8A00] font-bold text-sm shadow-2xs">
                    01
                  </div>
                  <h3 className="text-base font-bold text-[#0B1220]">
                    Diagnóstico & Estratégia
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Identificação de gargalos operacionais e oportunidades reais de receita antes de investimentos em software ou mídia.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-[#F5F3EC]/50 p-6 text-left transition-colors hover:border-[#FF8A00]/50 hover:bg-[#F5F3EC]/80">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#FF8A00] font-bold text-sm shadow-2xs">
                    02
                  </div>
                  <h3 className="text-base font-bold text-[#0B1220]">
                    Aquisição Orgânica
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Arquitetura de canais proprietários, SEO programático e distribuição editorial orientada à conversão qualificada.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-[#F5F3EC]/50 p-6 text-left transition-colors hover:border-[#FF8A00]/50 hover:bg-[#F5F3EC]/80">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#FF8A00] font-bold text-sm shadow-2xs">
                    03
                  </div>
                  <h3 className="text-base font-bold text-[#0B1220]">
                    Método A.C.T.I.O.N.
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Auditoria e Análise, Construção, Tráfego e Conversão, Inteligência e Dados, Operação e Rotina, e Nurturing e Expansão aplicados a operações de alta complexidade.
                  </p>
                </div>
              </div>

              {/* Box de Ação Contextual no Estado Vazio */}
              <div className="mt-12 rounded-xl border border-[#FF8A00]/30 bg-gradient-to-r from-[#FF8A00]/10 via-[#FF8A00]/5 to-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-2xs">
                <div>
                  <h4 className="text-base md:text-lg font-bold text-[#0B1220]">
                    Deseja acelerar os resultados da sua empresa hoje?
                  </h4>
                  <p className="mt-1 text-xs md:text-sm text-slate-600">
                    Conheça nosso processo de diagnóstico e mapeie pontos críticos da sua operação.
                  </p>
                </div>

                <Link
                  href="/#diagnostico"
                  className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded bg-[#FF8A00] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#E67A00] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2"
                >
                  Diagnóstico Empresarial &rarr;
                </Link>
              </div>

              {error && (
                <p className="mt-6 text-center text-[11px] text-slate-400">
                  Status de conexão: API de Conteúdo conectada em modo inicial.
                </p>
              )}
            </section>
          )}

          {/* Banner Institucional de Conversão no Rodapé da Página (Tema Claro Refinado) */}
          <section
            aria-label="Convite para diagnóstico institucional"
            className="mt-16 md:mt-24 rounded-2xl border border-slate-200/90 bg-white p-8 md:p-14 text-center shadow-sm relative overflow-hidden"
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF8A00]">
                A2Max Business & Performance
              </span>

              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#0B1220] leading-tight">
                Transforme dados e processos em receita consistente.
              </h2>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Descubra como o ecossistema de soluções da A2Max pode integrar estratégia, tecnologia e operação
                para alavancar os indicadores mais importantes do seu negócio.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#diagnostico"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-[#FF8A00] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#E67A00] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2"
                >
                  Solicitar Diagnóstico &rarr;
                </Link>
                <Link
                  href="/#solucoes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0B1220] transition-colors hover:border-[#FF8A00] hover:text-[#FF8A00] focus:outline-none"
                >
                  Conhecer Soluções
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Institucional Escuro de Alto Contraste */}
      <Footer />
    </div>
  );
}
