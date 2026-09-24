import Image from "next/image";
import Link from "next/link";

export function ProblemSection() {
  return (
    <section className="relative w-full bg-branco overflow-hidden">
      
      {/* 
        ================================================== 
        MOBILE LAYOUT (< lg)
        ================================================== 
      */}
      <div className="flex flex-col lg:hidden">
        {/* Top Editorial Content (White Mode) */}
        <div className="bg-branco px-6 py-16 md:px-12 md:py-20">
          <span className="mb-6 flex items-center text-xs font-bold uppercase tracking-[0.15em] text-laranja-energia">
            <span className="mr-4 block h-[2px] w-8 bg-laranja-energia"></span>
            O PROBLEMA
          </span>
          <h2 className="mb-8 text-[2rem] font-bold leading-[1.15] text-azul-noite md:text-[2.5rem]">
            O problema nem sempre está onde o resultado aparece — <br className="hidden md:block"/>
            <span className="text-laranja-energia">ou não aparece.</span>
          </h2>
          <div className="flex flex-col gap-5 text-base font-medium leading-relaxed text-azul-noite/80 md:text-lg">
            <p>Uma empresa pode gerar mais leads e continuar vendendo pouco.</p>
            <p>Pode implementar tecnologia e manter processos ruins.</p>
            <p>Pode ter dados e continuar tomando decisões no escuro.</p>
            <p>Pode contratar mais pessoas e continuar sem capacidade de execução.</p>
          </div>
        </div>

        {/* Mobile Asset (Native Aspect Ratio: 1064/1478, no HTML overlays) */}
        <div className="relative w-full aspect-[1064/1478] bg-[#070b14]">
          <Image
            src="/images/home/problem/problem-mobile.png"
            alt="Núcleo de Negócio Desconectado"
            fill
            className="object-contain"
            quality={95}
          />
        </div>

        {/* Bottom Statement (Dark Mode) */}
        <div className="flex flex-col gap-10 bg-azul-noite px-6 py-16 md:px-12 md:py-20">
          <h3 className="text-[1.5rem] font-bold leading-tight text-branco md:text-[2rem]">
            Quando cada área trabalha sozinha, o negócio inteiro perde performance.
          </h3>
          <div className="border-l-[3px] border-laranja-energia pl-5">
            <p className="text-lg font-bold text-branco md:text-xl">
              Crescer sem estrutura <span className="text-laranja-energia">também faz os problemas crescerem.</span>
            </p>
          </div>
          <p className="text-base font-medium leading-relaxed text-branco/80 md:text-lg">
            Por isso, antes de propor qualquer solução, precisamos entender o sistema.
          </p>
          <Link 
            href="#action" 
            className="group mt-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-branco transition-colors hover:text-laranja-energia focus:outline-none focus:ring-2 focus:ring-laranja-energia focus:ring-offset-8 focus:ring-offset-azul-noite md:text-sm"
          >
            É aqui que começa o Método A.C.T.I.O.N.
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* 
        ================================================== 
        DESKTOP LAYOUT (>= lg)
        ================================================== 
      */}
      <div className="hidden w-full lg:flex lg:flex-col mx-auto max-w-[1920px]">
        
        {/* AREA PRINCIPAL: Asset como Background (Aspect Ratio: 1672/941) */}
        <div className="relative w-full aspect-[1672/941] bg-branco">
          <Image
            src="/images/home/problem/problem-desktop.png"
            alt=""
            fill
            className="object-cover object-left"
            quality={100}
            priority
          />
          
          {/* Conteúdo HTML posicionado na área branca da direita */}
          <div className="absolute inset-0 z-10 mx-auto w-full">
            <div className="absolute top-0 left-[62%] flex h-full w-[38%] max-w-[520px] flex-col justify-center pr-4 xl:left-[61%] xl:pr-0">
              
              <span className="mb-6 flex items-center text-xs font-bold uppercase tracking-[0.15em] text-laranja-energia">
                <span className="mr-4 block h-[2px] w-8 bg-laranja-energia"></span>
                O PROBLEMA
              </span>
              
              <h2 className="mb-10 text-[2.75rem] font-bold leading-[1.15] text-azul-noite xl:text-[3.25rem]">
                O problema nem sempre está onde o resultado aparece — <br/>
                <span className="text-laranja-energia">ou não aparece.</span>
              </h2>
              
              <div className="mb-16 flex flex-col gap-5 text-base font-medium leading-relaxed text-azul-noite/80 xl:text-lg">
                <p>Uma empresa pode gerar mais leads e continuar vendendo pouco.</p>
                <p>Pode implementar tecnologia e manter processos ruins.</p>
                <p>Pode ter dados e continuar tomando decisões no escuro.</p>
                <p>Pode contratar mais pessoas e continuar sem capacidade de execução.</p>
              </div>

              <div className="flex flex-col gap-6">
                <h3 className="text-[1.85rem] font-bold leading-tight text-azul-noite xl:text-[2.25rem]">
                  Quando cada área trabalha sozinha,<br/> o negócio inteiro perde performance.
                </h3>
                <div className="border-l-[3px] border-laranja-energia pl-5">
                  <p className="text-lg font-bold text-azul-noite xl:text-xl">
                    Crescer sem estrutura também <br/> 
                    <span className="text-laranja-energia">faz os problemas crescerem.</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FAIXA INFERIOR EDITORIAL DESKTOP */}
        <div className="w-full bg-branco px-12 py-16 xl:px-16 border-t border-azul-noite/10">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between">
            
            <div className="w-[35%]">
              <p className="text-base font-semibold leading-relaxed text-azul-noite xl:text-lg">
                Por isso, antes de propor <br/>
                qualquer solução, precisamos <br/>
                <span className="text-laranja-energia">entender o sistema.</span>
              </p>
            </div>
            
            <div className="flex-1 px-8">
              <div className="h-px w-full bg-azul-noite/15"></div>
            </div>
            
            <div className="w-[45%] flex justify-end">
              <Link 
                href="#action" 
                className="group flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-azul-noite transition-colors hover:text-laranja-energia focus:outline-none focus:ring-2 focus:ring-laranja-energia focus:ring-offset-8 focus:ring-offset-branco xl:text-sm"
              >
                <span className="text-right leading-relaxed">
                  É aqui que começa o <br/>
                  nosso método A.C.T.I.O.N.
                </span>
                <span className="flex h-12 w-12 xl:h-14 xl:w-14 shrink-0 items-center justify-center rounded-full bg-laranja-energia text-xl text-azul-noite transition-transform group-hover:scale-105" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            
          </div>
        </div>
      </div>

      {/* SR-Only Accessibility */}
      <div className="sr-only">
        <h2>Negócio Desconectado - Sintomas</h2>
        <ul>
          <li>Estratégia: Planejamento desalinhado</li>
          <li>Aquisição: Leads sem conversão</li>
          <li>Vendas: Oportunidades sem avanço</li>
          <li>Atendimento: Atendimento sem contexto</li>
          <li>Processos: Processos manuais</li>
          <li>Tecnologia: Sistemas sem integração</li>
          <li>Dados: Dados isolados e sem visibilidade</li>
          <li>Execução: Falta de padronização</li>
        </ul>
      </div>

    </section>
  );
}
