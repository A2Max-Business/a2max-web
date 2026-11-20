'use client';

import React, { useState } from 'react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function SocialShareButtons({ url, title, className = '' }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — ${url}`);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      aria-label="Compartilhar matéria"
      className={`flex flex-wrap items-center gap-2 sm:gap-2.5 py-4 ${className}`}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 select-none">
        Compartilhar:
      </span>

      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no WhatsApp"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-semibold text-xs border border-[#25D366]/30 transition-all hover:scale-102"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.075-2.072-.497-1.761-.733-2.883-2.529-2.97-2.646-.088-.117-.714-.948-.714-1.809 0-.861.452-1.284.613-1.459.16-.175.35-.219.467-.219.117 0 .234.001.336.006.107.005.25.04.383.359.138.334.468 1.144.51 1.23.042.086.071.189.012.304-.058.115-.088.188-.175.289-.088.102-.185.228-.264.306-.088.088-.179.183-.077.359.102.175.454.748.974 1.212.671.597 1.236.782 1.411.87.175.088.277.073.38-.044.103-.117.438-.511.555-.686.117-.175.234-.146.394-.088.16.058 1.02.481 1.196.568.175.088.292.131.336.204.043.073.043.424-.101.829zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.662 1.442 5.178L2 22l4.981-1.307A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
        <span>WhatsApp</span>
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] font-semibold text-xs border border-[#0077B5]/30 transition-all hover:scale-102"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
        <span>LinkedIn</span>
      </a>

      {/* X / Twitter */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X (Twitter)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/10 hover:bg-zinc-900/20 text-zinc-900 font-semibold text-xs border border-zinc-900/20 transition-all hover:scale-102"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>X / Twitter</span>
      </a>

      {/* Copiar Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Copiar link da matéria"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs border transition-all ${
          copied
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
        }`}
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-emerald-700 font-bold">Link Copiado!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copiar Link</span>
          </>
        )}
      </button>
    </div>
  );
}
