import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F3EC] flex flex-col font-sans text-[#0B1220]">
      <Header variant="light" />

      <main className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF8A00]/40 bg-[#FF8A00]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#FF8A00]">
            Erro 404 • Conteúdo Não Encontrado
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0B1220]">
            Página ou artigo <span className="text-[#FF8A00]">não encontrado</span>.
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            O endereço solicitado não existe, foi removido ou ainda não está disponível publicamente.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#FF8A00] text-white font-semibold text-xs tracking-wider uppercase transition-colors hover:bg-[#e67c00]"
            >
              Acessar o Blog
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-xs tracking-wider uppercase transition-colors hover:border-[#FF8A00] hover:text-[#FF8A00]"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
