"use client";

import Image from "next/image";
import { MotionFade } from "@/components/motion";

interface BrandItem {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  className?: string;
}

const BRANDS: BrandItem[] = [
  {
    id: "tonelli",
    name: "Tonelli Pneus",
    src: "/images/home/people/brands/tonelli-pneus.png",
    width: 600,
    height: 400,
    className: "h-9 w-auto",
  },
  {
    id: "pneuz",
    name: "PneuZ",
    src: "/images/home/people/brands/pneuz.png",
    width: 256,
    height: 256,
    className: "h-9 w-auto",
  },
  {
    id: "impacto-prime",
    name: "Impacto Prime",
    src: "/images/home/people/brands/impacto-prime.png",
    width: 415,
    height: 202,
    className: "h-9 w-auto",
  },
  {
    id: "techfala",
    name: "Techfala",
    src: "/images/home/people/brands/techfala.png",
    width: 120,
    height: 37,
    className: "h-8 w-auto",
  },
  {
    id: "monaco",
    name: "Mônaco Lounge & Bar",
    src: "/images/home/people/brands/monaco-lounge.png",
    width: 600,
    height: 400,
    className: "h-10 w-auto",
  },
  {
    id: "sanjaworks",
    name: "Sanjaworks",
    src: "/images/home/people/brands/sanjaworks.png",
    width: 415,
    height: 202,
    className: "h-8 w-auto",
  },
  {
    id: "varandas",
    name: "Varanda's Lounge & Bar",
    src: "/images/home/people/brands/varandas-lounge.png",
    width: 600,
    height: 400,
    className: "h-11 w-auto",
  },
  {
    id: "abucci",
    name: "Grupo Abucci",
    src: "/images/home/people/brands/grupo-abucci.png",
    width: 890,
    height: 470,
    className: "h-11 w-auto",
  },
  {
    id: "gigante-pneus",
    name: "Gigante Pneus",
    src: "/images/home/people/brands/gigante-pneus.png",
    width: 951,
    height: 174,
    className: "h-9 w-auto",
  },
  {
    id: "eliane-pavelqueires",
    name: "Eliane Pavelqueires — Regulariza Nome",
    src: "/images/home/people/brands/eliane-pavelqueires.png",
    width: 924,
    height: 880,
    className: "h-11 w-auto",
  },
  {
    id: "gba",
    name: "GBA — Centro Técnico",
    src: "/images/home/people/brands/gba-centro-tecnico.png",
    width: 804,
    height: 820,
    className: "h-11 w-auto",
  },
  {
    id: "usi",
    name: "USI Comércio",
    src: "/images/home/people/brands/usi-comercio.png",
    width: 1500,
    height: 784,
    className: "h-10 w-auto",
  },
  {
    id: "gigante-medicos",
    name: "Gigante Produtos Médicos",
    src: "/images/home/people/brands/gigante-produtos-medicos.png",
    width: 150,
    height: 100,
    className: "h-9 w-auto",
  },
];

const ALEX_SKILLS = [
  {
    title: "ESTRATÉGIA E NEGÓCIOS",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "OPERAÇÃO E PROCESSOS",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    title: "DADOS E TECNOLOGIA",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    title: "MARKETING E COMUNICAÇÃO",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    title: "GESTÃO E CRESCIMENTO",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const ANGELA_SKILLS = [
  {
    title: "PROSPECÇÃO E GESTÃO DE CONTAS",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
  },
  {
    title: "ATENDIMENTO E SUPORTE",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "ORGANIZAÇÃO E ROTINAS ADMINISTRATIVAS",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "RESOLUÇÃO DE PROBLEMAS",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "RELACIONAMENTO E FIDELIZAÇÃO",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export function PeopleSection() {
  return (
    <section
      id="pessoas"
      aria-label="Pessoas & Experiência — Quem está por trás da A2Max"
      className="relative w-full overflow-hidden bg-[#070B12] text-white"
    >
      {/* Background corporativo com iluminação âmbar cinematográfica */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/home/people/section-06-bg-desktop.png"
          alt=""
          fill
          priority={false}
          className="object-cover object-center opacity-30 mix-blend-screen"
        />
        {/* Glows ambientais para profundidade */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FF8A00]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#FF5B00]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B12]/80 via-transparent to-[#070B12]" />
      </div>

      <div className="relative z-10 w-full pt-10 sm:pt-12 lg:pt-14 pb-8 sm:pb-12 lg:pb-14">
        {/* Top Tag & Cabeçalho Editorial — Espaçamento vertical otimizado */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionFade triggerOnScroll direction="up" delay={0.1}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#FF8A00] font-semibold text-xs sm:text-sm tracking-widest uppercase">
                06
              </span>
              <span className="w-8 h-[1px] bg-[#FF8A00]/60 inline-block" />
              <span className="text-slate-400 font-medium text-xs sm:text-sm tracking-wider uppercase">
                QUEM ESTÁ POR TRÁS
              </span>
            </div>
          </MotionFade>

          {/* Bloco Editorial de Entrada — Conexão mais próxima com os retratos */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-8">
            <MotionFade triggerOnScroll direction="up" delay={0.15}>
              <span className="inline-block text-[#FF8A00] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-2">
                PESSOAS QUE FAZEM ACONTECER
              </span>
            </MotionFade>

            <MotionFade triggerOnScroll direction="up" delay={0.2}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight mb-3">
                Experiências diferentes.{" "}
                <span className="text-[#FF8A00] block sm:inline">
                  Uma mesma visão de negócio.
                </span>
              </h2>
            </MotionFade>

            <MotionFade triggerOnScroll direction="up" delay={0.25}>
              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
                A A2Max nasce da combinação de trajetórias complementares, unindo
                operação, tecnologia, marketing, gestão e um profundo conhecimento
                de negócios reais.
              </p>
            </MotionFade>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP (>= lg): COMPOSIÇÃO HORIZONTAL COM RETRATOS DOMINANTES */}
        {/* Ordem: Descrição Alex -> Foto Alex -> Logo A2Max -> Foto Angela -> Descrição Angela */}
        {/* Altura das fotos: 480px a 540px aparente                         */}
        {/* ========================================================= */}
        <div className="hidden lg:block max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-10 mb-4">
          <div className="grid grid-cols-[minmax(190px,1fr)_minmax(320px,1.8fr)_auto_minmax(320px,1.8fr)_minmax(190px,1fr)] items-center gap-3 xl:gap-6">
            {/* 1. Alex Ignacio — Descrição & Informações Institucionais (Extremidade Esquerda) */}
            <div className="z-10 text-left">
              <MotionFade triggerOnScroll direction="up" delay={0.3}>
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FF8A00]/10 border border-[#FF8A00]/25 text-[#FF8A00] text-[10px] xl:text-[11px] font-bold tracking-wider uppercase">
                    Founder
                  </span>
                  <div>
                    <h3 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                      Alex Ignacio
                    </h3>
                    <p className="text-[10px] xl:text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1">
                      ESTRATÉGIA · OPERAÇÃO · TECNOLOGIA · CRESCIMENTO
                    </p>
                  </div>
                  <p className="text-slate-300 text-xs xl:text-sm leading-relaxed">
                    Mais de 25 anos de experiência em operação, marketing, comercial e
                    tecnologia. Atuação em empresas de diferentes setores, liderando
                    projetos de crescimento, expansão e transformação digital.
                  </p>
                </div>
              </MotionFade>
            </div>

            {/* 2. Fotografia Grande e Dominante de Alex Ignacio (480px a 540px) */}
            <div className="relative flex justify-center items-end self-end">
              <MotionFade triggerOnScroll direction="up" delay={0.35} className="w-full">
                <div className="relative w-full h-[470px] xl:h-[520px] 2xl:h-[550px] overflow-hidden bg-transparent">
                  <Image
                    src="/images/home/people/alex.png"
                    alt="Alex Ignacio — Fundador A2Max"
                    fill
                    priority={false}
                    sizes="(max-width: 1440px) 35vw, 500px"
                    className="object-cover object-[center_top] drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] filter brightness-[0.98] contrast-[1.03]"
                  />
                </div>
              </MotionFade>
            </div>

            {/* 3. Logo Oficial A2Max Centralizada Entre as Fotografias (Eixo Visual) */}
            <div className="relative z-20 flex flex-col items-center justify-center px-1 xl:px-3">
              <MotionFade triggerOnScroll direction="up" delay={0.4}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute -inset-6 bg-[#FF8A00]/20 rounded-full blur-xl pointer-events-none" />
                  <Image
                    src="/logos/a2max-darkmode.png"
                    alt="A2Max — Performance e Inteligência de Negócios"
                    width={180}
                    height={46}
                    className="relative w-28 xl:w-36 h-auto object-contain drop-shadow-[0_4px_24px_rgba(255,138,0,0.35)]"
                  />
                </div>
              </MotionFade>
            </div>

            {/* 4. Fotografia Grande e Dominante de Angela Leonardo (480px a 540px) */}
            <div className="relative flex justify-center items-end self-end">
              <MotionFade triggerOnScroll direction="up" delay={0.45} className="w-full">
                <div className="relative w-full h-[470px] xl:h-[520px] 2xl:h-[550px] overflow-hidden bg-transparent">
                  <Image
                    src="/images/home/people/angela.png"
                    alt="Angela Leonardo"
                    fill
                    priority={false}
                    sizes="(max-width: 1440px) 35vw, 500px"
                    className="object-cover object-[center_top] drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] filter brightness-[0.98] contrast-[1.03]"
                  />
                </div>
              </MotionFade>
            </div>

            {/* 5. Angela Leonardo — Descrição & Informações Institucionais (Extremidade Direita) */}
            <div className="z-10 text-left">
              <MotionFade triggerOnScroll direction="up" delay={0.5}>
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FF8A00]/10 border border-[#FF8A00]/25 text-[#FF8A00] text-[10px] xl:text-[11px] font-bold tracking-wider uppercase">
                    Co-Founder
                  </span>
                  <div>
                    <h3 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                      Angela Leonardo
                    </h3>
                    <p className="text-[10px] xl:text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1">
                      GESTÃO · PESSOAS · RELACIONAMENTO · RESULTADOS
                    </p>
                  </div>
                  <p className="text-slate-300 text-xs xl:text-sm leading-relaxed">
                    Representante comercial e televendas, com experiência em
                    prospecção e solução de problemas complexos rapidamente,
                    ganhando a lealdade dos clientes. Atuação em atendimento,
                    suporte e gestão de contas em diferentes segmentos.
                  </p>
                </div>
              </MotionFade>
            </div>
          </div>

          {/* ========================================================= */}
          {/* LINHA INFERIOR DE COMPETÊNCIAS (ÁREA ESCURA DESKTOP)       */}
          {/* Alinhada visualmente abaixo das fotografias                */}
          {/* ========================================================= */}
          <div className="pt-6 border-t border-white/[0.08] mt-2">
            <MotionFade triggerOnScroll direction="up" delay={0.55}>
              <div className="grid grid-cols-2 gap-8 xl:gap-14">
                {/* Competências de Alex (Lado Esquerdo, alinhadas à esquerda) */}
                <div>
                  <div className="flex items-center justify-start gap-2 mb-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                    <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                      Competências & Áreas de Atuação — Alex Ignacio
                    </h4>
                  </div>
                  <ul className="flex flex-wrap justify-start gap-2" role="list">
                    {ALEX_SKILLS.map((skill) => (
                      <li
                        key={`dkt-alex-${skill.title}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-[11px] font-medium text-slate-200 tracking-wide hover:border-[#FF8A00]/40 hover:bg-white/[0.06] transition-all"
                      >
                        <span className="flex-shrink-0">{skill.icon}</span>
                        <span>{skill.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Competências de Angela (Lado Direito, alinhadas à direita) */}
                <div>
                  <div className="flex items-center justify-end gap-2 mb-2.5">
                    <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest text-right">
                      Competências & Áreas de Atuação — Angela Leonardo
                    </h4>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                  </div>
                  <ul className="flex flex-wrap justify-end gap-2" role="list">
                    {ANGELA_SKILLS.map((skill) => (
                      <li
                        key={`dkt-angela-${skill.title}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-[11px] font-medium text-slate-200 tracking-wide hover:border-[#FF8A00]/40 hover:bg-white/[0.06] transition-all"
                      >
                        <span className="flex-shrink-0">{skill.icon}</span>
                        <span>{skill.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </MotionFade>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE & TABLET (< lg): EMPILHAMENTO RESPONSIVO AMPLIADO */}
        {/* ========================================================= */}
        <div className="lg:hidden max-w-xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Logo A2Max Central no Mobile */}
          <MotionFade triggerOnScroll direction="up" delay={0.25}>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#FF8A00]/15 rounded-full blur-lg pointer-events-none" />
                <Image
                  src="/logos/a2max-darkmode.png"
                  alt="A2Max — Performance e Inteligência de Negócios"
                  width={150}
                  height={38}
                  className="relative w-32 h-auto object-contain drop-shadow-[0_2px_16px_rgba(255,138,0,0.3)]"
                />
              </div>
            </div>
          </MotionFade>

          {/* Perfil Alex Ignacio Mobile — Retrato Ampliado */}
          <div className="space-y-5">
            <MotionFade triggerOnScroll direction="up" delay={0.3}>
              <div className="relative w-full max-w-[360px] h-[420px] sm:h-[460px] mx-auto overflow-hidden bg-transparent">
                <Image
                  src="/images/home/people/alex.png"
                  alt="Alex Ignacio — Fundador A2Max"
                  fill
                  priority={false}
                  sizes="100vw"
                  className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
                />
              </div>
            </MotionFade>

            <MotionFade triggerOnScroll direction="up" delay={0.35}>
              <div className="space-y-3 text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FF8A00]/10 border border-[#FF8A00]/25 text-[#FF8A00] text-[10px] font-bold tracking-wider uppercase">
                  Founder
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Alex Ignacio
                </h3>
                <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  ESTRATÉGIA · OPERAÇÃO · TECNOLOGIA · CRESCIMENTO
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Mais de 25 anos de experiência em operação, marketing, comercial e
                  tecnologia. Atuação em empresas de diferentes setores, liderando
                  projetos de crescimento, expansão e transformação digital.
                </p>

                {/* Competências Alex Mobile */}
                <div className="pt-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Competências & Áreas de Atuação
                  </h4>
                  <ul className="flex flex-wrap gap-2" role="list">
                    {ALEX_SKILLS.map((skill) => (
                      <li
                        key={`mob-alex-${skill.title}`}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-slate-200"
                      >
                        <span className="flex-shrink-0">{skill.icon}</span>
                        <span>{skill.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </MotionFade>
          </div>

          {/* Divisor Sutil entre Perfis no Mobile */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

          {/* Perfil Angela Leonardo Mobile — Retrato Ampliado */}
          <div className="space-y-5">
            <MotionFade triggerOnScroll direction="up" delay={0.4}>
              <div className="relative w-full max-w-[360px] h-[420px] sm:h-[460px] mx-auto overflow-hidden bg-transparent">
                <Image
                  src="/images/home/people/angela.png"
                  alt="Angela Leonardo"
                  fill
                  priority={false}
                  sizes="100vw"
                  className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
                />
              </div>
            </MotionFade>

            <MotionFade triggerOnScroll direction="up" delay={0.45}>
              <div className="space-y-3 text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FF8A00]/10 border border-[#FF8A00]/25 text-[#FF8A00] text-[10px] font-bold tracking-wider uppercase">
                  Co-Founder
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Angela Leonardo
                </h3>
                <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  GESTÃO · PESSOAS · RELACIONAMENTO · RESULTADOS
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Representante comercial e televendas, com experiência em
                  prospecção e solução de problemas complexos rapidamente,
                  ganhando a lealdade dos clientes. Atuação em atendimento,
                  suporte e gestão de contas em diferentes segmentos.
                </p>

                {/* Competências Angela Mobile */}
                <div className="pt-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Competências & Áreas de Atuação
                  </h4>
                  <ul className="flex flex-wrap gap-2" role="list">
                    {ANGELA_SKILLS.map((skill) => (
                      <li
                        key={`mob-angela-${skill.title}`}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-slate-200"
                      >
                        <span className="flex-shrink-0">{skill.icon}</span>
                        <span>{skill.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </MotionFade>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FAIXA INFERIOR CLARA — EXPERIÊNCIA NO MERCADO             */}
      {/* ========================================================= */}
      <div
        className="w-full bg-[#F8FAFC] text-slate-900 border-t border-slate-200/90 relative z-20 py-12 lg:py-16"
        role="region"
        aria-label="Experiência no mercado e trajetória das marcas"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Faixa */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-10">
            <div className="lg:col-span-6">
              <MotionFade triggerOnScroll direction="up" delay={0.1}>
                <span className="inline-block text-[#FF8A00] font-semibold text-xs tracking-widest uppercase mb-2">
                  EXPERIÊNCIA NO MERCADO ───
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Experiência construída na prática.
                </h3>
              </MotionFade>
            </div>

            <div className="lg:col-span-6 lg:text-right">
              <MotionFade triggerOnScroll direction="up" delay={0.15}>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed lg:max-w-md lg:ml-auto">
                  Ao longo de nossas trajetórias profissionais, participamos de
                  projetos, operações e negócios em diferentes mercados, gerando
                  resultados e ajudando empresas a crescerem.
                </p>
              </MotionFade>
            </div>
          </div>
        </div>

        {/* Carrossel Infinito com as 13 Marcas */}
        <div className="relative w-full overflow-hidden py-4 sm:py-6">
          {/* Gradientes laterais para fusão fluida */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

          {/* Faixa Marquee */}
          <div
            className="animate-marquee items-center gap-8 sm:gap-14 px-4"
            tabIndex={0}
            role="list"
            aria-label="Logotipos das marcas em que nossa equipe atuou"
          >
            {/* Primeiro conjunto de marcas (visível e acessível) */}
            {BRANDS.map((brand) => (
              <div
                key={`brand-1-${brand.id}`}
                role="listitem"
                className="flex-shrink-0 flex items-center justify-center px-4 py-2 transition-transform duration-200 hover:scale-105 focus-within:scale-105"
              >
                <div className="relative flex items-center justify-center">
                  <Image
                    src={brand.src}
                    alt={`Logo ${brand.name}`}
                    width={brand.width}
                    height={brand.height}
                    className={`${brand.className || "h-9 w-auto"} object-contain`}
                  />
                </div>
              </div>
            ))}

            {/* Segundo conjunto de marcas (duplicação visual para loop contínuo) */}
            {BRANDS.map((brand) => (
              <div
                key={`brand-2-${brand.id}`}
                aria-hidden="true"
                className="flex-shrink-0 flex items-center justify-center px-4 py-2 transition-transform duration-200 hover:scale-105 focus-within:scale-105"
              >
                <div className="relative flex items-center justify-center">
                  <Image
                    src={brand.src}
                    alt=""
                    width={brand.width}
                    height={brand.height}
                    className={`${brand.className || "h-9 w-auto"} object-contain`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé da Faixa de Marcas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <MotionFade triggerOnScroll direction="up" delay={0.2}>
            <div className="flex items-center justify-center gap-4 text-center">
              <span className="hidden sm:inline-block w-16 xl:w-28 h-[1px] bg-slate-300" />
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
                DIFERENTES MERCADOS. UM MESMO PROPÓSITO: TRANSFORMAR NEGÓCIOS EM
                RESULTADOS.
              </p>
              <span className="hidden sm:inline-block w-16 xl:w-28 h-[1px] bg-slate-300" />
            </div>
          </MotionFade>
        </div>
      </div>
    </section>
  );
}
