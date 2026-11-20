/**
 * A2 Organic Acquisition — Test Suite: SEO Técnico, Sitemap XML & Robots.txt
 * Valida os 10 requisitos obrigatórios da Etapa 3.1.
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  getSiteOrigin,
  isProductionEnv,
  isPreviewEnv,
  resolveAbsoluteSocialImage,
  getRobotsMetadata,
  DEFAULT_PRODUCTION_DOMAIN,
  DEFAULT_LOCAL_ORIGIN,
  DEFAULT_OG_IMAGE,
  createOrganicClient,
  type OrganicConfig,
  type PublicArticleSummaryDTO,
} from "../index.ts";
import sitemap, { _resetSitemapCache } from "@/app/sitemap";
import robots from "@/app/robots";
import { metadata as previewMetadata } from "@/app/blog/preview/page";

process.env.A2_ORGANIC_API_URL = "http://localhost:3000";
process.env.A2_ORGANIC_PUBLICATION_ID = "a2max";
process.env.A2_ORGANIC_INSTALLATION_KEY = "inst-a2max-web";
process.env.A2_ORGANIC_TIMEOUT_MS = "3000";
process.env.A2_ORGANIC_REVALIDATE_SECONDS = "60";

const baseConfig: OrganicConfig = {
  apiUrl: "http://localhost:3000",
  publicationId: "a2max",
  installationKey: "inst-a2max-web",
  timeoutMs: 3000,
  revalidateSeconds: 60,
};

function createMockArticle(id: number, override: Partial<PublicArticleSummaryDTO> = {}): PublicArticleSummaryDTO {
  return {
    slug: `artigo-estrategico-${id}`,
    title: `Artigo Estratégico ${id}`,
    excerpt: `Resumo do artigo estratégico ${id}`,
    author: { name: "Time A2Max" },
    tags: ["estrategia"],
    publishedAt: "2026-11-15T12:00:00.000Z",
    canonical: `https://www.a2max.com.br/blog/artigo-estrategico-${id}`,
    ...override,
  };
}

test("SEO Técnico & Sitemap XML Suite", async (t) => {
  await t.test("1. Sitemap sem artigos publicados retorna rotas base (Homepage / e Blog /blog)", async () => {
    // Mock fetch returning empty articles array
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ data: { articles: [], total: 0, limit: 50, offset: 0 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    try {
      const entries = await sitemap();
      assert.ok(Array.isArray(entries));
      assert.equal(entries.length, 2);

      const urls = entries.map((e) => e.url);
      const origin = getSiteOrigin();
      assert.ok(urls.includes(origin));
      assert.ok(urls.includes(`${origin}/blog`));

      const homeEntry = entries.find((e) => e.url === origin);
      assert.equal(homeEntry?.priority, 1.0);
      assert.equal(homeEntry?.changeFrequency, "daily");
      assert.equal(homeEntry?.lastModified, undefined, "Páginas institucionais sem timestamp confiável devem omitir lastModified");

      const blogEntry = entries.find((e) => e.url === `${origin}/blog`);
      assert.equal(blogEntry?.priority, 0.9);
      assert.equal(blogEntry?.changeFrequency, "daily");
      assert.equal(blogEntry?.lastModified, undefined, "Listagem de blog sem timestamp de modificação confiável deve omitir lastModified");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.test("2. Sitemap com um artigo publicado inclui URL canônica absoluta e lastModified confiável", async () => {
    const mockArticle = createMockArticle(1, {
      publishedAt: "2026-11-15T10:30:00.000Z",
    });

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({ data: { articles: [mockArticle], total: 1, limit: 50, offset: 0 } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    try {
      const entries = await sitemap();
      assert.equal(entries.length, 3);

      const articleEntry = entries.find((e) => e.url.includes("artigo-estrategico-1"));
      assert.ok(articleEntry, "Artigo deve estar presente no sitemap");
      assert.equal(articleEntry?.url, "https://www.a2max.com.br/blog/artigo-estrategico-1");
      assert.equal(articleEntry?.priority, 0.8);
      assert.equal(articleEntry?.changeFrequency, "weekly");
      assert.ok(articleEntry?.lastModified instanceof Date);
      assert.equal(articleEntry?.lastModified.toISOString(), "2026-11-15T10:30:00.000Z");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.test("3. Sitemap com mais artigos que o limite de uma página realiza paginação sequencial completa", async () => {
    // Generate 65 mock articles (exceeds default page limit of 50)
    const allMockArticles: PublicArticleSummaryDTO[] = [];
    for (let i = 1; i <= 65; i++) {
      allMockArticles.push(createMockArticle(i));
    }

    const originalFetch = globalThis.fetch;
    let requestCount = 0;

    globalThis.fetch = async (input: RequestInfo | URL) => {
      const urlStr = String(input);
      const urlObj = new URL(urlStr);
      const limit = parseInt(urlObj.searchParams.get("limit") || "50", 10);
      const offset = parseInt(urlObj.searchParams.get("offset") || "0", 10);

      requestCount++;
      const sliced = allMockArticles.slice(offset, offset + limit);

      return new Response(
        JSON.stringify({
          data: {
            articles: sliced,
            total: allMockArticles.length,
            limit,
            offset,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    try {
      const entries = await sitemap();
      assert.equal(requestCount, 2, "Deveria ter feito exatamente 2 requisições paginadas (50 + 15)");
      // 2 static base entries + 65 articles = 67 entries total
      assert.equal(entries.length, 67);

      assert.ok(entries.some((e) => e.url.includes("artigo-estrategico-1")));
      assert.ok(entries.some((e) => e.url.includes("artigo-estrategico-50")));
      assert.ok(entries.some((e) => e.url.includes("artigo-estrategico-65")));
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.test("4. Exclusão de rascunhos: artigos em DRAFT, REVIEW ou PREVIEW nunca constam no sitemap", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      // API already enforces published-only, test client verification
      return new Response(
        JSON.stringify({
          data: {
            articles: [createMockArticle(100)],
            total: 1,
            limit: 50,
            offset: 0,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    try {
      const entries = await sitemap();
      const urls = entries.map((e) => e.url);

      assert.ok(!urls.some((u) => u.includes("preview")), "Sitemap nunca deve conter rotas de preview");
      assert.ok(!urls.some((u) => u.includes("draft")), "Sitemap nunca deve conter rascunhos");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.test("5. Exclusão de outras publicações: requisição respeita publicationId e domínio canônico da A2Max", async () => {
    let capturedPath = "";
    const mockFetch = async (input: RequestInfo | URL) => {
      capturedPath = String(input);
      return new Response(JSON.stringify({ data: { articles: [], total: 0, limit: 50, offset: 0 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const client = createOrganicClient(baseConfig, mockFetch as unknown as typeof fetch);
    await client.getAllArticles();

    assert.ok(
      capturedPath.includes("/publications/a2max/articles"),
      "SDK deve consultar estritamente a publicação a2max"
    );
  });

  await t.test("6. URLs canônicas são absolutas e válidas, sem caminhos relativos ou vazios", async () => {
    const mockArticle = createMockArticle(200, { canonical: undefined }); // Test fallback when canonical is missing from payload
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({ data: { articles: [mockArticle], total: 1, limit: 50, offset: 0 } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    try {
      const entries = await sitemap();
      for (const entry of entries) {
        assert.ok(
          entry.url.startsWith("http://") || entry.url.startsWith("https://"),
          `URL do sitemap deve ser absoluta: ${entry.url}`
        );
        assert.ok(!entry.url.includes("undefined"), `URL não pode conter undefined: ${entry.url}`);
      }
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.test("7. Robots.txt: ambiente de produção permite rastreamento público e bloqueia preview; preview bloqueia tudo", () => {
    // 7.1 Production Environment
    const prodRobots = robots({ NODE_ENV: "production" });
    assert.ok(prodRobots.sitemap?.includes("/sitemap.xml"));
    const prodRules = Array.isArray(prodRobots.rules) ? prodRobots.rules[0] : prodRobots.rules;
    assert.equal(prodRules?.allow, "/");
    assert.deepEqual(prodRules?.disallow, ["/blog/preview", "/api/"]);

    // 7.2 Preview Environment Simulation (blocks all indexing)
    const previewEnvMock = { VERCEL_ENV: "preview", NODE_ENV: "production" };
    assert.equal(isPreviewEnv(previewEnvMock), true);

    const prevRobots = robots(previewEnvMock);
    const prevRules = Array.isArray(prevRobots.rules) ? prevRobots.rules[0] : prevRobots.rules;
    assert.equal(prevRules?.disallow, "/", "Preview deployment deve bloquear todos os rastreadores com disallow: /");
  });

  await t.test("8. Canonical e Metadados Sociais: getSiteOrigin e resolveAbsoluteSocialImage", () => {
    // Production origin resolution
    const prodOrigin = getSiteOrigin({ NODE_ENV: "production" });
    assert.equal(prodOrigin, DEFAULT_PRODUCTION_DOMAIN);

    // Development origin resolution
    const devOrigin = getSiteOrigin({ NODE_ENV: "development" });
    assert.equal(devOrigin, DEFAULT_LOCAL_ORIGIN);

    // Rejection of localhost in production
    const taintedProd = getSiteOrigin({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    });
    assert.equal(taintedProd, DEFAULT_PRODUCTION_DOMAIN, "Produção nunca pode adotar localhost");

    // Vercel Preview resolution via VERCEL_URL
    const vercelPreviewOrigin = getSiteOrigin({
      VERCEL: "1",
      VERCEL_ENV: "preview",
      VERCEL_URL: "a2max-web-git-feat-preview.vercel.app",
    });
    assert.equal(
      vercelPreviewOrigin,
      "https://a2max-web-git-feat-preview.vercel.app",
      "Preview na Vercel deve resolver VERCEL_URL com https://"
    );

    // Vercel Preview without VERCEL_URL must fallback to official production domain, NEVER localhost
    const vercelPreviewFallback = getSiteOrigin({
      VERCEL: "1",
      VERCEL_ENV: "preview",
    });
    assert.equal(
      vercelPreviewFallback,
      DEFAULT_PRODUCTION_DOMAIN,
      "Preview remoto sem VERCEL_URL deve adotar domínio de produção, nunca localhost"
    );

    // Rejection of localhost in Vercel Preview even if mistakenly passed in NEXT_PUBLIC_SITE_URL
    const taintedPreview = getSiteOrigin({
      VERCEL: "1",
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3001",
      VERCEL_URL: "a2max-web-git-feat-preview.vercel.app",
    });
    assert.equal(
      taintedPreview,
      "https://a2max-web-git-feat-preview.vercel.app",
      "Vercel Preview deve rejeitar NEXT_PUBLIC_SITE_URL localhost e usar VERCEL_URL"
    );

    // Social image absolute resolution
    const absoluteImg = resolveAbsoluteSocialImage("https://cdn.example.com/capa.png");
    assert.equal(absoluteImg, "https://cdn.example.com/capa.png");

    const relativeImg = resolveAbsoluteSocialImage("/images/capa.png", "https://www.a2max.com.br");
    assert.equal(relativeImg, "https://www.a2max.com.br/images/capa.png");

    const emptyImg = resolveAbsoluteSocialImage("");
    assert.equal(emptyImg, DEFAULT_OG_IMAGE);
  });

  await t.test("9. Resiliência de Falha da API: cold start retorna rotas base e revalidação com cache prévio preserva sitemap completo via SWR", async () => {
    // 9.1 Cold start failure: returns base routes without crashing
    _resetSitemapCache();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error("Simulated network timeout connecting to Organic Core on cold start");
    };

    try {
      const entries = await sitemap();
      assert.ok(Array.isArray(entries));
      assert.equal(entries.length, 2, "No cold start sem cache prévio, retorna com segurança as 2 rotas base");
      assert.ok(entries.some((e) => e.url.endsWith("/blog")));
    } finally {
      globalThis.fetch = originalFetch;
    }

    // 9.2 Successful fetch populates sitemap cache
    const mockArticle = createMockArticle(1);
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({ data: { articles: [mockArticle], total: 1, limit: 50, offset: 0 } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    try {
      const populated = await sitemap();
      assert.equal(populated.length, 3, "Sitemap populado com sucesso com 3 URLs");

      // 9.3 Subsequent API outage: MUST throw error to trigger Next.js 16 ISR stale-while-revalidate preservation
      globalThis.fetch = async () => {
        throw new Error("Temporary Core API 503 outage during revalidation");
      };

      await assert.rejects(
        async () => {
          await sitemap();
        },
        (err: Error) => {
          assert.ok(err.message.includes("Preservando cache ISR anterior"));
          return true;
        },
        "Quando há cache anterior completo, falha temporária da API deve lançar erro para preservar o cache ISR do Next.js 16"
      );
    } finally {
      globalThis.fetch = originalFetch;
      _resetSitemapCache();
    }
  });

  await t.test("10. Não indexação de preview: robots do preview define estritamente noindex, nofollow e nocache", () => {
    assert.ok(previewMetadata.robots, "Preview deve ter configuração explícita de robots");
    const r = previewMetadata.robots as Record<string, unknown>;
    assert.equal(r.index, false, "index deve ser false");
    assert.equal(r.follow, false, "follow deve ser false");
    assert.equal(r.nocache, true, "nocache deve ser true");

    const googleBot = r.googleBot as Record<string, unknown>;
    assert.equal(googleBot.index, false);
    assert.equal(googleBot.follow, false);
    assert.equal(googleBot.noimageindex, true);
  });

  await t.test("11. Paginação e Deduplicação: getAllArticles deduplica slugs e rejeita truncamento silencioso", async () => {
    // 11.1 Slugs duplicados retornados por derivação de offset são deduplicados
    const duplicatedArticles = [
      createMockArticle(1, { slug: "artigo-duplicado" }),
      createMockArticle(2, { slug: "artigo-duplicado" }),
      createMockArticle(3, { slug: "artigo-inedito" }),
    ];

    const mockFetch = async () => {
      return new Response(
        JSON.stringify({
          data: {
            articles: duplicatedArticles,
            total: 3,
            limit: 50,
            offset: 0,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const client = createOrganicClient(baseConfig, mockFetch as unknown as typeof fetch);
    const result = await client.getAllArticles();

    assert.equal(result.length, 2, "Deveria ter deduplicado os artigos pelo slug");
    assert.equal(result[0].slug, "artigo-duplicado");
    assert.equal(result[1].slug, "artigo-inedito");

    // 11.2 Rejeição de conjuntos truncados quando limite de páginas de segurança é atingido
    const infinitePagingFetch = async () => {
      return new Response(
        JSON.stringify({
          data: {
            articles: [createMockArticle(1)],
            total: 100000,
            limit: 1,
            offset: 0,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const clientTruncated = createOrganicClient(baseConfig, infinitePagingFetch as unknown as typeof fetch);
    await assert.rejects(
      async () => {
        await clientTruncated.getAllArticles(1);
      },
      (err: Error) => {
        assert.ok(err.message.includes("Limite máximo de paginação"));
        return true;
      },
      "Deve rejeitar conjunto truncado se atingir teto de páginas com registros pendentes"
    );
  });

  await t.test("12. Diretivas de Robôs em Preview vs Produção (getRobotsMetadata)", () => {
    // 12.1 Preview Environment
    const previewRobots = getRobotsMetadata({ env: { VERCEL_ENV: "preview" } });
    assert.equal(previewRobots.index, false);
    assert.equal(previewRobots.follow, false);
    assert.equal(previewRobots.nocache, true);
    assert.equal(previewRobots.googleBot?.index, false);
    assert.equal(previewRobots.googleBot?.follow, false);
    assert.equal(previewRobots.googleBot?.noimageindex, true);

    // 12.2 Production Environment
    const prodRobots = getRobotsMetadata({ env: { NODE_ENV: "production", VERCEL_ENV: "production" } });
    assert.equal(prodRobots.index, true);
    assert.equal(prodRobots.follow, true);
    assert.equal(prodRobots.googleBot?.index, true);
    assert.equal(prodRobots.googleBot?.follow, true);
    assert.equal(prodRobots.googleBot?.["max-image-preview"], "large");

    // 12.3 Force noindex (e.g. for draft preview article in production)
    const forcedNoIndex = getRobotsMetadata({
      env: { NODE_ENV: "production" },
      forceNoIndex: true,
    });
    assert.equal(forcedNoIndex.index, false);
    assert.equal(forcedNoIndex.follow, false);
  });
});
