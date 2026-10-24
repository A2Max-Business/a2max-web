"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionFade } from "@/components/motion";

interface ResultCard {
  id: string;
  metric: string;
  category: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

const RESULT_CARDS: ResultCard[] = [
  {
    id: "vendas",
    metric: "R$ 1,5 MI+",
    category: "EM VENDAS",
    role: "Gerência de Unidade",
    description:
      "Liderança de operação com foco em crescimento real e resultado comercial.",
    icon: (
      <svg
        className="w-5 h-5 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "marketing",
    metric: "R$ 2 MI+",
    category: "GERIDOS EM MARKETING",
    role: "Direção de Marketing",
    description:
      "Estratégia, posicionamento e gestão de investimentos em marketing.",
    icon: (
      <svg
        className="w-5 h-5 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
  {
    id: "unidades",
    metric: "3 → 10",
    category: "UNIDADES",
    role: "Gestão de Expansão",
    description:
      "Participação na expansão de uma operação de três para dez unidades.",
    icon: (
      <svg
        className="w-5 h-5 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    ),
  },
];

const CHECKLIST_ITEMS = [
  "Avaliação do seu cenário atual",
  "Identificação de oportunidades",
  "Com recomendações práticas",
];

export function ResultsSection() {
  return (
    <section
      id="resultados"
      className="relative w-full bg-[#070B12] text-white overflow-hidden scroll-mt-20"
      aria-labelledby="results-heading"
    >
      {/* ========================================================= */}
      {/* CAMADA DE BACKGROUND CINEMATOGRÁFICO SUPERIOR            */}
      {/* Montanhas ao pôr do sol, curvas de luz e silhueta         */}
      {/* ========================================================= */}
      <div className="absolute top-0 right-0 left-0 h-[720px] lg:h-[820px] pointer-events-none overflow-hidden select-none">
        <Image
          src="/images/home/results/section-07-bg-desktop.webp"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-[center_top] md:object-[right_top] opacity-90 filter brightness-[0.95]"
        />

        {/* Gradientes direcionais para garantir legibilidade impecável dos textos e cards */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B12] via-[#070B12]/85 to-transparent md:to-[#070B12]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B12]/60 via-transparent to-[#070B12]" />

        {/* Glows ambientais sutis em Laranja Energia */}
        <div className="absolute top-1/3 left-1/4 w-[420px] h-[420px] bg-[#FF8A00]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[380px] h-[380px] bg-[#FF5B00]/10 rounded-full blur-[130px]" />
      </div>

      {/* ========================================================= */}
      {/* CONTEÚDO PRINCIPAL (HEADER + 3 CARDS + NOTA)             */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-12 sm:pb-16">
        {/* Top Tag & Header Editorial */}
        <div className="mb-12 sm:mb-16 lg:mb-20 max-w-3xl">
          <MotionFade triggerOnScroll direction="up" delay={0.1}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#FF8A00] font-semibold text-xs sm:text-sm tracking-widest uppercase">
                07
              </span>
              <span className="text-slate-500 font-medium text-xs sm:text-sm tracking-widest">
                /
              </span>
              <span className="text-[#FF8A00] font-semibold text-xs sm:text-sm tracking-widest uppercase">
                RESULTADOS & EVIDÊNCIAS
              </span>
            </div>
          </MotionFade>

          <MotionFade triggerOnScroll direction="up" delay={0.15}>
            <h2
              id="results-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-5"
            >
              Antes de falar sobre resultados, aprendemos{" "}
              <span className="text-[#FF8A00] block sm:inline">
                a construí-los.
              </span>
            </h2>
          </MotionFade>

          <MotionFade triggerOnScroll direction="up" delay={0.2}>
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Nossa visão de negócios foi construída na prática, em posições de
              liderança, direção estratégica e expansão de operações.
            </p>
          </MotionFade>
        </div>

        {/* ========================================================= */}
        {/* TRÊS INDICADORES / CARDS                                  */}
        {/* Desktop: Composição horizontal lado a lado                */}
        {/* Mobile: Cards responsivos empilhados confortáveis         */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 mb-6">
          {RESULT_CARDS.map((card, index) => (
            <MotionFade
              key={card.id}
              triggerOnScroll
              direction="up"
              delay={0.25 + index * 0.1}
            >
              <div className="group relative rounded-2xl bg-[#0B1220]/75 hover:bg-[#0B1220]/90 border border-white/[0.08] hover:border-[#FF8A00]/40 p-6 sm:p-7 lg:p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex flex-col justify-between h-full">
                {/* Glow sutil ao passar o cursor */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FF8A00]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Ícone com moldura circular laranja */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#FF8A00]/40 bg-[#FF8A00]/10 flex items-center justify-center mb-6 group-hover:border-[#FF8A00] transition-colors">
                    {card.icon}
                  </div>

                  {/* Número / Indicador de Grande Protagonismo */}
                  <div className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#FF8A00] tracking-tight leading-none mb-2">
                    {card.metric}
                  </div>

                  {/* Categoria em Caixa Alta */}
                  <div className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase mb-1">
                    {card.category}
                  </div>

                  {/* Função / Contexto Profissional */}
                  <div className="text-xs font-medium text-slate-400 mb-5 sm:mb-6">
                    {card.role}
                  </div>
                </div>

                {/* Descrição Narrativa */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </MotionFade>
          ))}
        </div>

        {/* Nota de Transparência */}
        <MotionFade triggerOnScroll direction="up" delay={0.55}>
          <div className="flex items-center gap-2.5 pt-2 text-slate-400 text-xs sm:text-[13px] tracking-wide">
            <span className="w-6 h-[2px] rounded-full bg-[#FF8A00] inline-block flex-shrink-0" />
            <span>
              Resultados associados à experiência profissional de liderança e
              gestão em operações anteriores à A2Max.
            </span>
          </div>
        </MotionFade>

        {/* ========================================================= */}
        {/* BLOCO DE CONVERSÃO CTA COM BACKGROUND ABSTRATO            */}
        {/* Ondas de energia laranja + checklist + botão para ação     */}
        {/* ========================================================= */}
        <MotionFade triggerOnScroll direction="up" delay={0.6}>
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.12] bg-[#070B12] shadow-2xl mt-14 sm:mt-18 lg:mt-24">
            {/* Background abstrato da área de conversão */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <Image
                src="/images/home/results/section-07-cta-bg-desktop.webp"
                alt=""
                fill
                priority={false}
                sizes="100vw"
                className="object-cover object-center opacity-85 filter brightness-105"
              />
              {/* Overlay suave para legibilidade editorial */}
              <div className="absolute inset-0 bg-[#070B12]/80 lg:bg-[#070B12]/60" />
            </div>

            {/* Conteúdo interno do CTA */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-12 xl:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Lado Esquerdo: Headline, Texto e Botão */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Toda transformação começa entendendo{" "}
                    <span className="text-[#FF8A00]">o cenário atual.</span>
                  </h3>

                  <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                    Faça uma análise gratuita da sua empresa e descubra onde
                    estão os principais gargalos e as maiores oportunidades de
                    crescimento.
                  </p>

                  <div className="pt-2 sm:pt-4">
                    <Link
                      href="#diagnostico"
                      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 sm:px-9 py-4 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FF5B00] text-azul-noite text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-[0_4px_24px_rgba(255,138,0,0.35)] hover:shadow-[0_6px_32px_rgba(255,138,0,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                    >
                      <span>FAÇA UMA ANÁLISE GRATUITA DA SUA EMPRESA</span>
                      <svg
                        className="w-4 h-4 text-azul-noite transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Lado Direito (Desktop): Checklist com moldura translúcida */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <div className="rounded-2xl border border-white/10 bg-[#070B12]/70 backdrop-blur-md p-5 sm:p-6 lg:p-7 space-y-3.5">
                    {CHECKLIST_ITEMS.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-200"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[#FF8A00] flex items-center justify-center text-[#FF8A00] bg-[#FF8A00]/10">
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionFade>
      </div>
    </section>
  );
}
