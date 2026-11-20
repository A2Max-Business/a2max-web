import Image from "next/image";
import Link from "next/link";
import {
  validateOrganicConfig,
  createOrganicClient,
  type PublicShowcaseArticleDTO,
} from "@/lib/organic";
import { isValidCover } from "@/lib/organic/cover";

interface BlogShowcaseSectionProps {
  /**
   * Optional injected articles (useful for testing and deterministic preview).
   */
  initialArticles?: PublicShowcaseArticleDTO[];
}

async function fetchShowcaseArticles(): Promise<PublicShowcaseArticleDTO[]> {
  try {
    const config = validateOrganicConfig();
    const client = createOrganicClient(config);
    return await client.getShowcaseArticles(4);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[A2Max BlogShowcase] Falha segura ao carregar vitrine (seção suprimida):", message);
    return [];
  }
}

function formatDate(isoDate?: string): string {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

/**
 * BlogShowcaseSection — Server Component
 * Vitrine editorial conectada à API do A2 Organic Acquisition.
 * Exibe até 4 matérias selecionadas e destacadas no Control Center.
 * Se não houver artigos publicados ou ocorrer falha de rede, retorna estritamente null.
 */
export async function BlogShowcaseSection({ initialArticles }: BlogShowcaseSectionProps = {}) {
  const articles = initialArticles !== undefined
    ? initialArticles
    : await fetchShowcaseArticles();

  // Se não houver matérias publicadas na vitrine, suprime a seção completamente
  if (!articles || articles.length === 0) {
    return null;
  }

  // Clampa em até 4 artigos
  const displayArticles = articles.slice(0, 4);

  // Layout responsivo proporcional à quantidade de artigos
  const gridLayoutClass =
    displayArticles.length === 1
      ? "max-w-xl mx-auto grid-cols-1"
      : displayArticles.length === 2
      ? "max-w-4xl mx-auto grid-cols-1 md:grid-cols-2"
      : displayArticles.length === 3
      ? "max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section
      id="blog-vitrine"
      aria-labelledby="blog-showcase-heading"
      className="relative w-full bg-[#0B1220] text-white overflow-hidden scroll-mt-20 py-20 sm:py-24 lg:py-28 border-y border-white/10"
    >
      {/* Background Decorativo Sutil com gradiente âmbar/laranja */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#FF8A00]/5 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#FF8A00]/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Cabeçalho da Seção */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FF8A00]/40 bg-[#FF8A00]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#FF8A00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00] animate-pulse" />
              Inteligência &amp; Estratégia
            </div>
            <h2
              id="blog-showcase-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]"
            >
              Visão editorial e método para operações de{" "}
              <span className="text-[#FF8A00]">alta performance</span>.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#F5F3EC]/80 leading-relaxed max-w-2xl">
              Análises aprofundadas sobre governança, automação, processos comerciais e aquisição orgânica produzidas pelo time executivo da A2Max.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded border border-[#FF8A00] bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#FF8A00] transition-colors hover:bg-[#FF8A00] hover:text-[#0B1220] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
            >
              <span>Ver todo o Blog</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Grade Responsiva de Artigos */}
        <div className={`grid gap-6 lg:gap-8 ${gridLayoutClass}`}>
          {displayArticles.map((article) => {
            const hasValidCover = isValidCover(article.cover);
            const formattedDate = formatDate(article.publishedAt);

            return (
              <article
                key={article.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0F182A] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#FF8A00]/60 hover:shadow-2xl hover:shadow-[#FF8A00]/10"
              >
                {/* Imagem de Capa ou Fallback Visual Seguro */}
                <Link
                  href={`/blog/${article.slug}`}
                  className="relative aspect-[16/9] w-full overflow-hidden bg-[#070B14] block"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {hasValidCover && article.cover ? (
                    <Image
                      src={article.cover.url}
                      alt={article.cover.alt || article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0B1220] to-[#172033] border-b border-white/5">
                      <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 border border-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00] mb-2">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5F3EC]/50">
                        A2Max Editorial
                      </span>
                    </div>
                  )}

                  {/* Badge de Posição / Categoria sobreposto */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {article.category?.name && (
                      <span className="rounded-md bg-[#0B1220]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF8A00] border border-white/10">
                        {article.category.name}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Conteúdo do Card */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Metadados: Data e Tempo de Leitura */}
                    <div className="mb-3 flex items-center gap-2 text-xs text-[#F5F3EC]/60">
                      {formattedDate && <span>{formattedDate}</span>}
                      {formattedDate && article.readingTime && <span>•</span>}
                      {article.readingTime && (
                        <span>{article.readingTime} min de leitura</span>
                      )}
                    </div>

                    {/* Título com Link */}
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#FF8A00] line-clamp-2 leading-snug">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {/* Resumo */}
                    {article.excerpt && (
                      <p className="mt-3 text-xs sm:text-sm text-[#F5F3EC]/70 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Rodapé do Card com CTA */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-[#F5F3EC]/50 font-medium">
                      Por {article.author?.name || "Redação A2Max"}
                    </span>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF8A00] hover:text-[#FFA033] transition-colors"
                      aria-label={`Ler artigo completo: ${article.title}`}
                    >
                      <span>Ler mais</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Botão Mobile para Acesso ao Blog */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex w-full items-center justify-center gap-2 rounded border border-[#FF8A00] bg-[#FF8A00]/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#FF8A00] transition-colors hover:bg-[#FF8A00] hover:text-[#0B1220]"
          >
            <span>Acessar todo o acervo do Blog</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
