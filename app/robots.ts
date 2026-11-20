import type { MetadataRoute } from "next";
import { getSiteOrigin, isPreviewEnv } from "@/lib/organic";

export default function robots(env: Record<string, string | undefined> = process.env): MetadataRoute.Robots {
  const origin = getSiteOrigin(env);

  // If in a preview or staging deployment, disallow all crawlers to protect non-production deployments
  if (isPreviewEnv(env)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${origin}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/blog/preview",
        "/api/",
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
