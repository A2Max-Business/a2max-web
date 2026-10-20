import Link from "next/link";
import { MotionFade, MotionStagger, MotionItem } from "@/components/motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-azul-noite pt-32 pb-12 md:pt-40 md:pb-16">
      {/* 
        1. Background Cinematográfico - Entrada suave (Fade-in 0.9s)
      */}
      <MotionFade
        direction="none"
        duration={0.9}
        delay={0}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet="/images/home/hero/hero-bg-desktop.png" />
          <img 
            src="/images/home/hero/hero-bg-mobile.png" 
            alt="Profissionais em ambiente corporativo integrado, analisando dados e estratégia" 
            className="h-full w-full object-cover object-center opacity-85"
            fetchPriority="high"
          />
        </picture>
        {/* Gradientes para garantir hierarquia e legibilidade do texto no dark mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-azul-noite/95 via-azul-noite/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-azul-noite via-transparent to-azul-noite/30"></div>
      </MotionFade>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 md:px-12">
        
        {/* Conteúdo Principal Centralizado Verticalmente */}
        <div className="flex flex-1 flex-col justify-center max-w-[800px] pt-12 md:pt-0">
          
          {/* Tag de Apresentação */}
          <MotionFade delay={0.15} duration={0.6} distance={10}>
            <span className="mb-6 inline-block text-xs font-bold tracking-[0.15em] text-laranja-energia uppercase md:text-sm">
              Performance e Inteligência de Negócios
            </span>
          </MotionFade>
          
          {/* 
            2. Headline - Revelação progressiva das linhas com deslocamento vertical suave
          */}
          <h1 className="mb-8 text-[2.25rem] font-bold leading-[1.1] text-branco md:text-5xl lg:text-[3.75rem] lg:leading-[1.15]">
            <MotionFade delay={0.3} duration={0.7} distance={12}>
              <span className="block">
                Crescimento não acontece quando uma parte da empresa funciona.
              </span>
            </MotionFade>
            <MotionFade delay={0.45} duration={0.7} distance={12}>
              <span className="block text-laranja-energia">
                Acontece quando o negócio funciona junto.
              </span>
            </MotionFade>
          </h1>
          
          {/* 
            3. Texto Institucional - Leve deslocamento vertical (delay 0.6s)
          */}
          <MotionFade delay={0.6} duration={0.65} distance={10}>
            <p className="mb-12 max-w-2xl text-base font-normal leading-relaxed text-areia-clara md:text-xl">
              Estratégia, processos, aquisição, tecnologia e dados precisam trabalhar na mesma direção. A A2Max conecta essas partes para transformar movimento em performance.
            </p>
          </MotionFade>
          
          {/* 
            4. CTAs em Sequência Escalonada (delays 0.75s e 0.85s)
          */}
          <div className="flex flex-col flex-wrap items-start gap-4 sm:flex-row sm:items-center md:gap-10">
            <MotionFade delay={0.75} duration={0.6} distance={10} className="w-full sm:w-auto">
              <Link 
                href="#diagnostico" 
                className="group flex w-full items-center justify-center gap-3 rounded bg-laranja-energia px-8 py-4 text-sm font-bold uppercase tracking-widest text-azul-noite transition-all hover:bg-laranja-energia/90 focus:outline-none focus:ring-2 focus:ring-laranja-energia focus:ring-offset-2 focus:ring-offset-azul-noite sm:w-auto md:px-10 md:py-4"
              >
                Comece pelo diagnóstico
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
              </Link>
            </MotionFade>
            
            <MotionFade delay={0.85} duration={0.6} distance={10} className="w-full sm:w-auto">
              <Link 
                href="#action" 
                className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-branco transition-colors hover:text-laranja-energia focus:outline-none focus-visible:text-laranja-energia"
              >
                <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-laranja-energia">
                  Conheça o Método A.C.T.I.O.N.
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
              </Link>
            </MotionFade>
          </div>
        </div>

        {/* 
          5. Assinatura Inferior - Pilares revelados escalonadamente por último (delay 0.95s)
        */}
        <div className="mt-auto pt-16 md:pt-24">
          <MotionStagger initialDelay={0.95} staggerDelay={0.08}>
            <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-[9px] font-bold tracking-[0.2em] uppercase text-branco/80 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-4 sm:tracking-[0.25em] md:text-xs">
              <MotionItem distance={8} className="flex items-center gap-2 sm:gap-3">
                <span className="text-laranja-energia" aria-hidden="true">♦</span> ESTRATÉGIA
              </MotionItem>
              <span className="hidden h-px w-8 lg:w-16 bg-branco/20 sm:block"></span>
              
              <MotionItem distance={8} className="flex items-center gap-2 sm:gap-3">
                <span className="text-laranja-energia" aria-hidden="true">♦</span> DADOS
              </MotionItem>
              <span className="hidden h-px w-8 lg:w-16 bg-branco/20 sm:block"></span>
              
              <MotionItem distance={8} className="flex items-center gap-2 sm:gap-3">
                <span className="text-laranja-energia" aria-hidden="true">♦</span> EXECUÇÃO
              </MotionItem>
              <span className="hidden h-px w-8 lg:w-16 bg-branco/20 sm:block"></span>
              
              <MotionItem distance={8} className="flex items-center gap-2 sm:gap-3">
                <span className="text-laranja-energia" aria-hidden="true">♦</span> RESULTADOS
              </MotionItem>
            </div>
          </MotionStagger>
        </div>

      </div>
    </section>
  );
}
