"use client";

import { useState } from "react";
import Image from "next/image";
import type { PublicCoverDTO } from "@/lib/organic/types";
import { isValidCover } from "@/lib/organic/cover";

export { isValidCover };

export interface ArticleCoverImageProps {
  cover?: PublicCoverDTO | null;
  fallbackAlt?: string;
  priority?: boolean;
}

/**
 * ArticleCoverImage:
 * Renders an editorial 1200x630 cover image only when a valid image exists.
 * If cover is absent, invalid, or fails to load in the browser, returns null
 * to completely eliminate empty whitespace, empty rectangles, or broken placeholders.
 */
export function ArticleCoverImage({
  cover,
  fallbackAlt = "Capa do artigo",
  priority = false,
}: ArticleCoverImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !isValidCover(cover)) {
    return null;
  }

  const cleanUrl = cover!.url.trim();
  const altText = cover!.alt?.trim() || fallbackAlt;

  return (
    <figure className="mx-auto max-w-4xl mb-12">
      <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm">
        <Image
          src={cleanUrl}
          alt={altText}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
          priority={priority}
          onError={() => setHasError(true)}
        />
      </div>
      {cover!.caption && (
        <figcaption className="mt-3 text-center text-xs text-slate-500 italic">
          {cover!.caption}
        </figcaption>
      )}
    </figure>
  );
}
