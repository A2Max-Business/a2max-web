import Image from "next/image";
import Link from "next/link";

export function VisionSection() {
  return (
    <section className="relative w-full bg-[#070b14] overflow-hidden">
      
      {/* 
        ================================================== 
        MOBILE LAYOUT (< lg)
        ================================================== 
      */}
      <div className="flex flex-col lg:hidden">
        
        {/* Top Text (Dark Mode) */}
        <div className="bg-[#070b14] px-6 pt-16 pb-12 md:px-12 md:pt-20 md:pb-14">
          <span className="mb-6 flex items-center text-xs font-bold uppercase tracking-[0.15em] text-laranja-energia">
            <span className="mr-4 block h-[2px] w-8 bg-laranja-energia"></span>
            NOSSA VISÃO
          </span>
          <h2 className="mb-8 text-[2rem] font-bold leading-tight text-branco md:text-[2.5rem]">
            Nós não enxergamos departamentos isolados.<br className="hidden md:block" />
            Enxergamos um negócio.
          </h2>
          <div className="flex flex-col gap-4 text-base font-medium leading-relaxed text-branco/80 md:text-lg">
            <p>Marketing influencia vendas.</p>
            <p>Vendas dependem de atendimento.</p>
            <p>Atendimento depende de processos.</p>
            <p>Processos dependem de pessoas e tecnologia.</p>
            <p>E os dados ajudam a revelar onde melhorar.</p>
          </div>
        </div>

        {/* Mobile Asset (Native Aspect Ratio: 941/1672, sem cortes) */}
        <div className="relative w-full aspect-[941/1672] bg-[#070b14]">
          <Image
            src="/images/home/vision/vision-mobile.png"
            alt="Núcleo de Negócio Conectado"
            fill
            className="object-contain"
            quality={95}
          />
        </div>

        {/* Bottom Statement (Dark Mode) */}
        <div className="flex flex-col gap-10 bg-[#070b14] px-6 py-16 md:px-12 md:py-20">
          <h3 className="text-[1.5rem] font-bold leading-tight text-branco md:text-[2rem]">
            Performance acontece quando essas partes trabalham na mesma direção.
          </h3>
          <p className="text-base font-medium leading-relaxed text-branco/80 md:text-lg">
            Mas entender o negócio como sistema exige método.
          </p>
          <Link 
            href="#action" 
            className="group mt-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-branco transition-colors hover:text-laranja-energia focus:outline-none focus:ring-2 focus:ring-laranja-energia focus:ring-offset-8 focus:ring-offset-[#070b14] md:text-sm"
          >
            Foi para isso que criamos o A.C.T.I.O.N.
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
        
        {/* AREA PRINCIPAL: Asset como Background Canvas (Aspect Ratio Nativo: 1672/941) */}
        <div className="relative w-full aspect-[1672/941] bg-[#070b14]">
          
          {/* O Background preserva integralmente a composição original, sem crops */}
          <Image
            src="/images/home/vision/vision-desktop.png"
            alt=""
            fill
            className="object-contain"
            quality={100}
          />
          
          {/* Conteúdo HTML posicionado perfeitamente na área negativa escura à esquerda */}
          <div className="absolute inset-0 z-10 flex mx-auto max-w-[1400px]">
            <div className="flex h-full w-[45%] max-w-[580px] flex-col justify-center py-16 pl-8 pr-4 xl:w-[42%] xl:pl-16 xl:pr-0">
              
              <span className="mb-6 flex items-center text-xs font-bold uppercase tracking-[0.15em] text-laranja-energia">
                <span className="mr-4 block h-[2px] w-8 bg-laranja-energia"></span>
                NOSSA VISÃO
              </span>
              
              <h2 className="mb-10 text-[2.75rem] font-bold leading-[1.15] text-branco xl:text-[3.25rem]">
                Nós não enxergamos departamentos isolados.<br/>
                Enxergamos um negócio.
              </h2>
              
              <div className="mb-20 flex flex-col gap-4 text-base font-medium leading-relaxed text-branco/80 xl:text-lg">
                <p>Marketing influencia vendas.</p>
                <p>Vendas dependem de atendimento.</p>
                <p>Atendimento depende de processos.</p>
                <p>Processos dependem de pessoas e tecnologia.</p>
                <p>E os dados ajudam a revelar onde melhorar.</p>
              </div>

              <div className="mb-12 flex flex-col gap-6">
                <h3 className="max-w-[420px] text-[1.85rem] font-bold leading-tight text-branco xl:max-w-[500px] xl:text-[2.25rem]">
                  Performance acontece quando essas partes trabalham na <span className="text-laranja-energia">mesma direção.</span>
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-base font-medium leading-relaxed text-branco/80 xl:text-lg border-l-[3px] border-laranja-energia pl-5">
                  Mas entender o negócio como sistema <br className="hidden xl:block"/> 
                  exige método.
                </p>
                <Link 
                  href="#action" 
                  className="group mt-4 inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-branco transition-colors hover:text-laranja-energia focus:outline-none focus:ring-1 focus:ring-laranja-energia focus:ring-offset-4 focus:ring-offset-[#070b14] xl:text-sm"
                >
                  Foi para isso que criamos o A.C.T.I.O.N.
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* SR-Only Acessibilidade */}
      <div className="sr-only">
        <h2>Negócio Conectado - Áreas e Dimensões Integradas</h2>
        <ul>
          <li>Estratégia</li>
          <li>Pessoas</li>
          <li>Processos</li>
          <li>Aquisição</li>
          <li>Vendas</li>
          <li>Tecnologia</li>
          <li>Dados</li>
          <li>Execução</li>
        </ul>
      </div>

    </section>
  );
}
