import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
      <Header variant="light" />

      <main className="flex-1 flex items-center justify-center px-6 py-20 md:py-32">
        <div className="mx-auto max-w-xl text-center rounded-2xl border border-slate-200/90 bg-white p-8 md:p-14 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#FF8A00]">
            404 • Artigo Indisponível
          </span>

          <h1 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-[#0B1220]">
            Publicação não encontrada
          </h1>

          <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
            O artigo que você está procurando pode ter sido movido, arquivado ou ainda não foi publicado
            pela equipe editorial da A2Max.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-[#FF8A00] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#E67A00] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2"
            >
              &larr; Voltar para o Blog
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0B1220] transition-colors hover:border-[#FF8A00] hover:text-[#FF8A00] focus:outline-none"
            >
              Ir para o Início
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

