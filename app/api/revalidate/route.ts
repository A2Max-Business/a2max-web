/**
 * A2 Organic Acquisition — Secure Revalidation Endpoint for A2Max
 * Receives and verifies HMAC-signed editorial update notifications from Organic Core.
 *
 * SECURITY:
 * - Exclusively accepts POST requests.
 * - Enforces 64 KB maximum payload size limit.
 * - Verifies HMAC-SHA256 signature using timing-safe comparison.
 * - Validates publicationId equals "a2max" (or configured publication).
 * - Enforces 5-minute timestamp tolerance window.
 * - Strictly sanitizes article slug and previousSlug (alphanumeric and hyphens only).
 * - Internally resolves authorized paths and cache tags (never trusts external paths).
 * - In-memory idempotency cache prevents duplicate replay attacks.
 * - Uses dedicated A2_ORGANIC_REVALIDATE_SECRET (isolated from preview secret).
 */

import { NextRequest, NextResponse } from "next/server";
import {
  revalidatePath as nextRevalidatePath,
  revalidateTag as nextRevalidateTag,
} from "next/cache";
import {
  MAX_BODY_SIZE_BYTES,
  TIMESTAMP_TOLERANCE_MS,
  ALLOWED_REVALIDATE_EVENTS,
  verifyHmacSignature,
  isValidSlug,
  isValidTimestamp,
  isEventDuplicate,
  recordProcessedEvent,
  resolveInvalidationTargets,
  type RevalidateEventType,
  type RevalidateWebhookPayload,
  type RevalidateSuccessResponse,
  type RevalidateErrorResponse,
} from "@/lib/organic";

export interface RevalidateRouteOptions {
  secret?: string;
  expectedPublicationId?: string;
  revalidatePath?: (path: string) => void;
  revalidateTag?: (tag: string, profile?: unknown) => void;
  now?: () => number;
}

export async function handleRevalidation(
  req: NextRequest,
  options?: RevalidateRouteOptions
): Promise<NextResponse<RevalidateSuccessResponse | RevalidateErrorResponse>> {
  const now = options?.now ? options.now() : Date.now();
  const secret = options?.secret || process.env.A2_ORGANIC_REVALIDATE_SECRET;
  const expectedPublicationId =
    options?.expectedPublicationId ||
    process.env.A2_ORGANIC_PUBLICATION_ID ||
    "a2max";

  // 1. Verify that the revalidation secret is configured on the server
  if (!secret || typeof secret !== "string" || !secret.trim()) {
    console.error(
      "[Revalidate] Erro de configuração: A2_ORGANIC_REVALIDATE_SECRET não configurado."
    );
    return NextResponse.json(
      {
        ok: false,
        error: "SERVER_CONFIG_ERROR",
        message: "Revalidation endpoint is not configured.",
      },
      { status: 500 }
    );
  }

  // 2. Reject payloads exceeding size limit early via Content-Length header
  const contentLengthHeader = req.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = parseInt(contentLengthHeader, 10);
    if (!isNaN(contentLength) && contentLength > MAX_BODY_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "PAYLOAD_TOO_LARGE",
          message: `Request body exceeds maximum allowed size of ${MAX_BODY_SIZE_BYTES} bytes.`,
        },
        { status: 413 }
      );
    }
  }

  // 3. Read raw body as text for HMAC verification
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "READ_ERROR",
        message: "Failed to read request body.",
      },
      { status: 400 }
    );
  }

  if (rawBody.length > MAX_BODY_SIZE_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: "PAYLOAD_TOO_LARGE",
        message: `Request body exceeds maximum allowed size of ${MAX_BODY_SIZE_BYTES} bytes.`,
      },
      { status: 413 }
    );
  }

  // 4. Verify HMAC-SHA256 signature with constant-time comparison
  const signatureHeader =
    req.headers.get("x-organic-signature") ||
    req.headers.get("x-signature-256") ||
    req.headers.get("x-hub-signature-256");

  const isSignatureValid = verifyHmacSignature(rawBody, signatureHeader, secret);
  if (!isSignatureValid) {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_SIGNATURE",
        message: "HMAC signature verification failed.",
      },
      { status: 401 }
    );
  }

  // 5. Parse JSON
  let payload: Partial<RevalidateWebhookPayload>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_JSON",
        message: "Failed to parse JSON body.",
      },
      { status: 400 }
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_PAYLOAD",
        message: "Payload must be a JSON object.",
      },
      { status: 400 }
    );
  }

  const { eventId, event, publicationId, slug, previousSlug, timestamp } = payload;

  // 6. Validate eventId
  if (!eventId || typeof eventId !== "string" || !eventId.trim()) {
    return NextResponse.json(
      {
        ok: false,
        error: "MISSING_EVENT_ID",
        message: "Field eventId is required.",
      },
      { status: 400 }
    );
  }

  // 7. Validate event type
  if (!event || !ALLOWED_REVALIDATE_EVENTS.has(event as RevalidateEventType)) {
    return NextResponse.json(
      {
        ok: false,
        error: "UNKNOWN_EVENT",
        message: `Event "${String(event)}" is not recognized. Allowed events: ${Array.from(ALLOWED_REVALIDATE_EVENTS).join(", ")}.`,
      },
      { status: 400 }
    );
  }

  // 8. Validate publicationId
  if (!publicationId || publicationId !== expectedPublicationId) {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_PUBLICATION",
        message: `Publication "${String(publicationId)}" is not authorized. Expected "${expectedPublicationId}".`,
      },
      { status: 403 }
    );
  }

  // 9. Validate timestamp with 5-minute tolerance
  if (!isValidTimestamp(timestamp, now, TIMESTAMP_TOLERANCE_MS)) {
    return NextResponse.json(
      {
        ok: false,
        error: "TIMESTAMP_OUT_OF_BOUNDS",
        message: "Timestamp is expired or outside the allowed 5-minute window.",
      },
      { status: 400 }
    );
  }

  // 10. Validate slug and previousSlug
  if (event !== "showcase.updated") {
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        {
          ok: false,
          error: "MALFORMED_SLUG",
          message: "Article slug is invalid or malformed.",
        },
        { status: 400 }
      );
    }
  } else if (slug !== undefined && !isValidSlug(slug)) {
    return NextResponse.json(
      {
        ok: false,
        error: "MALFORMED_SLUG",
        message: "Article slug is invalid or malformed.",
      },
      { status: 400 }
    );
  }

  if (previousSlug !== undefined && !isValidSlug(previousSlug)) {
    return NextResponse.json(
      {
        ok: false,
        error: "MALFORMED_PREVIOUS_SLUG",
        message: "Previous article slug is invalid or malformed.",
      },
      { status: 400 }
    );
  }

  // 11. Idempotency: Deduplicate replay within active TTL window
  if (isEventDuplicate(eventId, now)) {
    return NextResponse.json(
      {
        ok: true,
        eventId,
        event: event as RevalidateEventType,
        revalidated: false,
        duplicate: true,
        paths: [],
        tags: [],
        processedAt: new Date(now).toISOString(),
        message: "Event already processed. Duplicate skipped.",
      },
      { status: 200 }
    );
  }

  // 12. Resolve internally constructed paths and cache tags
  const validPayload: RevalidateWebhookPayload = {
    eventId,
    event: event as RevalidateEventType,
    publicationId,
    slug,
    previousSlug,
    timestamp: timestamp as number,
  };

  const { paths, tags } = resolveInvalidationTargets(validPayload);

  // 13. Execute revalidation directly (no fire-and-forget void)
  const doRevalidatePath = options?.revalidatePath || nextRevalidatePath;
  const doRevalidateTag = options?.revalidateTag || nextRevalidateTag;

  for (const tag of tags) {
    try {
      doRevalidateTag(tag, { expire: 0 });
    } catch (err) {
      console.warn(`[Revalidate] Erro ao revalidar tag "${tag}":`, err);
    }
  }

  for (const path of paths) {
    try {
      doRevalidatePath(path);
    } catch (err) {
      console.warn(`[Revalidate] Erro ao revalidar path "${path}":`, err);
    }
  }

  // 14. Record event as processed in memory
  recordProcessedEvent(eventId, now);

  return NextResponse.json(
    {
      ok: true,
      eventId,
      event: event as RevalidateEventType,
      revalidated: true,
      paths,
      tags,
      processedAt: new Date(now).toISOString(),
    },
    { status: 200 }
  );
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<RevalidateSuccessResponse | RevalidateErrorResponse>> {
  return handleRevalidation(req);
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      ok: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Method not allowed. Only POST requests are accepted.",
    },
    { status: 405, headers: { Allow: "POST" } }
  );
}
