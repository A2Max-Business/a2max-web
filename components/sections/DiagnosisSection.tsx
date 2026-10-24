"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MotionFade,
  MOTION_DURATIONS,
  MOTION_STAGGER,
} from "@/components/motion";

interface DiagnosisStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const DIAGNOSIS_STEPS: DiagnosisStep[] = [
  {
    number: "01",
    title: "Diagnóstico do cenário atual",
    description:
      "Entenda onde sua empresa está hoje e quais são os principais desafios.",
    icon: (
      <svg
        className="w-5 h-5 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Identificação de oportunidades",
    description:
      "Descubra onde estão as maiores oportunidades de crescimento.",
    icon: (
      <svg
        className="w-5 h-5 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
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
    number: "03",
    title: "Recomendações práticas",
    description:
      "Receba direcionamentos objetivos e aplicáveis à sua realidade.",
    icon: (
      <svg
        className="w-5 h-5 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="m16.24 16.24 2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="m16.24 7.76 2.83-2.83" />
      </svg>
    ),
  },
];

interface TargetAudience {
  id: string;
  title: string;
  benefit: string;
  icon: React.ReactNode;
}

const TARGET_AUDIENCES: TargetAudience[] = [
  {
    id: "eventos",
    title: "Produtores e organizadores de eventos",
    benefit: "Mais público, mais vendas e operações mais eficientes.",
    icon: (
      <svg
        className="w-6 h-6 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "automotivo",
    title: "Auto centers e negócios do setor automotivo",
    benefit: "Mais clientes, mais faturamento e maior eficiência na operação.",
    icon: (
      <svg
        className="w-6 h-6 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
  {
    id: "locais",
    title: "Negócios locais",
    benefit:
      "Mais visibilidade, mais oportunidades e um atendimento que gera mais vendas.",
    icon: (
      <svg
        className="w-6 h-6 text-[#FF8A00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

export function DiagnosisSection() {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  return (
    <section
      id="diagnostico"
      className="relative w-full bg-[#F5F3EC] text-[#0B1220] overflow-hidden scroll-mt-20 py-20 sm:py-24 lg:py-32"
      aria-labelledby="diagnosis-heading"
    >
      {/* Background Decorativo Superior com Ondas Sutis */}
      <div className="absolute top-0 right-0 left-0 h-56 pointer-events-none overflow-hidden select-none opacity-20">
        <Image
          src="/images/home/diagnosis/section-09-accent-waves.webp"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* COMPOSIÇÃO PRINCIPAL EDITORIAL                            */}
        {/* Esquerda: Headline, texto, CTA em preparação, garantias   */}
        {/* Direita: Fotografia do especialista + cards flutuantes     */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-20 sm:mb-24">
          {/* LADO ESQUERDO: Texto e Ação com Entrada Editorial Progressiva */}
          <div className="lg:col-span-5 space-y-6">
            {/* Top Tag com acento laranja */}
            <MotionFade triggerOnScroll direction="up" delay={0.08} distance={12}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] rounded-full bg-[#FF8A00] inline-block" />
                <span className="text-[#FF8A00] font-bold text-xs sm:text-sm tracking-widest uppercase">
                  09
                </span>
                <span className="text-slate-400 font-medium text-xs sm:text-sm">
                  /
                </span>
                <span className="text-[#FF8A00] font-bold text-xs sm:text-sm tracking-widest uppercase">
                  DIAGNÓSTICO EMPRESARIAL
                </span>
              </div>
            </MotionFade>

            {/* Headline Principal */}
            <MotionFade triggerOnScroll direction="up" delay={0.16} distance={14}>
              <h2
                id="diagnosis-heading"
                className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1220] tracking-tight leading-[1.18]"
              >
                Seu negócio tem desafios. Nós temos experiência para{" "}
                <span className="text-[#FF8A00]">ajudar a resolvê-los.</span>
              </h2>
            </MotionFade>

            {/* Texto Descritivo */}
            <MotionFade triggerOnScroll direction="up" delay={0.24} distance={12}>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                Faça uma análise gratuita da sua empresa e descubra onde estão os
                principais gargalos e as maiores oportunidades de crescimento.
              </p>
            </MotionFade>

            {/* CTA Preparado para Integração Conversacional Futura */}
            <MotionFade triggerOnScroll direction="up" delay={0.32} distance={12}>
              <div className="space-y-4 pt-2">
                <div className="relative inline-block w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsNoticeOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={isNoticeOpen}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FF5B00] text-azul-noite text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-[0_4px_24px_rgba(255,138,0,0.35)] hover:shadow-[0_6px_32px_rgba(255,138,0,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 focus:ring-offset-[#F5F3EC]"
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
                  </button>

                  {/* Badge sutil informando prontidão e status técnico */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
                    <span>Canal conversacional inteligente em fase de preparação</span>
                  </div>
                </div>

                {/* 3 Micro-garantias / Indicadores de Confiança */}
                <div className="pt-4 border-t border-[#0B1220]/08 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
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
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    </div>
                    <span>Rápido e sem compromisso</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
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
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    </div>
                    <span>Insights práticos para seu negócio</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <span>Conduzido por especialistas da A2Max</span>
                  </div>
                </div>
              </div>
            </MotionFade>
          </div>

          {/* LADO DIREITO: Composição Visual com Revelação Suave e Enquadramento Intacto */}
          <div className="lg:col-span-7 relative">
            {/*
              Revelação Suave da Fotografia:
              direction="none" garante fade puro de opacidade sem translação vertical,
              preservando com 100% de estabilidade o enquadramento corrigido do especialista.
            */}
            <MotionFade
              triggerOnScroll
              direction="none"
              duration={MOTION_DURATIONS.cinematic}
              delay={0.2}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-[0_16px_48px_rgba(11,18,32,0.12)] border border-[#0B1220]/10 bg-white">
                {/*
                  Container da Fotografia:
                  Preservação integral do enquadramento aprovado (80% a 85% à direita),
                  com altura proporcional e rosto, olhar, notebook e caneca 100% visíveis.
                */}
                <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[540px]">
                  <Image
                    src="/images/home/diagnosis/section-09-bg-desktop.webp"
                    alt="Especialista da A2Max analisando indicadores de crescimento no notebook"
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover object-[80%_15%] sm:object-[82%_15%] lg:object-[82%_12%] transition-all duration-500"
                    priority={false}
                  />
                  {/* Gradiente sutil para harmonização visual e leitura dos cards */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Badge Flutuante Escuro sobre a Imagem no canto inferior direito */}
                <div className="absolute bottom-6 right-6 max-w-xs rounded-2xl bg-[#0B1220]/90 backdrop-blur-md p-4 sm:p-5 border border-white/10 text-white shadow-xl hidden sm:flex items-start gap-3.5 z-10 pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/20 border border-[#FF8A00]/40 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold leading-snug">
                      Transforme desafios em oportunidades reais de{" "}
                      <span className="text-[#FF8A00]">crescimento.</span>
                    </p>
                  </div>
                </div>
              </div>
            </MotionFade>

            {/*
              As 3 Etapas em Cards Claros Flutuantes com Stagger Oficial:
              Desktop: Sobreposição lateral esquerda suave (lg:-left-6 lg:w-72 xl:-left-10 xl:w-80),
              ficando sobre a área de janela clara e deixando o especialista na direita 100% visível e desobstruído.
              Mobile/Tablet: Fica posicionado logo abaixo da foto com espaçamento confortável.
            */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:top-8 lg:-left-6 xl:-left-10 lg:w-72 xl:w-80 space-y-3.5 z-20">
              {DIAGNOSIS_STEPS.map((step, index) => {
                // Stagger progressivo oficial (0.30 + index * 0.10) com deslocamento vertical discreto
                const stepDelay = 0.3 + index * 0.1;

                return (
                  <MotionFade
                    key={step.number}
                    triggerOnScroll
                    direction="up"
                    distance={10}
                    delay={stepDelay}
                    duration={MOTION_DURATIONS.standard}
                  >
                    <div className="rounded-2xl bg-white/95 border border-[#0B1220]/10 p-4 sm:p-5 shadow-[0_10px_28px_rgba(11,18,32,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(11,18,32,0.12)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
                            {step.icon}
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-[#0B1220]">
                            {step.title}
                          </h3>
                        </div>
                        <span className="text-xs font-extrabold text-[#FF8A00] tracking-wider">
                          {step.number}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-10">
                        {step.description}
                      </p>
                    </div>
                  </MotionFade>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BLOCO INFERIOR "PARA QUEM É"                              */}
        {/* Animação com Stagger nos 3 Públicos Atendidos             */}
        {/* ========================================================= */}
        <MotionFade triggerOnScroll direction="up" delay={0.2} distance={14}>
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#0B1220]/10 shadow-[0_12px_36px_rgba(11,18,32,0.06)] p-6 sm:p-10 lg:p-12">
            {/* Header do Bloco */}
            <div className="mb-8 max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-[2px] rounded-full bg-[#FF8A00] inline-block" />
                <span className="text-[#FF8A00] font-bold text-xs tracking-widest uppercase">
                  PARA QUEM É
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight leading-tight">
                Essa análise é para empresas que querem{" "}
                <span className="text-[#FF8A00]">crescer com consistência.</span>
              </h3>
            </div>

            {/* Grid dos 3 Públicos com Stagger Suave */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              {TARGET_AUDIENCES.map((target, index) => {
                const targetDelay = 0.3 + index * MOTION_STAGGER.standard;

                return (
                  <MotionFade
                    key={target.id}
                    triggerOnScroll
                    direction="up"
                    distance={12}
                    delay={targetDelay}
                    duration={MOTION_DURATIONS.standard}
                  >
                    <div className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-[#F5F3EC]/50 border border-[#0B1220]/05 hover:border-[#FF8A00]/30 hover:-translate-y-1 transition-all duration-300">
                      <div className="w-11 h-11 rounded-xl bg-[#FF8A00]/10 border border-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00]">
                        {target.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#0B1220] leading-snug mb-1">
                          {target.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {target.benefit}
                        </p>
                      </div>
                    </div>
                  </MotionFade>
                );
              })}
            </div>
          </div>
        </MotionFade>
      </div>

      {/* ========================================================= */}
      {/* MODAL / DIÁLOGO ACESSÍVEL DE STATUS DA INTEGRAÇÃO         */}
      {/* Informa com transparência e elegância o estado técnico     */}
      {/* ========================================================= */}
      {isNoticeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0B1220] border border-white/10 p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/20 border border-[#FF8A00]/40 flex items-center justify-center text-[#FF8A00]">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8A00]">
                    Canal em Preparação
                  </span>
                  <h4 id="modal-title" className="text-lg font-bold text-white">
                    Diagnóstico Empresarial A2Max
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNoticeOpen(false)}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
                aria-label="Fechar aviso"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              O fluxo de análise interativa gratuita está sendo integrado à plataforma{" "}
              <strong className="text-white">EuAttendo</strong> com agentes de IA
              conversacional especializados em auditoria comercial e de processos.
            </p>

            <div className="rounded-xl bg-white/05 border border-white/10 p-4 mb-6 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                <span>Tratamento confidencial de métricas empresariais</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                <span>Avaliação do cenário atual e oportunidades prioritárias</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                <span>Integração homologada com agentes conversacionais</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsNoticeOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-[#FF8A00] text-[#0B1220] text-xs font-bold uppercase tracking-wider hover:bg-[#FF8A00]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
