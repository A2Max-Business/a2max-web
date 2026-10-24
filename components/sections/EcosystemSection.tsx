"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  MotionFade,
  MOTION_DURATIONS,
  MOTION_STAGGER,
  MOTION_TRANSITIONS,
} from "@/components/motion";

interface Competency {
  label: string;
  icon: React.ReactNode;
}

interface Specialty {
  id: string;
  tag?: string;
  title: string;
  summary: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  competencies: Competency[];
}

const SPECIALTIES: Specialty[] = [
  {
    id: "eventos",
    tag: "ESPECIALIDADE PRINCIPAL",
    title: "Eventos & Entretenimento",
    summary:
      "Da concepção à comercialização, da venda de ingressos à operação do evento.",
    description:
      "Da concepção à comercialização, da venda de ingressos à operação do evento. Entendemos os desafios de produtores, organizadores, promotores e equipes porque conhecemos a dinâmica desse mercado.",
    imageSrc: "/images/home/ecosystem/section-08-card-eventos.webp",
    imageAlt: "Show com iluminação de palco e multidão comemorando",
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
    competencies: [
      {
        label: "Produção",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },
      {
        label: "Bilheteria",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9z" />
            <line x1="13" y1="7" x2="13" y2="17" strokeDasharray="2 2" />
          </svg>
        ),
      },
      {
        label: "Divulgação",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
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
        label: "Gestão",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
      {
        label: "Experiência",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "automotivo",
    title: "Auto Centers & Mercado Automotivo",
    summary:
      "Experiência em gestão comercial, marketing, atendimento e expansão de operações.",
    description:
      "Experiência em gestão comercial, marketing, atendimento e expansão de operações do setor automotivo.",
    imageSrc: "/images/home/ecosystem/section-08-card-automotivo.webp",
    imageAlt: "Centro automotivo moderno com veículos em revisão",
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
    competencies: [
      {
        label: "Aquisição",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        ),
      },
      {
        label: "Vendas",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
      {
        label: "Atendimento",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        ),
      },
      {
        label: "Expansão",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        ),
      },
      {
        label: "Gestão",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "negocios-locais",
    title: "Negócios Locais",
    summary:
      "Ajudamos empresas que precisam ser encontradas e transformar atendimento em vendas.",
    description:
      "Ajudamos empresas que precisam ser encontradas, atrair oportunidades e transformar atendimento em vendas, com soluções compatíveis com sua realidade.",
    imageSrc: "/images/home/ecosystem/section-08-card-negocios.webp",
    imageAlt: "Fachada de negócio local acolhedor com clientes",
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
    competencies: [
      {
        label: "Presença",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        ),
      },
      {
        label: "Google",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ),
      },
      {
        label: "Marketing",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
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
        label: "Atendimento",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        ),
      },
      {
        label: "Processos",
        icon: (
          <svg
            className="w-4 h-4 text-[#FF8A00]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
];

interface TechProduct {
  id: string;
  name: string;
  description: string;
  complementary: string;
  features: string[];
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  logoClassName: string;
  icon?: React.ReactNode;
}

const TECH_PRODUCTS: TechProduct[] = [
  {
    id: "a2tickets360",
    name: "A2Tickets360",
    description: "Bilheteria, inscrições e gestão da jornada de participantes.",
    complementary:
      "Plataforma completa de bilheteria e credenciamento com controle de lotes, validação de ingressos em tempo real, gestão financeira e dados de público.",
    features: [
      "Controle de lotes dinâmicos",
      "Credenciamento e check-in ágil",
      "Analytics de conversão",
    ],
    logoSrc: "/logos/ecosystem/a2tickets360.png",
    logoAlt: "Logo A2Tickets360",
    logoWidth: 1920,
    logoHeight: 1080,
    logoClassName: "h-11 sm:h-12 w-auto object-contain object-left",
  },
  {
    id: "a2sports360",
    name: "A2Sports360",
    description: "Gestão operacional de campeonatos e competições esportivas.",
    complementary:
      "Solução para organização de campeonatos esportivos, gestão de tabelas, sumulas em tempo real, ranking de atletas e integrações com canais de divulgação.",
    features: [
      "Tabelas e chaveamentos automáticos",
      "Súmula eletrônica ao vivo",
      "Portal do atleta e equipe",
    ],
    logoSrc: "/logos/ecosystem/a2sports360.png",
    logoAlt: "Logo A2Sports360",
    logoWidth: 1500,
    logoHeight: 1500,
    logoClassName: "h-12 sm:h-13 w-auto object-contain object-left",
  },
  {
    id: "euattendo",
    name: "EuAttendo",
    description: "CRM, atendimento e automações comerciais com agentes de IA.",
    complementary:
      "Atendimento e qualificação inteligente com agentes de IA multicanal (WhatsApp e web), distribuindo leads e sincronizando dados diretamente com o CRM.",
    features: [
      "Agentes de IA treinados no seu negócio",
      "Disponibilidade 24 horas por dia",
      "Qualificação prévia de leads",
    ],
    logoSrc: "/logos/ecosystem/euattendo.png",
    logoAlt: "Logo EuAttendo",
    logoWidth: 1280,
    logoHeight: 608,
    logoClassName: "h-10 sm:h-11 w-auto object-contain object-left",
  },
  {
    id: "integracoes",
    name: "Integrações & Automação",
    description: "Conexão entre ferramentas, dados, processos e canais de aquisição.",
    complementary:
      "Conexão de ponta a ponta entre ferramentas de tráfego, plataformas de vendas, ERPs e mensageria para automação de rotinas e relatórios centralizados.",
    features: [
      "Webhooks e APIs centralizadas",
      "Sincronização de dados operacionais",
      "Eliminação de tarefas manuais",
    ],
    logoSrc: "/logos/ecosystem/integracoes.png",
    logoAlt: "Logo Integrações & Automação",
    logoWidth: 1254,
    logoHeight: 1254,
    logoClassName: "h-12 sm:h-13 w-auto object-contain object-left",
  },
];

export function EcosystemSection() {
  const shouldReduceMotion = useReducedMotion();

  // Estado dos Cards de Especialidade (Eventos abre como padrão conforme o mockup aprovado)
  const [expandedSpecialtyId, setExpandedSpecialtyId] = useState<string | null>(
    "eventos"
  );

  // Estado dos Cards do Ecossistema Tecnológico
  const [expandedEcoId, setExpandedEcoId] = useState<string | null>(null);

  const toggleSpecialty = (id: string) => {
    setExpandedSpecialtyId((prev) => (prev === id ? null : id));
  };

  const toggleEco = (id: string) => {
    setExpandedEcoId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="inteligencia"
      className="relative w-full bg-[#F5F3EC] text-[#0B1220] overflow-hidden scroll-mt-20 py-20 sm:py-24 lg:py-32"
      aria-labelledby="ecosystem-heading"
    >
      {/* Background Decorativo Superior (Foto de evento com silhueta e crowd) */}
      <div className="absolute top-0 right-0 left-0 h-[480px] sm:h-[540px] lg:h-[620px] pointer-events-none overflow-hidden select-none">
        <Image
          src="/images/home/ecosystem/section-08-bg-desktop.webp"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-right-top md:object-center opacity-40 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F3EC]/50 via-[#F5F3EC]/70 to-[#F5F3EC]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F3EC] via-[#F5F3EC]/80 to-transparent" />
      </div>

      {/* Ondas decorativas de acento laranja ao fundo */}
      <div className="absolute bottom-10 right-0 left-0 h-48 pointer-events-none overflow-hidden select-none opacity-25">
        <Image
          src="/images/home/ecosystem/section-08-accent-waves.webp"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER DA SEÇÃO 08 (EDITORIAL CLARO & PROGRESSIVO)         */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 sm:mb-18 lg:mb-20">
          <div className="max-w-3xl">
            {/* Top Tag com linha de acento */}
            <MotionFade triggerOnScroll direction="up" delay={0.08} distance={12}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-[2px] rounded-full bg-[#FF8A00] inline-block" />
                <span className="text-[#FF8A00] font-bold text-xs sm:text-sm tracking-widest uppercase">
                  08
                </span>
                <span className="text-slate-400 font-medium text-xs sm:text-sm">
                  /
                </span>
                <span className="text-[#FF8A00] font-bold text-xs sm:text-sm tracking-widest uppercase">
                  ECOSSISTEMA & ESPECIALIDADES
                </span>
              </div>
            </MotionFade>

            {/* Headline com destaque pontual */}
            <MotionFade triggerOnScroll direction="up" delay={0.16} distance={14}>
              <h2
                id="ecosystem-heading"
                className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1220] tracking-tight leading-[1.18] mb-5"
              >
                Não atuamos apenas em negócios. Construímos soluções para mercados
                que{" "}
                <span className="text-[#FF8A00] inline">
                  conhecemos por dentro.
                </span>
              </h2>
            </MotionFade>

            {/* Subheadline com tom experiente e direto */}
            <MotionFade triggerOnScroll direction="up" delay={0.24} distance={12}>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
                Experiência operacional, tecnologia e soluções especializadas para
                transformar desafios reais em oportunidades de crescimento.
              </p>
            </MotionFade>
          </div>

          {/* Card Flutuante de Confiança / Proposta de Valor */}
          <MotionFade triggerOnScroll direction="up" delay={0.3} distance={14}>
            <div className="lg:w-80 rounded-2xl bg-white/90 border border-[#0B1220]/10 p-5 sm:p-6 shadow-[0_8px_24px_rgba(11,18,32,0.06)] backdrop-blur-sm flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#FF8A00]/10 border border-[#FF8A00]/25 flex items-center justify-center flex-shrink-0 text-[#FF8A00]">
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
                <h3 className="text-sm font-bold text-[#0B1220] leading-snug">
                  Mercados reais.
                  <br />
                  Soluções que funcionam.
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Da estratégia à operação. Do planejamento ao resultado.
                </p>
              </div>
            </div>
          </MotionFade>
        </div>

        {/* ========================================================= */}
        {/* AS 3 ESPECIALIDADES DE MERCADO (CARDS EXPANSÍVEIS)        */}
        {/* Entrada com stagger progressivo: Eventos protagonismo     */}
        {/* Reorganização de grid fluida sem conflito com scroll      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 mb-20 sm:mb-24 items-start">
          {SPECIALTIES.map((spec, index) => {
            const isExpanded = expandedSpecialtyId === spec.id;

            // Distribuição de colunas em desktop: se expandido, ocupa mais espaço
            // Se nenhum card expandido, distribui igualmente em 4 colunas cada
            let colSpanClass = "lg:col-span-4";
            if (expandedSpecialtyId !== null) {
              colSpanClass = isExpanded ? "lg:col-span-6" : "lg:col-span-3";
            }

            // Escalonamento oficial: Eventos tem protagonismo e entra primeiro com duração cinematográfica
            const cardDelay = index === 0 ? 0.22 : 0.22 + index * MOTION_STAGGER.standard;
            const cardDuration = index === 0 ? MOTION_DURATIONS.cinematic : MOTION_DURATIONS.standard;

            return (
              <MotionFade
                key={spec.id}
                triggerOnScroll
                direction="up"
                distance={14}
                delay={cardDelay}
                duration={cardDuration}
                className={`${colSpanClass} transition-[grid-column] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
              >
                <article
                  className={`group relative rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    isExpanded
                      ? "bg-[#0B1220] text-white shadow-[0_18px_48px_rgba(11,18,32,0.22)] border border-[#FF8A00]/40 ring-1 ring-[#FF8A00]/20"
                      : "bg-white text-[#0B1220] shadow-[0_8px_28px_rgba(11,18,32,0.06)] border border-[#0B1220]/08 hover:border-[#FF8A00]/30 hover:-translate-y-1 hover:shadow-md"
                  }`}
                >
                  {/* Fotografia no Topo do Card */}
                  <div className="relative w-full h-44 sm:h-48 overflow-hidden">
                    <Image
                      src={spec.imageSrc}
                      alt={spec.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div
                      className={`absolute inset-0 ${
                        isExpanded
                          ? "bg-gradient-to-t from-[#0B1220] via-black/20 to-black/30"
                          : "bg-gradient-to-t from-white via-transparent to-black/10"
                      }`}
                    />

                    {/* Botão semântico de clique para expandir/fechar na imagem */}
                    <button
                      type="button"
                      id={`specialty-btn-${spec.id}`}
                      aria-expanded={isExpanded}
                      aria-controls={`specialty-panel-${spec.id}`}
                      onClick={() => toggleSpecialty(spec.id)}
                      className="absolute inset-0 w-full h-full cursor-pointer z-10 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-inset"
                      aria-label={`${isExpanded ? "Fechar" : "Abrir"} detalhes de ${spec.title}`}
                    />

                    {/* Indicador visual de toggle no canto superior */}
                    <div className="absolute top-3.5 right-3.5 z-20 pointer-events-none">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md transition-all duration-300 ${
                          isExpanded
                            ? "bg-[#FF8A00] text-[#0B1220] rotate-180"
                            : "bg-black/50 text-white group-hover:bg-[#FF8A00] group-hover:text-[#0B1220]"
                        }`}
                      >
                        <svg
                          className="w-4 h-4 transition-transform duration-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Cabeçalho Interativo do Card */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                    <div>
                      {/* Badge quando expandido ou de especialidade principal */}
                      {spec.tag && (
                        <div className="mb-3 inline-flex">
                          <span className="px-3 py-0.5 rounded-full bg-[#FF8A00] text-[#0B1220] text-[10px] font-extrabold uppercase tracking-wider">
                            {spec.tag}
                          </span>
                        </div>
                      )}

                      {/* Header com Ícone e Título */}
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`specialty-panel-${spec.id}`}
                        onClick={() => toggleSpecialty(spec.id)}
                        className="w-full text-left flex items-start gap-3 mb-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-300">
                          {spec.icon}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`text-base sm:text-lg font-bold tracking-tight leading-snug ${
                              isExpanded ? "text-white" : "text-[#0B1220]"
                            }`}
                          >
                            {spec.title}
                          </h3>
                          <span className="text-[11px] font-semibold text-[#FF8A00] mt-0.5 block">
                            {isExpanded
                              ? "Clique para recolher ▲"
                              : "Clique para expandir ▼"}
                          </span>
                        </div>
                      </button>

                      {/* Resumo inicial quando recolhido */}
                      {!isExpanded && (
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                          {spec.summary}
                        </p>
                      )}
                    </div>

                    {/* CONTEÚDO EXPANSÍVEL DO CARD (REVELADO AO CLICAR) */}
                    <motion.div
                      id={`specialty-panel-${spec.id}`}
                      role="region"
                      aria-labelledby={`specialty-btn-${spec.id}`}
                      initial={false}
                      animate={{
                        height: isExpanded ? "auto" : 0,
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : MOTION_DURATIONS.subtle,
                        ease: MOTION_TRANSITIONS.cinematic,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-white/10 mt-4 space-y-4">
                        {/* Descrição Detalhada */}
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {spec.description}
                        </p>

                        {/* Competências com Ícones */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8A00] block mb-2">
                            Competências & Entrega
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {spec.competencies.map((comp) => (
                              <div
                                key={comp.label}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/05 text-slate-200 border border-white/08 hover:border-[#FF8A00]/40 transition-colors"
                              >
                                <span className="flex-shrink-0">{comp.icon}</span>
                                <span className="truncate">{comp.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </article>
              </MotionFade>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* ECOSSISTEMA TECNOLÓGICO (LOGOS OFICIAIS INTEGRADAS)       */}
        {/* A2Tickets360, A2Sports360, EuAttendo, Integrações        */}
        {/* ========================================================= */}
        <div className="mb-20 sm:mb-24">
          {/* Header do Ecossistema */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <MotionFade triggerOnScroll direction="up" delay={0.08} distance={12}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-[2px] rounded-full bg-[#FF8A00] inline-block" />
                  <span className="text-[#FF8A00] font-bold text-xs tracking-widest uppercase">
                    TECNOLOGIA APLICADA À OPERAÇÃO
                  </span>
                </div>
              </MotionFade>

              <MotionFade triggerOnScroll direction="up" delay={0.16} distance={14}>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1220] tracking-tight leading-tight">
                  Um ecossistema que conecta do planejamento{" "}
                  <span className="text-[#FF8A00]">à execução.</span>
                </h3>
              </MotionFade>
            </div>

            <MotionFade triggerOnScroll direction="up" delay={0.24} distance={12}>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md">
                Soluções, plataformas e integrações que ajudam sua empresa a vender
                mais, atender melhor e operar com mais eficiência.
              </p>
            </MotionFade>
          </div>

          {/* Cards dos Produtos com as Logos Oficiais Integradas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {TECH_PRODUCTS.map((prod, index) => {
              const isEcoExpanded = expandedEcoId === prod.id;
              // Stagger progressivo oficial (0.20 + index * 0.08)
              const ecoDelay = 0.2 + index * MOTION_STAGGER.tight;

              return (
                <MotionFade
                  key={prod.id}
                  triggerOnScroll
                  direction="up"
                  distance={14}
                  delay={ecoDelay}
                  duration={MOTION_DURATIONS.standard}
                  className="h-full"
                >
                  <div
                    className={`group relative rounded-2xl bg-white border p-5 sm:p-6 shadow-[0_6px_20px_rgba(11,18,32,0.04)] transition-all duration-300 flex flex-col justify-between h-full ${
                      isEcoExpanded
                        ? "border-[#FF8A00] shadow-[0_12px_32px_rgba(255,138,0,0.12)] ring-1 ring-[#FF8A00]/20"
                        : "border-[#0B1220]/08 hover:shadow-[0_12px_30px_rgba(11,18,32,0.09)] hover:border-[#FF8A00]/40 hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex flex-col flex-grow">
                      {/* Topo: Logo Oficial + Botão Semântico de Expansão */}
                      <div className="flex items-center justify-between mb-4 h-14">
                        <div className="relative flex items-center h-full max-w-[170px]">
                          <Image
                            src={prod.logoSrc}
                            alt={prod.logoAlt}
                            width={prod.logoWidth}
                            height={prod.logoHeight}
                            className={`${prod.logoClassName} transition-transform duration-300 group-hover:scale-105`}
                            priority={false}
                          />
                        </div>

                        <button
                          type="button"
                          id={`eco-btn-${prod.id}`}
                          aria-expanded={isEcoExpanded}
                          aria-controls={`eco-details-${prod.id}`}
                          onClick={() => toggleEco(prod.id)}
                          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF8A00] ${
                            isEcoExpanded
                              ? "bg-[#FF8A00] text-[#0B1220] border-[#FF8A00] rotate-90 shadow-sm"
                              : "border-slate-200 text-slate-400 hover:text-[#FF8A00] hover:border-[#FF8A00]/40 hover:scale-105"
                          }`}
                          aria-label={`${isEcoExpanded ? "Recolher" : "Expandir"} detalhes de ${prod.name}`}
                        >
                          <svg
                            className="w-4 h-4"
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
                      </div>

                      {/* Nome do Produto em Destaque abaixo da Logo */}
                      <div className="min-h-[2.75rem] sm:min-h-[3rem] lg:min-h-[3.25rem] flex items-start mb-2">
                        <button
                          type="button"
                          aria-expanded={isEcoExpanded}
                          aria-controls={`eco-details-${prod.id}`}
                          onClick={() => toggleEco(prod.id)}
                          className="text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] rounded group/title"
                        >
                          <h4 className="text-base sm:text-lg font-bold text-[#0B1220] tracking-tight leading-snug group-hover/title:text-[#FF8A00] transition-colors duration-200">
                            {prod.name}
                          </h4>
                        </button>
                      </div>

                      {/* Descrição Principal */}
                      <div className="min-h-[4.25rem] sm:min-h-[4.5rem] lg:min-h-[4.75rem] flex items-start mb-4">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* Link sutil para expandir */}
                      <div className="mt-auto pt-1">
                        <button
                          type="button"
                          aria-expanded={isEcoExpanded}
                          aria-controls={`eco-details-${prod.id}`}
                          onClick={() => toggleEco(prod.id)}
                          className="text-[11px] font-bold text-[#FF8A00] hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF8A00] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>{isEcoExpanded ? "Fechar detalhes" : "Ver recursos"}</span>
                          <span aria-hidden="true" className="text-[9px]">{isEcoExpanded ? "▲" : "▼"}</span>
                        </button>
                      </div>
                    </div>

                    {/* CONTEÚDO EXPANSÍVEL DO PRODUTO (REVELADO AO CLICAR) */}
                    <motion.div
                      id={`eco-details-${prod.id}`}
                      role="region"
                      aria-labelledby={`eco-btn-${prod.id}`}
                      initial={false}
                      animate={{
                        height: isEcoExpanded ? "auto" : 0,
                        opacity: isEcoExpanded ? 1 : 0,
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : MOTION_DURATIONS.subtle,
                        ease: MOTION_TRANSITIONS.cinematic,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                        <p className="text-xs text-slate-600 leading-relaxed bg-[#F5F3EC]/70 p-3 rounded-xl border border-[#0B1220]/05">
                          {prod.complementary}
                        </p>
                        <ul className="space-y-1.5">
                          {prod.features.map((feat) => (
                            <li
                              key={feat}
                              className="flex items-center gap-2 text-[11px] font-medium text-slate-700"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] flex-shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                </MotionFade>
              );
            })}
          </div>

          {/* Nota Conceitual de Transparência */}
          <MotionFade triggerOnScroll direction="up" delay={0.4} distance={10}>
            <p className="mt-6 text-center text-xs text-slate-400">
              Representação conceitual do ecossistema. Na versão final,
              distinguiremos plataformas próprias, soluções integradas e produtos
              em desenvolvimento.
            </p>
          </MotionFade>
        </div>

        {/* ========================================================= */}
        {/* BLOCO DE TRANSIÇÃO / CHAMADA COMERCIAL                    */}
        {/* Animação de entrada discreta e sem loop distrativo        */}
        {/* ========================================================= */}
        <MotionFade triggerOnScroll direction="up" delay={0.25} distance={14}>
          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-[#0B1220]/10 shadow-[0_12px_36px_rgba(11,18,32,0.06)] p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Esquerda: Headline de Impacto */}
              <div className="lg:col-span-5">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight leading-snug">
                  Seu negócio tem desafios.
                  <br />
                  Nós temos experiência para{" "}
                  <span className="text-[#FF8A00]">ajudar a resolvê-los.</span>
                </h3>
              </div>

              {/* Centro: Explicação e Botão de Ação */}
              <div className="lg:col-span-4 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Seja na produção de eventos, na operação de um auto center ou no
                  crescimento de um negócio local, o primeiro passo é entender onde
                  estão as oportunidades.
                </p>
                <div>
                  <Link
                    href="#diagnostico"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FF5B00] text-azul-noite text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-[0_4px_20px_rgba(255,138,0,0.3)] hover:shadow-[0_6px_28px_rgba(255,138,0,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
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

              {/* Direita: 3 Passos Resumidos com Stagger Suave */}
              <div className="lg:col-span-3 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 space-y-3.5">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <span>Diagnóstico do cenário atual</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v4" />
                      <path d="M12 18v4" />
                      <path d="m4.93 4.93 2.83 2.83" />
                      <path d="m16.24 16.24 2.83 2.83" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <span>Identificação de oportunidades</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span>Com recomendações práticas</span>
                </div>
              </div>
            </div>
          </div>
        </MotionFade>
      </div>
    </section>
  );
}
