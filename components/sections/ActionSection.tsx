import Image from "next/image";
import Link from "next/link";
import { MotionFade, MotionStagger, MotionItem } from "@/components/motion";

interface ActionStep {
  id: string;
  letter: string;
  title: string;
  action: string;
  description: string;
  imageSrc: string;
  letterColor: string;
  actionColor: string;
  barColor: string;
}

const actionSteps: ActionStep[] = [
  {
    id: "a",
    letter: "A",
    title: "Auditoria e Análise",
    action: "DESCOBRIMOS",
    description:
      "Entendemos o cenário real do seu negócio. Analisamos dados, processos, mercado e oportunidades para identificar os verdadeiros gargalos e o que realmente importa.",
    imageSrc: "/images/home/action/action-card-a.png",
    letterColor: "#FF8A00",
    actionColor: "#FF8A00",
    barColor: "#FF8A00",
  },
  {
    id: "c",
    letter: "C",
    title: "Construção da Estrutura",
    action: "ESTRUTURAMOS",
    description:
      "Organizamos processos, pessoas e tecnologia. Criamos uma base sólida e sustentável para que o crescimento aconteça de forma consistente e escalável.",
    imageSrc: "/images/home/action/action-card-c.png",
    letterColor: "#00A3FF",
    actionColor: "#FF8A00",
    barColor: "#00A3FF",
  },
  {
    id: "t",
    letter: "T",
    title: "Tráfego e Tração",
    action: "MOVIMENTAMOS",
    description:
      "Colocamos o plano em ação. Ativamos canais, campanhas e estratégias para gerar demanda, atrair clientes e acelerar resultados com foco em performance e rentabilidade.",
    imageSrc: "/images/home/action/action-card-t.png",
    letterColor: "#FF6B00",
    actionColor: "#FF6B00",
    barColor: "#FF6B00",
  },
  {
    id: "i",
    letter: "I",
    title: "Inteligência de Dados",
    action: "ENTENDEMOS",
    description:
      "Transformamos dados em clareza. Monitoramos indicadores, identificamos padrões e geramos insights para decisões mais assertivas e previsíveis.",
    imageSrc: "/images/home/action/action-card-i.png",
    letterColor: "#00D2D3",
    actionColor: "#FF8A00",
    barColor: "#00D2D3",
  },
  {
    id: "o",
    letter: "O",
    title: "Otimização Contínua",
    action: "MELHORAMOS",
    description:
      "Ajustamos, refinamos e otimizamos. Eliminamos desperdícios, aumentamos a eficiência e maximizamos a rentabilidade de forma contínua.",
    imageSrc: "/images/home/action/action-card-o.png",
    letterColor: "#FF4D4D",
    actionColor: "#FF8A00",
    barColor: "#FF4D4D",
  },
  {
    id: "n",
    letter: "N",
    title: "Novo Ciclo / Next Step",
    action: "AVANÇAMOS",
    description:
      "O sucesso não é um ponto final. A cada ciclo, buscamos novos horizontes, novos mercados e um nível maior de performance.",
    imageSrc: "/images/home/action/action-card-n.png",
    letterColor: "#A855F7",
    actionColor: "#FF8A00",
    barColor: "#A855F7",
  },
];

const pilares = [
  "ESTRATÉGIA",
  "DADOS",
  "EXECUÇÃO",
  "RESULTADOS",
  "NOVOS HORIZONTES",
];

export function ActionSection() {
  return (
    <section id="action" className="relative w-full bg-[#070b14] overflow-hidden">
      {/* 
        ================================================== 
        1. ABERTURA EDITORIAL (WHITE MODE) — ENTRADA SUAVE
        ================================================== 
      */}
      <div className="w-full bg-branco px-6 py-20 md:px-12 md:py-28 xl:py-32">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-12 lg:flex-row lg:justify-between lg:gap-20">
          {/* Lado Esquerdo */}
          <div className="flex w-full flex-col lg:w-1/2">
            <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.05}>
              <span className="mb-6 flex items-center text-xs font-bold uppercase tracking-[0.15em] text-laranja-energia">
                <span className="mr-4 block h-[2px] w-8 bg-laranja-energia"></span>
                O MÉTODO
              </span>
            </MotionFade>

            <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.15} distance={12}>
              <h2 className="text-[2.25rem] font-bold leading-[1.15] text-azul-noite md:text-[2.75rem] xl:text-[3.25rem]">
                Entender o negócio é o começo.
                <br className="hidden xl:block" />
                Transformar diagnóstico em ação{" "}
                <span className="text-laranja-energia">exige método.</span>
              </h2>
            </MotionFade>
          </div>

          {/* Lado Direito */}
          <div className="flex w-full flex-col justify-center lg:w-[45%] xl:w-[40%]">
            <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.2} distance={10}>
              <p className="mb-10 text-lg font-medium leading-relaxed text-azul-noite/80 xl:text-xl">
                O A.C.T.I.O.N. organiza a forma como analisamos, estruturamos e evoluímos um negócio — conectando estratégia, execução e melhoria contínua.
              </p>
            </MotionFade>

            {/* Assinatura Visual A -> C -> T... */}
            <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.3} distance={10}>
              <div className="flex flex-wrap items-center gap-2 text-[1.25rem] font-bold tracking-[0.15em] text-azul-noite md:text-[1.5rem] xl:text-[1.75rem]">
                <span>A</span>
                <span className="text-laranja-energia opacity-60">&rarr;</span>
                <span>C</span>
                <span className="text-laranja-energia opacity-60">&rarr;</span>
                <span>T</span>
                <span className="text-laranja-energia opacity-60">&rarr;</span>
                <span>I</span>
                <span className="text-laranja-energia opacity-60">&rarr;</span>
                <span>O</span>
                <span className="text-laranja-energia opacity-60">&rarr;</span>
                <span>N</span>
                <span className="text-laranja-energia opacity-60">&rarr;</span>
                <span className="opacity-60">…</span>
              </div>
            </MotionFade>
          </div>
        </div>
      </div>

      {/* 
        ================================================== 
        2. BLOCO CINEMATOGRÁFICO ESCURO (MOCKUP OFICIAL)
        ================================================== 
      */}
      <div className="relative w-full bg-[#070b14] text-white">
        {/* Background Cinematográfico Desktop */}
        <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
          <Image
            src="/images/home/action/action-bg-desktop.png"
            alt=""
            fill
            priority
            quality={95}
            className="object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/70 via-transparent to-[#070b14]/90" />
          <div className="absolute inset-0 bg-[#070b14]/30 backdrop-blur-[1px]" />
        </div>

        {/* Conteúdo da Seção Escura */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1720px] flex-col px-6 py-16 md:px-10 lg:px-8 xl:px-12 xl:py-24 2xl:px-16 2xl:py-28">
          
          {/* HEADER EDITORIAL ESCURO */}
          <div className="mb-12 flex flex-col justify-between gap-8 lg:mb-16 lg:flex-row lg:items-end xl:mb-20">
            {/* Lado Esquerdo: Tag + H2 + Descrição */}
            <div className="max-w-2xl">
              <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.05}>
                <span className="mb-4 inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  <span className="mr-3 block h-[2px] w-6 bg-laranja-energia"></span>
                  04 · NOSSO MÉTODO
                </span>
              </MotionFade>

              <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.15} distance={12}>
                <h3 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.6rem] xl:text-[3rem]">
                  Um método para transformar{" "}
                  <span className="text-laranja-energia">diagnóstico em movimento.</span>
                </h3>
              </MotionFade>

              <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.25} distance={10}>
                <p className="mt-4 text-sm font-normal leading-relaxed text-white/75 sm:text-base lg:text-[15px] xl:text-base">
                  O A.C.T.I.O.N. é o nosso sistema de engenharia de negócios, desenvolvido para conectar estratégia, pessoas, processos, tecnologia e dados em um ciclo contínuo de performance.
                </p>
              </MotionFade>
            </div>

            {/* Lado Direito: Filosofia + Pilares */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start lg:gap-8 xl:gap-12">
              <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.2} distance={10} className="border-l border-white/20 pl-4 sm:pl-5 max-w-xs">
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-white/70">
                  O método não determina qual ferramenta usar.
                </p>
                <p className="mt-1 text-xs sm:text-sm font-semibold leading-relaxed text-laranja-energia">
                  Ele ajuda a determinar qual problema precisa ser resolvido.
                </p>
              </MotionFade>

              <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.3} distance={10} className="hidden flex-col gap-2 border-l border-white/10 pl-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 xl:flex">
                {pilares.map((pilar) => (
                  <span key={pilar} className="transition-colors hover:text-white/80">
                    {pilar}
                  </span>
                ))}
              </MotionFade>
            </div>
          </div>

          {/* 
            ================================================== 
            DESKTOP: GRADE CONTÍNUA DOS 6 CARDS (>= lg)
            Sequência escalonada com hover integralmente preservado
            ================================================== 
          */}
          <div className="hidden lg:flex lg:flex-col lg:w-full">
            <MotionStagger triggerOnScroll viewportAmount={0.15} initialDelay={0.1} staggerDelay={0.07} className="w-full">
              <div className="flex w-full items-stretch justify-between gap-2 xl:gap-3 2xl:gap-4">
                {actionSteps.map((step, index) => (
                  <div key={step.id} className="contents">
                    {/* Item escalonado contendo o Card Interativo com Hover Preservado */}
                    <MotionItem distance={14} className="flex-1 flex flex-col">
                      <div
                        data-action-step={step.id}
                        className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-[#0B1220]/80 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-white/35 hover:shadow-laranja-energia/10"
                        style={{ minHeight: "470px" }}
                      >
                        {/* Topo: Imagem Fotográfica + Letra Overlay */}
                        <div className="relative h-40 w-full overflow-hidden bg-azul-noite/50 xl:h-44 2xl:h-48">
                          <Image
                            src={step.imageSrc}
                            alt={step.title}
                            fill
                            sizes="(min-width: 1536px) 240px, (min-width: 1280px) 210px, 180px"
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-black/30 to-black/20" />

                          <span
                            className="absolute left-3 top-2 text-4xl font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] xl:left-4 xl:top-3 xl:text-5xl"
                            style={{ color: step.letterColor }}
                          >
                            {step.letter}
                          </span>
                        </div>

                        {/* Corpo: Título, Verbo de Ação e Descrição */}
                        <div className="flex flex-1 flex-col justify-between p-3.5 xl:p-4.5 2xl:p-5">
                          <div>
                            <h4 className="text-xs font-bold leading-snug tracking-tight text-white xl:text-[13px] 2xl:text-sm">
                              {step.title}
                            </h4>
                            <span
                              className="mt-1 block text-[10px] font-black uppercase tracking-[0.18em] xl:text-[11px]"
                              style={{ color: step.actionColor }}
                            >
                              {step.action}
                            </span>
                            <p className="mt-2.5 text-[11px] font-normal leading-relaxed text-white/70 xl:text-[11.5px] 2xl:text-xs">
                              {step.description}
                            </p>
                          </div>

                          {/* Barra Inferior Temática */}
                          <div className="mt-4 pt-2">
                            <div
                              className="h-[3px] w-8 rounded-full transition-all duration-300 group-hover:w-full"
                              style={{ backgroundColor: step.barColor }}
                            />
                          </div>
                        </div>
                      </div>
                    </MotionItem>

                    {/* Conector Seta entre Cards */}
                    {index < actionSteps.length - 1 && (
                      <MotionItem distance={6} className="flex items-center justify-center px-0.5 xl:px-1 text-white/30">
                        <span className="text-base font-light transition-colors group-hover:text-laranja-energia/70 xl:text-lg">
                          &rarr;
                        </span>
                      </MotionItem>
                    )}

                    {/* Conector e Indicador Final após N */}
                    {index === actionSteps.length - 1 && (
                      <MotionItem distance={8} className="flex flex-col items-center justify-center pl-1.5 xl:pl-2 text-white/50">
                        <div className="flex items-center gap-1 text-sm font-bold text-laranja-energia xl:text-base">
                          <span>&rarr;</span>
                          <span className="tracking-widest">…</span>
                        </div>
                        <span className="mt-2 w-16 text-center text-[9px] font-semibold uppercase tracking-[0.18em] leading-tight text-white/50 xl:w-20 xl:text-[10px]">
                          Sempre em direção ao próximo nível.
                        </span>
                      </MotionItem>
                    )}
                  </div>
                ))}
              </div>
            </MotionStagger>
          </div>

          {/* 
            ================================================== 
            MOBILE & TABLET: APRESENTAÇÃO VERTICAL RICA (< lg)
            Cada card revela-se individualmente ao entrar em view
            ================================================== 
          */}
          <div className="flex flex-col gap-6 lg:hidden">
            {actionSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center w-full">
                {/* Card Mobile Individual com Scroll Trigger próprio */}
                <MotionFade
                  triggerOnScroll
                  viewportAmount={0.15}
                  delay={0.05}
                  distance={16}
                  className="w-full"
                >
                  <div
                    data-action-step={step.id}
                    className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0B1220]/90 shadow-xl backdrop-blur-md"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-azul-noite">
                      <Image
                        src={step.imageSrc}
                        alt={step.title}
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-black/20 to-black/30" />

                      <span
                        className="absolute left-4 top-3 text-4xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                        style={{ color: step.letterColor }}
                      >
                        {step.letter}
                      </span>
                    </div>

                    <div className="flex flex-col p-5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-base font-bold text-white">
                          {step.title}
                        </h4>
                        <span
                          className="text-xs font-black uppercase tracking-[0.18em]"
                          style={{ color: step.actionColor }}
                        >
                          {step.action}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-white/75 sm:text-sm">
                        {step.description}
                      </p>

                      <div className="mt-4 pt-2">
                        <div
                          className="h-[3px] w-12 rounded-full"
                          style={{ backgroundColor: step.barColor }}
                        />
                      </div>
                    </div>
                  </div>
                </MotionFade>

                {/* Conector Vertical entre cards mobile */}
                {index < actionSteps.length - 1 && (
                  <MotionFade triggerOnScroll viewportAmount={0.15} delay={0.05} distance={6} className="my-2 flex flex-col items-center text-white/30">
                    <span className="text-lg leading-none">&darr;</span>
                  </MotionFade>
                )}

                {/* Final após card N */}
                {index === actionSteps.length - 1 && (
                  <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.1} distance={8} className="mt-4 flex flex-col items-center text-center">
                    <div className="flex items-center gap-1 text-base font-bold text-laranja-energia">
                      <span>&darr;</span>
                      <span className="tracking-widest">…</span>
                    </div>
                    <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      Sempre em direção ao próximo nível.
                    </span>
                  </MotionFade>
                )}
              </div>
            ))}
          </div>

          {/* 
            ================================================== 
            BOTÃO CTA CENTRALIZADO
            ================================================== 
          */}
          <MotionFade triggerOnScroll viewportAmount={0.3} delay={0.1} distance={12} className="mt-14 flex w-full justify-center lg:mt-18 xl:mt-20">
            <Link
              href="#diagnostico"
              className="group relative inline-flex items-center gap-4 rounded-full border border-white/20 bg-[#0B1220]/85 px-6 py-3.5 text-sm font-semibold text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-laranja-energia/70 hover:bg-[#0B1220] hover:shadow-laranja-energia/20 sm:px-8 sm:py-4 sm:text-base"
            >
              <span>Conheça o Método A.C.T.I.O.N.</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-laranja-energia text-azul-noite transition-transform duration-300 group-hover:translate-x-1 sm:h-8 sm:w-8">
                <span className="text-sm font-bold text-white">&rarr;</span>
              </span>
            </Link>
          </MotionFade>

          {/* 
            ================================================== 
            RODAPÉ EDITORIAL DA SEÇÃO (IDÊNTICO AO MOCKUP)
            ================================================== 
          */}
          <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.1} distance={10} className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row lg:mt-20">
            {/* Lado Esquerdo: Logo A2Max + Tagline */}
            <div className="flex items-center gap-4">
              <Image
                src="/logos/a2max-darkmode.png"
                alt="A2Max"
                width={120}
                height={34}
                className="h-7 w-auto object-contain"
              />
              <div className="h-6 w-px bg-white/20" />
              <span className="text-xs font-normal text-white/70">
                Negócios mais inteligentes,{" "}
                <span className="font-semibold text-laranja-energia">resultados reais.</span>
              </span>
            </div>

            {/* Lado Direito: Tagline de Performance */}
            <div className="text-center sm:text-right">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-[11px]">
                Performance e Inteligência de Negócios para Eventos e Empresas.
              </span>
            </div>
          </MotionFade>

        </div>
      </div>
    </section>
  );
}
