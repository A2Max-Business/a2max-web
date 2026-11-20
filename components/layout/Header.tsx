"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeaderProps {
  variant?: "dark" | "light";
}

export function Header({ variant = "dark" }: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = variant === "light";

  return (
    <header
      className={
        isLight
          ? "sticky top-0 left-0 right-0 z-50 w-full bg-[#F5F3EC]/95 backdrop-blur-md border-b border-[#0B1220]/10 px-6 py-5 md:px-12"
          : "absolute top-0 left-0 right-0 z-50 w-full px-6 py-8 md:px-12 md:py-10"
      }
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-laranja-energia focus-visible:ring-offset-2 rounded-sm"
          >
            {isLight ? (
              <Image
                src="/logos/a2max-lightmode.png"
                alt="A2Max"
                width={160}
                height={45}
                className="h-9 w-auto object-contain"
                priority
              />
            ) : (
              <Image
                src="/logos/a2max-darkmode.png"
                alt="A2Max"
                width={160}
                height={45}
                className="h-9 w-auto object-contain"
                priority
              />
            )}
          </Link>
          <div
            className={`hidden h-12 w-px lg:block ${
              isLight ? "bg-[#0B1220]/15" : "bg-branco/20"
            }`}
          />
          <span
            className={`hidden text-[10px] font-medium uppercase tracking-[0.2em] lg:block w-40 leading-relaxed ${
              isLight ? "text-[#0B1220]/75" : "text-branco/60"
            }`}
          >
            Performance
            <br />
            e Inteligência
            <br />
            de Negócios
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav
          className={`hidden items-center gap-8 text-xs font-semibold uppercase tracking-widest lg:flex ${
            isLight ? "text-[#0B1220]" : "text-branco"
          }`}
        >
          <Link
            href="/#a-a2max"
            className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none"
          >
            A A2Max
          </Link>
          <Link
            href="/#action"
            className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none"
          >
            A.C.T.I.O.N.
          </Link>
          <Link
            href="/#solucoes"
            className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none"
          >
            Soluções
          </Link>
          <Link
            href="/#resultados"
            className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none"
          >
            Resultados
          </Link>
          <Link
            href="/#inteligencia"
            className="transition-colors hover:text-laranja-energia focus-visible:text-laranja-energia outline-none"
          >
            Inteligência
          </Link>
          <Link
            href="/blog"
            className="transition-colors text-laranja-energia focus-visible:text-laranja-energia outline-none font-bold"
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-8">
          <Link
            href="/#diagnostico"
            className={`hidden items-center gap-2 rounded border border-laranja-energia px-7 py-3 text-xs font-semibold uppercase tracking-widest text-laranja-energia transition-colors hover:bg-laranja-energia lg:flex focus:outline-none focus:ring-2 focus:ring-laranja-energia ${
              isLight ? "hover:text-white" : "hover:text-azul-noite"
            }`}
          >
            Diagnóstico <span aria-hidden="true">&rarr;</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="group relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-laranja-energia rounded-sm lg:hidden cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          >
            <span
              className={`h-0.5 w-6 transition-all duration-300 ${
                mobileMenuOpen
                  ? "translate-y-2 rotate-45 bg-laranja-energia"
                  : isLight
                  ? "bg-[#0B1220] group-hover:bg-laranja-energia"
                  : "bg-branco group-hover:bg-laranja-energia"
              }`}
            />
            <span
              className={`h-0.5 w-6 transition-all duration-300 ${
                mobileMenuOpen
                  ? "opacity-0"
                  : isLight
                  ? "bg-[#0B1220] group-hover:bg-laranja-energia"
                  : "bg-branco group-hover:bg-laranja-energia"
              }`}
            />
            <span
              className={`h-0.5 w-6 transition-all duration-300 ${
                mobileMenuOpen
                  ? "-translate-y-2 -rotate-45 bg-laranja-energia"
                  : isLight
                  ? "bg-[#0B1220] group-hover:bg-laranja-energia"
                  : "bg-branco group-hover:bg-laranja-energia"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Menu principal mobile"
          className={`lg:hidden absolute top-full left-0 right-0 w-full px-6 py-6 shadow-2xl transition-all duration-300 z-50 border-b ${
            isLight
              ? "bg-[#F5F3EC]/98 backdrop-blur-xl border-[#0B1220]/10 text-[#0B1220]"
              : "bg-[#0B1220]/98 backdrop-blur-xl border-white/10 text-branco"
          }`}
        >
          <div className="flex flex-col gap-4 text-xs font-semibold uppercase tracking-widest">
            <Link
              href="/#a-a2max"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 transition-colors hover:text-laranja-energia border-b border-black/5"
            >
              A A2Max
            </Link>
            <Link
              href="/#action"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 transition-colors hover:text-laranja-energia border-b border-black/5"
            >
              A.C.T.I.O.N.
            </Link>
            <Link
              href="/#solucoes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 transition-colors hover:text-laranja-energia border-b border-black/5"
            >
              Soluções
            </Link>
            <Link
              href="/#resultados"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 transition-colors hover:text-laranja-energia border-b border-black/5"
            >
              Resultados
            </Link>
            <Link
              href="/#inteligencia"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 transition-colors hover:text-laranja-energia border-b border-black/5"
            >
              Inteligência
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-laranja-energia font-bold flex items-center justify-between border-b border-black/5"
            >
              <span>Blog &amp; Inteligência</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-laranja-energia/20 text-laranja-energia">Novo</span>
            </Link>
            <Link
              href="/#diagnostico"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded border border-laranja-energia bg-laranja-energia/10 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-laranja-energia transition-colors hover:bg-laranja-energia hover:text-azul-noite"
            >
              Diagnóstico Empresarial &rarr;
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
