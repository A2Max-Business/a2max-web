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

/**
 * Checks whether the code is running in a remote deployment (Vercel, CI or production).
 */
export function isRemoteDeployment(env: Record<string, string | undefined> = process.env): boolean {
  return (
    env.VERCEL === "1" ||
    Boolean(env.VERCEL_ENV) ||
    Boolean(env.VERCEL_URL) ||
    env.NODE_ENV === "production"
  );
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
 * Helper to ensure a domain or URL has a protocol (defaults to https://).
 */
function normalizeHttpsUrl(domainOrUrl: string): string {
  const clean = domainOrUrl.trim().replace(/\/+$/, "");
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  return `https://${clean}`;
}

/**
 * Resolves the absolute public origin of the site.
 * In production: guarantees https://www.a2max.com.br (or configured production NEXT_PUBLIC_SITE_URL).
 * In preview: uses VERCEL_URL (https://<preview-domain>) or official production domain.
 * In local development / test: falls back to http://localhost:3001.
 * Strict invariant: Never returns localhost in any remote deployment (Vercel, preview or production).
 */
export function getSiteOrigin(env: Record<string, string | undefined> = process.env): string {
  const configured = env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  const isRemote = isRemoteDeployment(env);

  // 1. If NEXT_PUBLIC_SITE_URL is explicitly configured:
  if (configured) {
    const isLocalhost = configured.includes("localhost") || configured.includes("127.0.0.1");

    // In remote deployments, reject localhost configuration to prevent accidental leakage
    if (!isLocalhost) {
      return normalizeHttpsUrl(configured);
    }

    // In local dev/test without remote flags, allow localhost
    if (!isRemote) {
      return configured.startsWith("http") ? configured : `http://${configured}`;
    }
  }

  // 2. Production: strictly official production domain
  if (isProductionEnv(env)) {
    return DEFAULT_PRODUCTION_DOMAIN;
  }

  // 3. Vercel Preview / Staging
  if (isPreviewEnv(env)) {
    if (env.VERCEL_URL) {
      return normalizeHttpsUrl(env.VERCEL_URL);
    }
    // Remote preview without VERCEL_URL fallback
    return DEFAULT_PRODUCTION_DOMAIN;
  }

  // 4. Any other remote deployment on Vercel
  if (env.VERCEL === "1" || env.VERCEL_URL) {
    if (env.VERCEL_URL) {
      return normalizeHttpsUrl(env.VERCEL_URL);
    }
    return DEFAULT_PRODUCTION_DOMAIN;
  }

  // 5. Local development fallback
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
