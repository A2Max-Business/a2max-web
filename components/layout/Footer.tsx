import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#070B12] text-white border-t border-white/10 pt-16 sm:pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Principal de Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Coluna 1: Marca, Posicionamento e Assinatura */}
          <div className="lg:col-span-5 space-y-6">
            <Link
              href="/"
              className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] rounded-sm"
            >
              <Image
                src="/logos/a2max-darkmode.png"
                alt="A2Max — Performance e Inteligência de Negócios"
                width={170}
                height={48}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-sm font-semibold text-[#FF8A00] tracking-wide max-w-sm">
              Inteligência move decisões. Performance entrega resultados.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Estratégia, processos, aquisição, tecnologia e dados trabalhando juntos
              para transformar negócios em operações de alta performance.
            </p>
          </div>

          {/* Coluna 2: Navegação Institucional */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link
                  href="/#a-a2max"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  A A2Max
                </Link>
              </li>
              <li>
                <Link
                  href="/#action"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Metodologia A.C.T.I.O.N.
                </Link>
              </li>
              <li>
                <Link
                  href="/#solucoes"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Soluções Estruturadas
                </Link>
              </li>
              <li>
                <Link
                  href="/#resultados"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Resultados & Evidências
                </Link>
              </li>
              <li>
                <Link
                  href="/#inteligencia"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Ecossistema & Especialidades
                </Link>
              </li>
              <li>
                <Link
                  href="/#diagnostico"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Diagnóstico Empresarial
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Blog & Inteligência
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Especialidades de Mercado */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              Especialidades
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link
                  href="#inteligencia"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Eventos & Entretenimento
                </Link>
              </li>
              <li>
                <Link
                  href="#inteligencia"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Auto Centers & Automotivo
                </Link>
              </li>
              <li>
                <Link
                  href="#inteligencia"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Negócios Locais
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Ecossistema Tecnológico */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              Ecossistema
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link
                  href="#inteligencia"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  A2Tickets360
                </Link>
              </li>
              <li>
                <Link
                  href="#inteligencia"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  A2Sports360
                </Link>
              </li>
              <li>
                <Link
                  href="#inteligencia"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  EuAttendo
                </Link>
              </li>
              <li>
                <Link
                  href="#inteligencia"
                  className="hover:text-[#FF8A00] transition-colors focus:outline-none focus:text-[#FF8A00]"
                >
                  Integrações & Automação
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Inferior com Assinatura e Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} A2Max. Todos os direitos reservados.</p>
          <p className="text-slate-500">
            Performance e Inteligência de Negócios
          </p>
        </div>
      </div>
    </footer>
  );
}
