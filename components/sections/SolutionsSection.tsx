"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useId } from "react";
import { MotionFade } from "@/components/motion";

interface Deliverable {
  title: string;
  description: string;
}

interface Solution {
  id: string;
  number: string;
  title: string;
  category: string;
  color: string;
  badgeColor: string;
  imagePosition: "top" | "bottom";
  imageSrc: string;
  chips: string[];
  subtitle: string;
  summary: string;
  deliverables: Deliverable[];
  callout: string;
}

const solutions: Solution[] = [
  {
    id: "aquisicao",
    number: "01",
    title: "AQUISIÇÃO & CRESCIMENTO",
    category: "Aquisição & Crescimento",
    color: "#FF8A00",
    badgeColor: "bg-[#FF8A00]",
    imagePosition: "top",
    imageSrc: "/images/home/solutions/solution-card-1.png",
    chips: ["IDEIAS", "CAMPANHAS", "AUDIÊNCIA", "RESULTADOS"],
    subtitle: "Mais clientes, maior previsibilidade.",
    summary:
      "Atrair o público certo, gerar oportunidades e acelerar o crescimento do seu negócio.",
    deliverables: [
      {
        title: "Estratégia de canais e tráfego",
        description: "Elimine desperdícios e potencialize mídias",
      },
      {
        title: "Geração de demanda qualificada",
        description: "Atraia quem realmente tem fit de compra",
      },
      {
        title: "Otimização de conversão e funil",
        description: "Mais vendas com a mesma base de tráfego",
      },
      {
        title: "Posicionamento de mercado",
        description: "Autoridade e diferenciação da marca",
      },
    ],
    callout: "Atração estratégica que gera receita real, não apenas tráfego.",
  },
  {
    id: "vendas",
    number: "02",
    title: "VENDAS & ATENDIMENTO",
    category: "Vendas & Atendimento",
    color: "#FF4D4D",
    badgeColor: "bg-[#FF4D4D]",
    imagePosition: "bottom",
    imageSrc: "/images/home/solutions/solution-card-2.png",
    chips: ["PESSOAS", "CONVERSAS", "CONEXÕES", "RESULTADOS"],
    subtitle: "Relacionamento que gera receita.",
    summary:
      "Transformar oportunidades em relacionamento, fidelização e receita com previsibilidade.",
    deliverables: [
      {
        title: "Estruturação de processos comerciais",
        description: "Etapas de vendas claras e repetíveis",
      },
      {
        title: "Atendimento consultivo omnichannel",
        description: "Encantamento, agilidade e retenção",
      },
      {
        title: "Gestão de CRM e pipeline ativo",
        description: "Visibilidade em cada oportunidade",
      },
      {
        title: "Treinamento e alinhamento do time",
        description: "Rotinas que elevam a taxa de fechamento",
      },
    ],
    callout: "Vendas consistentes nascem de conversas estruturadas e rituais.",
  },
  {
    id: "tecnologia",
    number: "03",
    title: "TECNOLOGIA & AUTOMAÇÃO",
    category: "Tecnologia & Automação",
    color: "#00A3FF",
    badgeColor: "bg-[#00A3FF]",
    imagePosition: "top",
    imageSrc: "/images/home/solutions/solution-card-3.png",
    chips: ["AUTOMATIZAR", "INTEGRAR", "ESCALAR", "SIMPLIFICAR"],
    subtitle: "Menos esforço. Mais resultado.",
    summary:
      "Reduzir esforço manual e aumentar a capacidade do seu time com tecnologia que realmente faz sentido.",
    deliverables: [
      {
        title: "Automação de processos",
        description: "Elimine tarefas manuais repetitivas",
      },
      {
        title: "IA aplicada ao negócio",
        description: "Mais produtividade e melhores decisões",
      },
      {
        title: "Integrações inteligentes",
        description: "Conecte sistemas, ferramentas e pessoas",
      },
      {
        title: "Sistemas e fluxos escaláveis",
        description: "Operação simples, estável e escalável",
      },
    ],
    callout: "Tecnologia que libera pessoas para o que realmente importa.",
  },
  {
    id: "dados",
    number: "04",
    title: "DADOS & INTELIGÊNCIA",
    category: "Dados & Inteligência",
    color: "#00D2D3",
    badgeColor: "bg-[#00D2D3]",
    imagePosition: "bottom",
    imageSrc: "/images/home/solutions/solution-card-4.png",
    chips: ["DADOS", "INSIGHTS", "DECISÕES", "CRESCIMENTO"],
    subtitle: "Decisões com base em fatos.",
    summary:
      "Transformar informação em clareza, decisões mais rápidas e resultados mais consistentes.",
    deliverables: [
      {
        title: "Dashboards e visão em tempo real",
        description: "Monitoramento contínuo dos indicadores",
      },
      {
        title: "Centralização e governança de dados",
        description: "Informações confiáveis em um só lugar",
      },
      {
        title: "Diagnóstico de gargalos operacionais",
        description: "Identifique onde a operação perde margem",
      },
      {
        title: "Modelos preditivos de performance",
        description: "Antecipe tendências e ajuste rotas",
      },
    ],
    callout: "Dados só têm valor quando geram decisões rápidas e assertivas.",
  },
  {
    id: "estrutura",
    number: "05",
    title: "ESTRUTURA & PROCESSOS",
    category: "Estrutura & Processos",
    color: "#A855F7",
    badgeColor: "bg-[#A855F7]",
    imagePosition: "top",
    imageSrc: "/images/home/solutions/solution-card-5.png",
    chips: ["ESTRATÉGIA", "PROCESSOS", "DISCIPLINA", "RESULTADOS"],
    subtitle: "Base sólida para escalar.",
    summary:
      "Organizar a operação, eliminar desperdícios e criar uma base sólida para o crescimento sustentável.",
    deliverables: [
      {
        title: "Mapeamento e padronização operacional",
        description: "Clareza de responsabilidades e rotinas",
      },
      {
        title: "Governança e rituais de gestão",
        description: "Disciplina de execução sem burocracia",
      },
      {
        title: "Eliminação contínua de desperdícios",
        description: "Eficiência operacional e margem líquida",
      },
      {
        title: "Preparação para escala sustentável",
        description: "Crescimento contínuo com estabilidade",
      },
    ],
    callout: "Estrutura forte é o que sustenta o crescimento sem quebras.",
  },
];

// Ícones Vetoriais Oficiais para cada território
function SolutionIcon({ id, color }: { id: string; color: string }) {
  switch (id) {
    case "aquisicao":
      // Gráfico de barras ascendente
      return (
        <svg viewBox="0 0 24 24" fill={color} className="h-6 w-6" aria-hidden="true">
          <path d="M4 19h2V9H4v10zm6 0h2V5h-2v14zm6 0h2V12h-2v7zm4 2H2v-2h20v2z" />
        </svg>
      );
    case "vendas":
      // Pessoas / Equipe
      return (
        <svg viewBox="0 0 24 24" fill={color} className="h-6 w-6" aria-hidden="true">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      );
    case "tecnologia":
      // Engrenagem
      return (
        <svg viewBox="0 0 24 24" fill={color} className="h-6 w-6" aria-hidden="true">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      );
    case "dados":
      // Banco de dados / Cilindro
      return (
        <svg viewBox="0 0 24 24" fill={color} className="h-6 w-6" aria-hidden="true">
          <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm0 14c-3.87 0-6-1.5-6-2v-1.77c1.55 1.1 3.73 1.77 6 1.77s4.45-.67 6-1.77V17c0 .5-2.13 2-6 2zm0-4c-3.87 0-6-1.5-6-2v-1.77c1.55 1.1 3.73 1.77 6 1.77s4.45-.67 6-1.77V13c0 .5-2.13 2-6 2z" />
        </svg>
      );
    case "estrutura":
      // Organograma / Conexões
      return (
        <svg viewBox="0 0 24 24" fill={color} className="h-6 w-6" aria-hidden="true">
          <path d="M19 15c-1.3 0-2.4.84-2.82 2H13v-4h1.18c.42 1.16 1.52 2 2.82 2 1.66 0 3-1.34 3-3s-1.34-3-3-3c-1.3 0-2.4.84-2.82 2H13V7h1.18c.42 1.16 1.52 2 2.82 2 1.66 0 3-1.34 3-3s-1.34-3-3-3c-1.3 0-2.4.84-2.82 2H11c-.55 0-1 .45-1 1v4H8.82C8.4 8.84 7.3 8 6 8c-1.66 0-3 1.34-3 3s1.34 3 3 3c1.3 0 2.4-.84 2.82-2H10v4H8.82C8.4 15.84 7.3 15 6 15c-1.66 0-3 1.34-3 3s1.34 3 3 3c1.3 0 2.4-.84 2.82-2H11c.55 0 1-.45 1-1v-4h2v4.18c-.42 1.16-1.52 2-2.82 2 1.66 0 3-1.34 3-3z" />
        </svg>
      );
    default:
      return null;
  }
}

export function SolutionsSection() {
  // Estado inicial obrigatório: cinco cards uniformes e NENHUM expandido
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);

  const headingId = useId();

  // Card ativo no desktop: hover tem prioridade visual fluida; se não houver hover, respeita o clique fixado
  const activeDesktopId = hoveredCardId ?? selectedCardId ?? null;

  const handleCardClick = (id: string) => {
    setSelectedCardId((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedCardId((prev) => (prev === solutions[index].id ? null : solutions[index].id));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % solutions.length;
      setSelectedCardId(solutions[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + solutions.length) % solutions.length;
      setSelectedCardId(solutions[prevIndex].id);
    } else if (e.key === "Escape") {
      setSelectedCardId(null);
      setHoveredCardId(null);
    }
  };

  const handleNavigateNext = useCallback(() => {
    setSelectedCardId((prev) => {
      if (!prev) return solutions[0].id;
      const idx = solutions.findIndex((s) => s.id === prev);
      return solutions[(idx + 1) % solutions.length].id;
    });
  }, []);

  const handleNavigatePrev = useCallback(() => {
    setSelectedCardId((prev) => {
      if (!prev) return solutions[solutions.length - 1].id;
      const idx = solutions.findIndex((s) => s.id === prev);
      return solutions[(idx - 1 + solutions.length) % solutions.length].id;
    });
  }, []);

  return (
    <section
      id="solucoes"
      aria-labelledby={headingId}
      className="relative w-full overflow-hidden bg-[#FAFAFA] text-azul-noite"
    >
      {/* 
        ================================================== 
        1. CABEÇALHO E TOP BAR EDITORIAL
        ================================================== 
      */}
      <div className="w-full border-b border-black/5 bg-white px-6 pt-16 pb-12 md:px-12 md:pt-20 md:pb-16 xl:px-16 xl:pt-24 xl:pb-20">
        <div className="mx-auto flex w-full max-w-[1720px] flex-col">
          
          {/* Top Bar Editorial */}
          <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.05} className="mb-10 flex flex-col justify-between gap-4 border-b border-black/5 pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-azul-noite/50 sm:flex-row sm:items-center sm:text-xs">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-6 bg-laranja-energia" aria-hidden="true" />
              <span>DO DIAGNÓSTICO À EXECUÇÃO. SOLUÇÕES REAIS PARA NEGÓCIOS REAIS.</span>
            </div>
            <div className="hidden items-center gap-4 text-azul-noite/40 xl:flex">
              <span>ESTRATÉGIA</span>
              <span>·</span>
              <span>DADOS</span>
              <span>·</span>
              <span>EXECUÇÃO</span>
              <span>·</span>
              <span>RESULTADOS</span>
              <span className="mx-2 h-3 w-px bg-black/10" />
              <span className="text-laranja-energia">NEGÓCIOS EM MOVIMENTO</span>
            </div>
          </MotionFade>

          {/* Tag Central + Headline Principal */}
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.1}>
                <span className="mb-4 inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-laranja-energia">
                  <span className="mr-3 block h-[2px] w-6 bg-laranja-energia" aria-hidden="true" />
                  05 · SOLUÇÕES
                </span>
              </MotionFade>

              <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.18} distance={12}>
                <h2
                  id={headingId}
                  className="text-3xl font-bold leading-[1.12] tracking-tight text-azul-noite sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]"
                >
                  Não começamos pela solução.
                  <br />
                  <span className="text-laranja-energia">Começamos pelo problema.</span>
                </h2>
              </MotionFade>
            </div>

            {/* Texto de Apoio Editorial */}
            <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.25} distance={10} className="max-w-md lg:pb-2">
              <p className="text-sm font-semibold leading-relaxed text-azul-noite/90 sm:text-base">
                O diagnóstico revela onde está o gargalo. A partir daí, atuamos nas áreas que precisam mudar para o negócio avançar.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-azul-noite/70 sm:text-sm">
                A A2Max conecta diferentes especialidades para resolver os desafios reais de cada negócio. Cada solução nasce de um diagnóstico, não de um pacote pronto.
              </p>
            </MotionFade>
          </div>

        </div>
      </div>

      {/* 
        ================================================== 
        2. DESKTOP: ACORDEÃO HORIZONTAL (>= lg)
        Estado Inicial: 5 cards uniformes. Expansão suave sob interação.
        ================================================== 
      */}
      <div className="hidden w-full px-6 py-12 lg:block xl:px-12 xl:py-16">
        <div className="mx-auto flex w-full max-w-[1720px] flex-col">
          
          {/* Trilha dos 5 Cards Horizontais */}
          <MotionFade triggerOnScroll viewportAmount={0.15} delay={0.1} distance={14}>
            <div
              role="region"
              aria-label="Territórios de Soluções A2Max"
              className="flex w-full items-stretch gap-3 xl:gap-4"
              style={{ minHeight: "680px" }}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              {solutions.map((solution, index) => {
                const isExpanded = activeDesktopId === solution.id;
                const isTopImage = solution.imagePosition === "top";

                return (
                  <div
                    key={solution.id}
                    id={`solution-card-${solution.id}`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={`solution-details-${solution.id}`}
                    onMouseEnter={() => setHoveredCardId(solution.id)}
                    onClick={() => handleCardClick(solution.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none focus-visible:ring-2 focus-visible:ring-laranja-energia focus-visible:ring-offset-2 ${
                      isExpanded
                        ? "flex-[2.4] border-black/15 shadow-xl ring-1 ring-black/5"
                        : activeDesktopId !== null
                        ? "flex-[0.8] border-black/5 opacity-90 hover:opacity-100"
                        : "flex-1 border-black/5 hover:border-black/15 hover:shadow-md"
                    }`}
                  >
                    {/* 
                      ESTRUTURA A: IMAGEM SUPERIOR (Cards 01, 03, 05)
                    */}
                    {isTopImage && (
                      <div className="relative h-64 w-full shrink-0 overflow-hidden bg-azul-noite/10 xl:h-72">
                        <Image
                          src={solution.imageSrc}
                          alt={solution.title}
                          fill
                          sizes="(min-width: 1536px) 380px, 280px"
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* Overlay e Chips fotográficos */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        
                        {/* Número no topo da imagem */}
                        <span className="absolute left-4 top-4 text-sm font-black tracking-widest text-white/90 drop-shadow-md">
                          {solution.number}
                        </span>

                        {/* Chips de Método flutuantes */}
                        <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">
                          {solution.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white/90 backdrop-blur-sm"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 
                      CORPO TEXTUAL DO CARD
                    */}
                    <div className="flex flex-1 flex-col justify-between p-5 xl:p-6">
                      
                      {/* Topo do Conteúdo: Ícone + Título */}
                      <div>
                        {/* Tag de Destaque quando expandido */}
                        {isExpanded && (
                          <div className="mb-3 flex items-center justify-between animate-fadeIn">
                            <span
                              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: solution.color }}
                            >
                              SOLUÇÃO EM DESTAQUE ●
                            </span>
                            <span className="text-xs font-bold text-azul-noite/40">
                              {solution.number} / 05
                            </span>
                          </div>
                        )}

                        {/* Número no corpo (quando imagem está embaixo) */}
                        {!isTopImage && (
                          <div className="mb-2 flex items-center justify-between text-xs font-black tracking-widest text-azul-noite/40">
                            <span>{solution.number}</span>
                          </div>
                        )}

                        {/* Ícone Temático */}
                        <div className="mb-3">
                          <SolutionIcon id={solution.id} color={solution.color} />
                        </div>

                        {/* Título do Território */}
                        <h3 className="text-base font-bold leading-snug tracking-tight text-azul-noite xl:text-lg">
                          {solution.title}
                        </h3>

                        {/* Subtítulo temático */}
                        <p
                          className="mt-1 text-xs font-bold tracking-wide"
                          style={{ color: solution.color }}
                        >
                          {solution.subtitle}
                        </p>

                        {/* Descrição resumida */}
                        <p className="mt-2.5 text-xs leading-relaxed text-azul-noite/75 xl:text-[13px]">
                          {solution.summary}
                        </p>

                        {/* CONTEÚDO EXPANDIDO (Revelado apenas quando ativo) */}
                        {isExpanded && (
                          <div
                            id={`solution-details-${solution.id}`}
                            className="mt-5 border-t border-black/5 pt-4 transition-all duration-300"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-azul-noite/50 block mb-3">
                              Entregáveis Estratégicos:
                            </span>

                            {/* Grade 2x2 de entregáveis */}
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              {solution.deliverables.map((item) => (
                                <div
                                  key={item.title}
                                  className="rounded-lg bg-black/[0.03] p-2.5 transition-colors hover:bg-black/[0.05]"
                                >
                                  <h4 className="text-[11px] font-bold text-azul-noite">
                                    {item.title}
                                  </h4>
                                  <p className="mt-0.5 text-[10px] text-azul-noite/70">
                                    {item.description}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Callout Editorial */}
                            <p className="mt-4 text-xs italic text-azul-noite/60 border-l-2 pl-3" style={{ borderColor: solution.color }}>
                              &ldquo;{solution.callout}&rdquo;
                            </p>

                            {/* Botão CTA do Card Aberto */}
                            <div className="mt-5">
                              <Link
                                href="#diagnostico"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                                style={{ backgroundColor: solution.color }}
                              >
                                <span>Explorar esta solução</span>
                                <span aria-hidden="true">&rarr;</span>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Base do Card: Link e Barra Inferior */}
                      <div className="mt-4 pt-3 border-t border-black/5">
                        {!isExpanded && (
                          <div className="flex items-center justify-between text-xs font-bold text-azul-noite/80 transition-colors group-hover:text-laranja-energia">
                            <span>Explorar</span>
                            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                          </div>
                        )}
                        <div
                          className="mt-2 h-[3px] rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: solution.color,
                            width: isExpanded ? "100%" : "32px",
                          }}
                        />
                      </div>

                    </div>

                    {/* 
                      ESTRUTURA B: IMAGEM INFERIOR (Cards 02 e 04)
                    */}
                    {!isTopImage && (
                      <div className="relative h-64 w-full shrink-0 overflow-hidden bg-azul-noite/10 xl:h-72">
                        <Image
                          src={solution.imageSrc}
                          alt={solution.title}
                          fill
                          sizes="(min-width: 1536px) 380px, 280px"
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />

                        {/* Chips na imagem inferior */}
                        <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">
                          {solution.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white/90 backdrop-blur-sm"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </MotionFade>

          {/* Rodapé da Trilha Desktop: Indicador e Setas de Navegação */}
          <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-6">
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-8 bg-azul-noite" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-azul-noite/60">
                SOLUÇÕES PARA CADA FASE DO SEU NEGÓCIO
              </span>
            </div>

            {/* Controles de Navegação Circular */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleNavigatePrev}
                aria-label="Solução anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-azul-noite shadow-sm transition-all hover:border-laranja-energia hover:text-laranja-energia active:scale-95"
              >
                <span aria-hidden="true">&larr;</span>
              </button>
              <button
                type="button"
                onClick={handleNavigateNext}
                aria-label="Próxima solução"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-azul-noite shadow-sm transition-all hover:border-laranja-energia hover:text-laranja-energia active:scale-95"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 
        ================================================== 
        3. MOBILE: LISTA VERTICAL EMPILHADA COM ENTRADA INDIVIDUAL (< lg)
        Composição alternada, toque para expandir, sem dependência de hover.
        ================================================== 
      */}
      <div className="flex flex-col gap-6 px-6 py-10 lg:hidden">
        {solutions.map((solution) => {
          const isExpanded = mobileExpandedId === solution.id;
          const isTopImage = solution.imagePosition === "top";

          return (
            <MotionFade
              key={solution.id}
              triggerOnScroll
              viewportAmount={0.15}
              delay={0.05}
              distance={16}
              className="w-full"
            >
              <div
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-md"
              >
                {/* Imagem no Topo (Cards 01, 03, 05) */}
                {isTopImage && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-azul-noite/10">
                    <Image
                      src={solution.imageSrc}
                      alt={solution.title}
                      fill
                      sizes="100vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    
                    <span className="absolute left-4 top-3 text-sm font-black tracking-widest text-white drop-shadow">
                      {solution.number}
                    </span>

                    <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">
                      {solution.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white/90 backdrop-blur-sm"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conteúdo Textual Mobile */}
                <div className="flex flex-col p-5">
                  {!isTopImage && (
                    <div className="mb-2 text-xs font-black tracking-widest text-azul-noite/40">
                      {solution.number}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <SolutionIcon id={solution.id} color={solution.color} />
                    <h3 className="text-base font-bold text-azul-noite">
                      {solution.title}
                    </h3>
                  </div>

                  <p className="mt-1 text-xs font-bold" style={{ color: solution.color }}>
                    {solution.subtitle}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-azul-noite/80 sm:text-sm">
                    {solution.summary}
                  </p>

                  {/* Detalhes Expandidos no Mobile (Toque) */}
                  {isExpanded && (
                    <div className="mt-4 border-t border-black/5 pt-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-azul-noite/50 block mb-2">
                        Entregáveis Estratégicos:
                      </span>
                      <div className="flex flex-col gap-2">
                        {solution.deliverables.map((item) => (
                          <div key={item.title} className="rounded-md bg-black/[0.03] p-2.5">
                            <h4 className="text-xs font-bold text-azul-noite">{item.title}</h4>
                            <p className="mt-0.5 text-[11px] text-azul-noite/70">{item.description}</p>
                          </div>
                        ))}
                      </div>

                      <p className="mt-3 text-xs italic text-azul-noite/60 border-l-2 pl-3" style={{ borderColor: solution.color }}>
                        &ldquo;{solution.callout}&rdquo;
                      </p>

                      <div className="mt-4">
                        <Link
                          href="#diagnostico"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold uppercase tracking-wider text-white shadow"
                          style={{ backgroundColor: solution.color }}
                        >
                          <span>Iniciar Diagnóstico</span>
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Botão de Toque Expandir/Recolher */}
                  <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
                    <button
                      type="button"
                      onClick={() => setMobileExpandedId((prev) => (prev === solution.id ? null : solution.id))}
                      className="text-xs font-bold text-azul-noite flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? "Recolher detalhes" : "Explorar solução"}</span>
                      <span aria-hidden="true">{isExpanded ? "↑" : "↓"}</span>
                    </button>
                    <div
                      className="h-[3px] rounded-full transition-all"
                      style={{
                        backgroundColor: solution.color,
                        width: isExpanded ? "48px" : "24px",
                      }}
                    />
                  </div>
                </div>

                {/* Imagem na Base (Cards 02 e 04) */}
                {!isTopImage && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-azul-noite/10">
                    <Image
                      src={solution.imageSrc}
                      alt={solution.title}
                      fill
                      sizes="100vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />

                    <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">
                      {solution.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white/90 backdrop-blur-sm"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </MotionFade>
          );
        })}

        {/* 
          FECHAMENTO EDITORIAL MOBILE (IDÊNTICO AO MOCKUP)
        */}
        <MotionFade triggerOnScroll viewportAmount={0.2} delay={0.1} className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <span className="h-[2px] w-8 bg-laranja-energia" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-azul-noite/50">
              ESTRATÉGIA. DADOS. EXECUÇÃO. RESULTADOS.
            </span>
            <h3 className="text-2xl font-bold leading-tight text-azul-noite">
              Negócios em movimento. <br />
              <span className="text-laranja-energia">Esse é o nosso foco.</span>
            </h3>
            <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
              <div>
                <span className="text-sm font-black tracking-tight text-azul-noite">A2Max</span>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-azul-noite/50">
                  Performance e Inteligência de Negócios
                </p>
              </div>
              <Link
                href="#diagnostico"
                className="rounded-full bg-laranja-energia px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-azul-noite"
              >
                Diagnóstico &rarr;
              </Link>
            </div>
          </div>
        </MotionFade>
      </div>
    </section>
  );
}
