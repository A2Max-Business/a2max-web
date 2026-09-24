import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full px-6 py-8 md:px-12 md:py-10">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-laranja-energia focus-visible:ring-offset-2 focus-visible:ring-offset-azul-noite rounded-sm">
            <Image 
              src="/logos/a2max-darkmode.png" 
              alt="A2Max" 
              width={160} 
              height={45} 
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
          <div className="hidden h-12 w-px bg-branco/20 lg:block"></div>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-branco/60 lg:block w-40 leading-relaxed">
            Performance<br />
            e Inteligência<br />
            de Negócios
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-widest text-branco lg:flex">
          <Link href="#a-a2max" className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none">A A2Max</Link>
          <Link href="#action" className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none">A.C.T.I.O.N.</Link>
          <Link href="#solucoes" className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none">Soluções</Link>
          <Link href="#resultados" className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none">Resultados</Link>
          <Link href="#inteligencia" className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none">Inteligência</Link>
        </nav>

        <div className="flex items-center gap-8">
          <Link 
            href="#diagnostico" 
            className="hidden items-center gap-2 rounded border border-laranja-energia px-7 py-3 text-xs font-semibold uppercase tracking-widest text-laranja-energia transition-colors hover:bg-laranja-energia hover:text-azul-noite focus:outline-none focus:ring-2 focus:ring-laranja-energia focus:ring-offset-2 focus:ring-offset-azul-noite lg:flex"
          >
            Diagnóstico <span aria-hidden="true">&rarr;</span>
          </Link>
          
          <button className="group flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-laranja-energia focus:ring-offset-2 focus:ring-offset-azul-noite rounded-sm lg:hidden" aria-label="Abrir menu">
            <span className="h-0.5 w-6 bg-branco transition-all group-hover:bg-laranja-energia"></span>
            <span className="h-0.5 w-6 bg-branco transition-all group-hover:bg-laranja-energia"></span>
            <span className="h-0.5 w-6 bg-branco transition-all group-hover:bg-laranja-energia"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
