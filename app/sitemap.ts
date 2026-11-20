import type { MetadataRoute } from "next";
import {
  validateOrganicConfig,
  createOrganicClient,
  getSiteOrigin,
  type OrganicClient,
} from "@/lib/organic";

export const revalidate = 3600;

export interface SitemapOptions {
  client?: OrganicClient;
  env?: Record<string, string | undefined>;
}

// In-memory process cache of the last valid full sitemap generated
let lastValidSitemapCache: MetadataRoute.Sitemap | null = null;

/**
 * Resets the in-memory sitemap cache (used for test isolation).
 */
export function _resetSitemapCache(): void {
  lastValidSitemapCache = null;
}

export default async function sitemap(options?: SitemapOptions): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin(options?.env);

  // Institutional pages without reliable revision timestamps omit lastModified
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${origin}`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${origin}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const client =
      options?.client || createOrganicClient(validateOrganicConfig(options?.env));
    const articles = await client.getAllArticles(50);

    const articleEntries: MetadataRoute.Sitemap = articles
      .filter((article) => Boolean(article?.slug && typeof article.slug === "string"))
      .map((article) => {
        const articleUrl = article.canonical?.startsWith("http")
          ? article.canonical
          : `${origin}/blog/${article.slug}`;

        let lastMod: Date | undefined;
        const rawDate = (article as { updatedAt?: string }).updatedAt || article.publishedAt;
        if (rawDate && typeof rawDate === "string") {
          const parsed = new Date(rawDate);
          if (!isNaN(parsed.getTime())) {
            lastMod = parsed;
          }
        }

        const entry: MetadataRoute.Sitemap[number] = {
          url: articleUrl,
          changeFrequency: "weekly",
          priority: 0.8,
        };

        if (lastMod) {
          entry.lastModified = lastMod;
        }

        return entry;
      });

    const fullSitemap = [...staticEntries, ...articleEntries];
    lastValidSitemapCache = fullSitemap;
    return fullSitemap;
  } catch (err) {
    // If a valid sitemap with articles was previously generated, throw an error to signal
    // Next.js 16 ISR to preserve the existing cached sitemap (stale-while-revalidate),
    // preventing temporary API outages from silently wiping out all article URLs.
    if (lastValidSitemapCache && lastValidSitemapCache.length > staticEntries.length) {
      console.warn(
        `[Sitemap] API editorial temporariamente indisponível (${
          err instanceof Error ? err.message : String(err)
        }). Preservando cache ISR anterior (${lastValidSitemapCache.length} URLs).`
      );
      throw new Error(
        `[Sitemap] Falha temporária da API editorial durante revalidação. Preservando cache ISR anterior. Detalhes: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }

    // Cold start fallback: if no prior cache exists, safely return base static entries
    console.warn(
      "[Sitemap] API editorial indisponível no cold start inicial. Retornando rotas base institucionais:",
      err instanceof Error ? err.message : String(err)
    );
    return staticEntries;
  }
}
