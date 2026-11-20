import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleCoverImage } from "@/components/blog/ArticleCoverImage";
import { SocialShareButtons } from "@/components/blog/SocialShareButtons";
import {
  validateOrganicConfig,
  createOrganicClient,
  verifyConsumerPreviewToken,
  OrganicTimeoutError,
  OrganicAuthError,
  OrganicNetworkError,
  type PublicArticleDTO,
} from "@/lib/organic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PreviewPageProps {
  searchParams: Promise<{
    token?: string;
    contentId?: string;
    returnUrl?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Preview Editorial (Rascunho) | Blog A2Max",
  description: "Visualização restrita de rascunho editorial. Não indexável.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

function formatDate(isoString?: string): string {
  if (!isoString) return "Não publicado (Rascunho)";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(isoString));
  } catch {
    return "Em edição";
  }
}

export default async function BlogPreviewPage({ searchParams }: PreviewPageProps) {
  const { token, contentId, returnUrl } = await searchParams;

  const config = validateOrganicConfig();
  const defaultEditorUrl = `http://localhost:3000/control/content/${contentId || ""}`;
  const editorUrl = returnUrl || defaultEditorUrl;

  // 1. Validate Token Cryptographically & Check Publication Scoping
  const verification = verifyConsumerPreviewToken(
    token,
    config.publicationId,
    config.previewSecret
  );

  if (!verification.valid) {
    return (
      <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
        <Header variant="light" />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-red-200 p-8 shadow-sm text-center space-y-4">
            <div className="inline-flex p-3 bg-red-50 text-red-600 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Preview Editorial Não Autorizado</h1>
            <p className="text-sm text-zinc-600 leading-relaxed">{verification.error}</p>
            <div className="pt-2">
              <a
                href={editorUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                &larr; Voltar ao Control Center
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Resolve Content ID (from token or query param)
  const targetId = contentId || verification.payload.contentId;
  if (!targetId) {
    return (
      <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
        <Header variant="light" />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-amber-200 p-8 shadow-sm text-center space-y-4">
            <h1 className="text-xl font-bold text-zinc-900">Identificador Ausente</h1>
            <p className="text-sm text-zinc-600">Não foi informado o ID do artigo para visualização.</p>
            <a
              href={editorUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1220] text-white font-semibold text-xs"
            >
              &larr; Voltar ao Editor
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 3. Fetch Draft Content via Secure Server-to-Server Preview Endpoint
  const client = createOrganicClient(config);
  let article: PublicArticleDTO | null = null;
  let errorView: {
    title: string;
    description: string;
    showRetry: boolean;
    borderColor: string;
    iconBgColor: string;
    iconTextColor: string;
  } | null = null;

  try {
    article = await client.getPreviewArticle(targetId, token!);
    if (!article) {
      errorView = {
        title: "Artigo Não Encontrado no Preview",
        description: "O artigo solicitado não foi localizado no repositório editorial de preview ou foi excluído.",
        showRetry: false,
        borderColor: "border-zinc-200",
        iconBgColor: "bg-zinc-100",
        iconTextColor: "text-zinc-600",
      };
    }
  } catch (err: unknown) {
    if (err instanceof OrganicTimeoutError) {
      errorView = {
        title: "Pré-Visualização Temporariamente Indisponível",
        description: "Não foi possível carregar a pré-visualização neste momento. Tente novamente.",
        showRetry: true,
        borderColor: "border-amber-200",
        iconBgColor: "bg-amber-50",
        iconTextColor: "text-amber-600",
      };
    } else if (err instanceof OrganicAuthError) {
      errorView = {
        title: "Preview Editorial Não Autorizado",
        description: "O token de autorização expirou ou não possui permissão para acessar esta publicação.",
        showRetry: false,
        borderColor: "border-red-200",
        iconBgColor: "bg-red-50",
        iconTextColor: "text-red-600",
      };
    } else if (err instanceof OrganicNetworkError) {
      errorView = {
        title: "Falha de Conexão com o Editorial",
        description: "Não foi possível conectar ao serviço de pré-visualização no momento. Verifique a conexão e tente novamente.",
        showRetry: true,
        borderColor: "border-amber-200",
        iconBgColor: "bg-amber-50",
        iconTextColor: "text-amber-600",
      };
    } else {
      errorView = {
        title: "Erro ao Carregar Preview",
        description: "Ocorreu uma instabilidade transitória ao processar o artigo para pré-visualização. Tente novamente.",
        showRetry: true,
        borderColor: "border-zinc-200",
        iconBgColor: "bg-zinc-100",
        iconTextColor: "text-zinc-600",
      };
    }
  }

  if (errorView || !article) {
    const errorInfo = errorView || {
      title: "Artigo Não Encontrado no Preview",
      description: "O artigo solicitado não foi localizado no repositório editorial de preview ou foi excluído.",
      showRetry: false,
      borderColor: "border-zinc-200",
      iconBgColor: "bg-zinc-100",
      iconTextColor: "text-zinc-600",
    };
    const retryUrl = `/blog/preview?token=${encodeURIComponent(token || "")}&contentId=${encodeURIComponent(targetId || "")}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ""}`;

    return (
      <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
        <Header variant="light" />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className={`w-full max-w-lg bg-white rounded-2xl border ${errorInfo.borderColor} p-8 shadow-sm text-center space-y-4`}>
            <div className={`inline-flex p-3 ${errorInfo.iconBgColor} ${errorInfo.iconTextColor} rounded-full`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">{errorInfo.title}</h1>
            <p className="text-sm text-zinc-600 leading-relaxed">{errorInfo.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {errorInfo.showRetry && (
                <a
                  href={retryUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#e67c00] text-[#0B1220] font-bold text-xs transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tentar Novamente
                </a>
              )}
              <a
                href={editorUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                &larr; Voltar ao Editor
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
      {/* Barra de Aviso de Preview Editorial */}
      <div className="sticky top-0 z-50 bg-[#0B1220] text-white px-4 py-2.5 shadow-md border-b-2 border-[#FF8A00]">
        <div className="mx-auto max-w-[1200px] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#FF8A00] text-[#0B1220]">
              PREVIEW EDITORIAL • {article.status || "DRAFT"}
            </span>
            <span className="text-slate-300 font-medium hidden md:inline">
              Layout real do Blog A2Max. Não indexado por mecanismos de busca e inacessível ao público.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={editorUrl}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/20 flex items-center gap-1.5"
            >
              <span>&larr;</span>
              <span>Voltar ao Editor</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header Institucional com tema claro */}
      <Header variant="light" />

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
                <li aria-hidden="true" className="text-slate-300">
                  /
                </li>
                <li className="text-amber-700 font-bold">Preview</li>
              </ol>
            </nav>

            <a
              href={editorUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF8A00] hover:text-[#E67A00] transition-colors"
            >
              &larr; Voltar para a Edição
            </a>
          </div>

          {/* Cabeçalho do Artigo */}
          <header className="mx-auto max-w-4xl text-center md:text-left mb-10 md:mb-14">
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
              <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-300">
                Rascunho
              </span>
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
                <span className="block">Estado editorial</span>
                <span className="font-semibold text-amber-700">
                  {article.status || "DRAFT"} ({formatDate(article.publishedAt)})
                </span>
              </div>
            </div>

            {/* Simulação de Compartilhamento Social (Preview) */}
            <div className="mt-6 pt-4 border-t border-[#0B1220]/5">
              <SocialShareButtons
                url={`https://www.a2max.com.br/blog/${article.slug}`}
                title={article.title}
              />
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

              {/* Simulação de Compartilhamento Social (Rodapé) */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <SocialShareButtons
                  url={`https://www.a2max.com.br/blog/${article.slug}`}
                  title={article.title}
                />
              </div>
            </article>
          </div>

          {/* Banner de Rodapé para Retorno */}
          <div className="mx-auto max-w-4xl mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
            <p className="text-xs text-amber-900 font-semibold">
              Fim da visualização de rascunho editorial. Pronto para submeter ou realizar ajustes?
            </p>
            <div>
              <a
                href={editorUrl}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                &larr; Retornar à Tela de Edição no Control Center
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

