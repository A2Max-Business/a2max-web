/**
 * A2 Organic Acquisition — Revalidation Webhook Test Suite
 * Covers all 12 mandatory validation scenarios for Etapa 3.2.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import {
  computeHmacSignature,
  verifyHmacSignature,
  isValidSlug,
  isValidTimestamp,
  _resetProcessedEventsCache,
  type RevalidateWebhookPayload,
  createOrganicClient,
  type OrganicConfig,
} from "../index.ts";
import { POST, GET, handleRevalidation } from "@/app/api/revalidate/route";

const TEST_SECRET = "test-revalidate-secret-k8j3m9x2p1q7";
const TEST_PUB_ID = "a2max";

function createSignedRequest(
  payload: unknown,
  secret: string = TEST_SECRET,
  signatureOverride?: string,
  extraHeaders: Record<string, string> = {}
): { req: NextRequest; rawBody: string; signature: string } {
  const rawBody = typeof payload === "string" ? payload : JSON.stringify(payload);
  const signature = signatureOverride ?? computeHmacSignature(rawBody, secret);

  const req = new NextRequest("http://localhost:3001/api/revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-organic-signature": signature,
      ...extraHeaders,
    },
    body: rawBody,
  });

  return { req, rawBody, signature };
}

function makeValidPayload(override: Partial<RevalidateWebhookPayload> = {}): RevalidateWebhookPayload {
  return {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    event: "content.published",
    publicationId: TEST_PUB_ID,
    slug: "artigo-estrategico-revalidate",
    timestamp: Date.now(),
    ...override,
  };
}

test("Receptor Seguro de Revalidação A2Max — Suíte de Testes", async (t) => {
  t.beforeEach(() => {
    _resetProcessedEventsCache();
  });

  // 1. Assinatura válida
  await t.test("1. Assinatura válida: processa com sucesso e retorna 200 com paths e tags revalidadas", async () => {
    const payload = makeValidPayload();
    const { req } = createSignedRequest(payload, TEST_SECRET);

    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];

    const res = await handleRevalidation(req, {
      secret: TEST_SECRET,
      revalidatePath: (p) => revalidatedPaths.push(p),
      revalidateTag: (t) => revalidatedTags.push(t),
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
    assert.equal(json.revalidated, true);
    assert.equal(json.eventId, payload.eventId);
    assert.ok(Array.isArray(json.paths));
    assert.ok(json.paths.includes("/blog"));
    assert.ok(json.paths.includes(`/blog/${payload.slug}`));
    assert.ok(json.paths.includes("/"));
    assert.ok(json.paths.includes("/sitemap.xml"));
    assert.ok(revalidatedPaths.includes("/blog"));
    assert.ok(revalidatedTags.includes("organic:a2max:articles"));
  });

  // 2. Assinatura inválida
  await t.test("2. Assinatura inválida: rejeita requisição adulterada ou sem assinatura com 401", async () => {
    const payload = makeValidPayload();

    // 2.1 Assinatura adulterada
    const { req: reqBadSig } = createSignedRequest(payload, TEST_SECRET, "invalidhexsignature1234567890abcdef");
    const resBadSig = await handleRevalidation(reqBadSig, { secret: TEST_SECRET });
    assert.equal(resBadSig.status, 401);
    const jsonBadSig = await resBadSig.json();
    assert.equal(jsonBadSig.ok, false);
    assert.equal(jsonBadSig.error, "INVALID_SIGNATURE");

    // 2.2 Assinatura com segredo incorreto
    const { req: reqWrongSecret } = createSignedRequest(payload, "wrong-secret-9999");
    const resWrongSecret = await handleRevalidation(reqWrongSecret, { secret: TEST_SECRET });
    assert.equal(resWrongSecret.status, 401);

    // 2.3 Sem cabeçalho de assinatura
    const reqNoHeader = new NextRequest("http://localhost:3001/api/revalidate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const resNoHeader = await handleRevalidation(reqNoHeader, { secret: TEST_SECRET });
    assert.equal(resNoHeader.status, 401);
  });

  // 3. Timestamp expirado
  await t.test("3. Timestamp expirado: rejeita timestamps fora da janela de tolerância de 5 minutos com 400", async () => {
    const now = 1763236800000; // Fixed epoch reference

    // 3.1 Passado: mais de 5 minutos atrás (5 min + 1 ms)
    const oldPayload = makeValidPayload({ timestamp: now - (5 * 60 * 1000 + 1) });
    const { req: reqOld } = createSignedRequest(oldPayload, TEST_SECRET);
    const resOld = await handleRevalidation(reqOld, { secret: TEST_SECRET, now: () => now });
    assert.equal(resOld.status, 400);
    const jsonOld = await resOld.json();
    assert.equal(jsonOld.error, "TIMESTAMP_OUT_OF_BOUNDS");

    // 3.2 Futuro: mais de 5 minutos no futuro (5 min + 1 ms)
    const futurePayload = makeValidPayload({ timestamp: now + (5 * 60 * 1000 + 1) });
    const { req: reqFuture } = createSignedRequest(futurePayload, TEST_SECRET);
    const resFuture = await handleRevalidation(reqFuture, { secret: TEST_SECRET, now: () => now });
    assert.equal(resFuture.status, 400);
    const jsonFuture = await resFuture.json();
    assert.equal(jsonFuture.error, "TIMESTAMP_OUT_OF_BOUNDS");

    // 3.3 Dentro da janela: 2 minutos atrás (deve ser aceito)
    const validTimePayload = makeValidPayload({ timestamp: now - 2 * 60 * 1000 });
    const { req: reqValid } = createSignedRequest(validTimePayload, TEST_SECRET);
    const resValid = await handleRevalidation(reqValid, {
      secret: TEST_SECRET,
      now: () => now,
      revalidatePath: () => {},
      revalidateTag: () => {},
    });
    assert.equal(resValid.status, 200);
  });

  // 4. Publicação incorreta
  await t.test("4. Publicação incorreta: rejeita requisições destinadas a outras publicações com 403", async () => {
    const payload = makeValidPayload({ publicationId: "other-publication" });
    const { req } = createSignedRequest(payload, TEST_SECRET);

    const res = await handleRevalidation(req, { secret: TEST_SECRET, expectedPublicationId: "a2max" });
    assert.equal(res.status, 403);
    const json = await res.json();
    assert.equal(json.ok, false);
    assert.equal(json.error, "INVALID_PUBLICATION");
  });

  // 5. Slug malformado
  await t.test("5. Slug malformado: rejeita path traversal, caracteres especiais, maiúsculas e vazios com 400", async () => {
    const invalidSlugs = [
      "../traversal-attack",
      "slug com espacos",
      "SlugComMaiusculas",
      "slug/com/barras",
      "slug\\com\\invertidas",
      "slug$com$simbolos",
      "",
      "   ",
    ];

    for (const badSlug of invalidSlugs) {
      const payload = makeValidPayload({ slug: badSlug });
      const { req } = createSignedRequest(payload, TEST_SECRET);
      const res = await handleRevalidation(req, { secret: TEST_SECRET });
      assert.equal(res.status, 400, `Slug inválido "${badSlug}" deveria retornar 400`);
      const json = await res.json();
      assert.equal(json.error, "MALFORMED_SLUG");
    }

    // 5.2 previousSlug malformado
    const payloadBadPrevious = makeValidPayload({
      slug: "slug-valido",
      previousSlug: "../antigo-invalido",
    });
    const { req: reqBadPrev } = createSignedRequest(payloadBadPrevious, TEST_SECRET);
    const resBadPrev = await handleRevalidation(reqBadPrev, { secret: TEST_SECRET });
    assert.equal(resBadPrev.status, 400);
    const jsonBadPrev = await resBadPrev.json();
    assert.equal(jsonBadPrev.error, "MALFORMED_PREVIOUS_SLUG");
  });

  // 6. JSON inválido ou excessivo
  await t.test("6. JSON inválido ou excessivo: rejeita payloads não-JSON com 400 e payloads acima de 64KB com 413", async () => {
    // 6.1 Não-JSON
    const { req: reqNonJson } = createSignedRequest("esta string nao e um json valido", TEST_SECRET);
    const resNonJson = await handleRevalidation(reqNonJson, { secret: TEST_SECRET });
    assert.equal(resNonJson.status, 400);
    const jsonNonJson = await resNonJson.json();
    assert.equal(jsonNonJson.error, "INVALID_JSON");

    // 6.2 Corpo excessivo (> 64 KB)
    const giantString = "a".repeat(70 * 1024);
    const { req: reqGiant } = createSignedRequest(giantString, TEST_SECRET);
    const resGiant = await handleRevalidation(reqGiant, { secret: TEST_SECRET });
    assert.equal(resGiant.status, 413);
    const jsonGiant = await resGiant.json();
    assert.equal(jsonGiant.error, "PAYLOAD_TOO_LARGE");
  });

  // 7. Evento desconhecido
  await t.test("7. Evento desconhecido: rejeita eventos não suportados com 400", async () => {
    const payload = makeValidPayload({ event: "content.deleted" as unknown as "content.published" });
    const { req } = createSignedRequest(payload, TEST_SECRET);

    const res = await handleRevalidation(req, { secret: TEST_SECRET });
    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.ok, false);
    assert.equal(json.error, "UNKNOWN_EVENT");
  });

  // 8. Revalidação dos caminhos corretos
  await t.test("8. Revalidação dos caminhos corretos: content.published vs showcase.updated", async () => {
    // 8.1 content.published: /blog, /blog/[slug], /, /sitemap.xml
    const pubPayload = makeValidPayload({
      event: "content.published",
      slug: "novo-artigo-planejamento",
    });
    const revalPathsPub: string[] = [];
    const revalTagsPub: string[] = [];

    const { req: reqPub } = createSignedRequest(pubPayload, TEST_SECRET);
    const resPub = await handleRevalidation(reqPub, {
      secret: TEST_SECRET,
      revalidatePath: (p) => revalPathsPub.push(p),
      revalidateTag: (t) => revalTagsPub.push(t),
    });

    assert.equal(resPub.status, 200);
    assert.deepEqual(revalPathsPub.sort(), [
      "/",
      "/blog",
      "/blog/novo-artigo-planejamento",
      "/sitemap.xml",
    ].sort());
    assert.ok(revalTagsPub.includes("organic:a2max:articles"));
    assert.ok(revalTagsPub.includes("organic:a2max:article:novo-artigo-planejamento"));
    assert.ok(revalTagsPub.includes("organic:a2max:showcase"));

    // 8.2 showcase.updated: revalida estritamente / e tag showcase
    const showcasePayload = makeValidPayload({
      event: "showcase.updated",
      slug: undefined,
    });
    const revalPathsShowcase: string[] = [];
    const revalTagsShowcase: string[] = [];

    const { req: reqShowcase } = createSignedRequest(showcasePayload, TEST_SECRET);
    const resShowcase = await handleRevalidation(reqShowcase, {
      secret: TEST_SECRET,
      revalidatePath: (p) => revalPathsShowcase.push(p),
      revalidateTag: (t) => revalTagsShowcase.push(t),
    });

    assert.equal(resShowcase.status, 200);
    assert.deepEqual(revalPathsShowcase, ["/"]);
    assert.deepEqual(revalTagsShowcase, ["organic:a2max:showcase"]);
  });

  // 9. Alteração de slug
  await t.test("9. Alteração de slug: revalida slug novo, slug anterior e sitemap.xml", async () => {
    const payload = makeValidPayload({
      event: "content.updated",
      slug: "nova-estrategia-2026",
      previousSlug: "antiga-estrategia-2025",
    });

    const revalPaths: string[] = [];
    const revalTags: string[] = [];

    const { req } = createSignedRequest(payload, TEST_SECRET);
    const res = await handleRevalidation(req, {
      secret: TEST_SECRET,
      revalidatePath: (p) => revalPaths.push(p),
      revalidateTag: (t) => revalTags.push(t),
    });

    assert.equal(res.status, 200);
    assert.ok(revalPaths.includes("/blog/nova-estrategia-2026"), "Deve revalidar o novo slug");
    assert.ok(revalPaths.includes("/blog/antiga-estrategia-2025"), "Deve revalidar o slug anterior");
    assert.ok(revalPaths.includes("/blog"), "Deve revalidar a listagem");
    assert.ok(revalPaths.includes("/sitemap.xml"), "Deve revalidar o sitemap com URL atualizada");
    assert.ok(revalTags.includes("organic:a2max:article:nova-estrategia-2026"));
    assert.ok(revalTags.includes("organic:a2max:article:antiga-estrategia-2025"));
  });

  // 10. Requisição duplicada (Idempotência)
  await t.test("10. Requisição duplicada: detecta replay pelo eventId e responde 200 com duplicate: true sem re-executar", async () => {
    const payload = makeValidPayload({ eventId: "evt_unique_1001" });
    let executionCount = 0;

    const spyRevalidate = () => {
      executionCount++;
    };

    // 10.1 Primeira execução: executa normalmente
    const { req: reqFirst } = createSignedRequest(payload, TEST_SECRET);
    const resFirst = await handleRevalidation(reqFirst, {
      secret: TEST_SECRET,
      revalidatePath: spyRevalidate,
      revalidateTag: spyRevalidate,
    });

    assert.equal(resFirst.status, 200);
    const jsonFirst = await resFirst.json();
    assert.equal(jsonFirst.ok, true);
    assert.equal(jsonFirst.revalidated, true);
    assert.equal(jsonFirst.duplicate, undefined);
    assert.ok(executionCount > 0, "Deveria ter executado revalidações");

    const countAfterFirst = executionCount;

    // 10.2 Segunda execução com mesmo eventId: idempotência ativa
    const { req: reqSecond } = createSignedRequest(payload, TEST_SECRET);
    const resSecond = await handleRevalidation(reqSecond, {
      secret: TEST_SECRET,
      revalidatePath: spyRevalidate,
      revalidateTag: spyRevalidate,
    });

    assert.equal(resSecond.status, 200);
    const jsonSecond = await resSecond.json();
    assert.equal(jsonSecond.ok, true);
    assert.equal(jsonSecond.revalidated, false);
    assert.equal(jsonSecond.duplicate, true);
    assert.equal(executionCount, countAfterFirst, "NÃO deve ter re-executado revalidações no replay");
  });

  // 11. Ausência do segredo
  await t.test("11. Ausência do segredo: retorna 500 sem vazar detalhes quando segredo não está configurado", async () => {
    const payload = makeValidPayload();
    const { req } = createSignedRequest(payload, "any-key");

    const res = await handleRevalidation(req, { secret: "" }); // Empty secret
    assert.equal(res.status, 500);
    const json = await res.json();
    assert.equal(json.ok, false);
    assert.equal(json.error, "SERVER_CONFIG_ERROR");
  });

  // 12. Compatibilidade com cache do Next.js 16 (Tags e Fetch)
  await t.test("12. Compatibilidade com cache do Next.js 16: SDK anexa tags de cache e GET retorna 405 Method Not Allowed", async () => {
    // 12.1 GET retorna 405
    const resGet = await GET();
    assert.equal(resGet.status, 405);
    assert.equal(resGet.headers.get("Allow"), "POST");

    // 12.2 SDK fetchOptions anexa tags de cache para Data Cache
    let capturedTags: string[] | undefined;
    const mockFetch = async (_url: RequestInfo | URL, init?: RequestInit) => {
      const nextOpt = (init as { next?: { tags?: string[] } })?.next;
      capturedTags = nextOpt?.tags;
      return new Response(JSON.stringify({ data: { articles: [], total: 0, limit: 10, offset: 0 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const config: OrganicConfig = {
      apiUrl: "http://localhost:3000",
      publicationId: "a2max",
      installationKey: "inst-a2max-web",
      timeoutMs: 3000,
      revalidateSeconds: 60,
    };

    const client = createOrganicClient(config, mockFetch as unknown as typeof fetch);
    await client.getArticles();

    assert.ok(Array.isArray(capturedTags));
    assert.ok(capturedTags.includes("organic"));
    assert.ok(capturedTags.includes("organic:a2max"));
    assert.ok(capturedTags.includes("organic:a2max:articles"));
  });
});
