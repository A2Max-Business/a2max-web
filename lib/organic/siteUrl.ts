/**
 * A2 Organic Acquisition — Site Origin & Environment Helper
 * Resolves canonical domains, detects deployment environments (prod, preview, local)
 * and guarantees localhost URLs are never leaked into production metadata.
 */

export const DEFAULT_PRODUCTION_DOMAIN = "https://www.a2max.com.br";
export const DEFAULT_LOCAL_ORIGIN = "http://localhost:3001";
export const DEFAULT_OG_IMAGE = "https://www.a2max.com.br/logos/a2max-lightmode.png";

/**
 * Checks whether the environment is considered a preview deployment (e.g. Vercel Preview).
 */
export function isPreviewEnv(env: Record<string, string | undefined> = process.env): boolean {
  const vercelEnv = env.VERCEL_ENV || env.NEXT_PUBLIC_VERCEL_ENV;
  return vercelEnv === "preview" || env.A2_PREVIEW_MODE === "true";
}

/**
 * Checks whether the environment is strictly production.
 */
export function isProductionEnv(env: Record<string, string | undefined> = process.env): boolean {
  if (isPreviewEnv(env)) {
    return false;
  }
  return env.NODE_ENV === "production" || env.VERCEL_ENV === "production";
}

export interface RobotsMetadataOptions {
  env?: Record<string, string | undefined>;
  forceNoIndex?: boolean;
}

/**
 * Resolves standard robots directives.
 * If in preview environment or forceNoIndex is set: emits strict noindex, nofollow, nocache.
 * In production: allows indexing and search engine snippet extraction.
 */
export function getRobotsMetadata(options?: RobotsMetadataOptions): {
  index: boolean;
  follow: boolean;
  nocache?: boolean;
  googleBot?: {
    index: boolean;
    follow: boolean;
    noimageindex?: boolean;
    "max-video-preview"?: number;
    "max-image-preview"?: "large" | "none" | "standard";
    "max-snippet"?: number;
  };
} {
  const env = options?.env || process.env;
  const isPreview = isPreviewEnv(env) || options?.forceNoIndex === true;

  if (isPreview) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

/**
 * Resolves the absolute public origin of the site.
 * In production: guarantees https://www.a2max.com.br (or configured production NEXT_PUBLIC_SITE_URL).
 * In development / test: falls back to localhost without polluting production contracts.
 */
export function getSiteOrigin(env: Record<string, string | undefined> = process.env): string {
  const configured = env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  if (isProductionEnv(env)) {
    // If configured in production, ensure it is not localhost or loopback
    if (configured && !configured.includes("localhost") && !configured.includes("127.0.0.1")) {
      return configured.startsWith("http") ? configured : `https://${configured}`;
    }
    return DEFAULT_PRODUCTION_DOMAIN;
  }

  // Non-production / Local development / Preview
  if (configured) {
    return configured.startsWith("http") ? configured : `http://${configured}`;
  }

  return DEFAULT_LOCAL_ORIGIN;
}

/**
 * Resolves an absolute image URL for Open Graph and Twitter Card metadata.
 */
export function resolveAbsoluteSocialImage(
  url?: string,
  siteOrigin: string = DEFAULT_PRODUCTION_DOMAIN
): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return DEFAULT_OG_IMAGE;
  }

  const clean = url.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `${siteOrigin}${clean.startsWith("/") ? "" : "/"}${clean}`;
}
