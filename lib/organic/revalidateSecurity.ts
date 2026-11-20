/**
 * A2 Organic Acquisition — Revalidation Webhook Security & Invalidation Logic
 * HMAC-SHA256 constant-time verification, slug sanitization, timestamp validation,
 * in-memory idempotency cache and internal path resolution.
 */

import crypto from 'node:crypto';
import type {
  RevalidateEventType,
  RevalidateWebhookPayload,
} from './revalidateTypes.ts';

export const MAX_BODY_SIZE_BYTES = 64 * 1024; // 64 KB
export const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes
export const PROCESSED_EVENTS_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_PROCESSED_EVENTS_CACHE = 1000;

export const ALLOWED_REVALIDATE_EVENTS: ReadonlySet<RevalidateEventType> = new Set([
  'content.published',
  'content.updated',
  'content.archived',
  'content.unpublished',
  'showcase.updated',
]);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Computes the HMAC-SHA256 signature for a raw payload string.
 */
export function computeHmacSignature(rawBody: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  return hmac.digest('hex');
}

/**
 * Verifies the HMAC-SHA256 signature using timing-safe constant-time comparison.
 */
export function verifyHmacSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  secret: string
): boolean {
  if (!signatureHeader || typeof signatureHeader !== 'string' || !secret) {
    return false;
  }

  // Strip optional 'sha256=' prefix if present
  const providedHex = signatureHeader.replace(/^sha256=/, '').trim();
  const expectedHex = computeHmacSignature(rawBody, secret);

  const providedBuf = Buffer.from(providedHex, 'hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');

  if (providedBuf.length !== expectedBuf.length || providedBuf.length === 0) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuf, expectedBuf);
}

/**
 * Validates article slug against strict alphanumeric and hyphen rules.
 * Prohibits slashes, backslashes, path traversal (..), spaces and uppercase.
 */
export function isValidSlug(slug: unknown): slug is string {
  if (typeof slug !== 'string') return false;
  const trimmed = slug.trim();
  if (trimmed.length < 1 || trimmed.length > 200) return false;
  return SLUG_REGEX.test(trimmed);
}

/**
 * Validates timestamp with 5-minute tolerance.
 */
export function isValidTimestamp(
  timestamp: unknown,
  now: number = Date.now(),
  toleranceMs: number = TIMESTAMP_TOLERANCE_MS
): boolean {
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
    return false;
  }
  const diff = Math.abs(now - timestamp);
  return diff <= toleranceMs;
}

// In-memory idempotency cache (LRU-like eviction)
interface ProcessedEntry {
  timestamp: number;
}

const processedEventsMap = new Map<string, ProcessedEntry>();

export function cleanExpiredEvents(now: number = Date.now()): void {
  for (const [id, entry] of processedEventsMap.entries()) {
    if (now - entry.timestamp > PROCESSED_EVENTS_TTL_MS) {
      processedEventsMap.delete(id);
    }
  }
}

export function isEventDuplicate(eventId: string, now: number = Date.now()): boolean {
  cleanExpiredEvents(now);
  return processedEventsMap.has(eventId);
}

export function recordProcessedEvent(eventId: string, now: number = Date.now()): void {
  cleanExpiredEvents(now);
  if (processedEventsMap.size >= MAX_PROCESSED_EVENTS_CACHE) {
    const oldestKey = processedEventsMap.keys().next().value;
    if (oldestKey) processedEventsMap.delete(oldestKey);
  }
  processedEventsMap.set(eventId, { timestamp: now });
}

export function _resetProcessedEventsCache(): void {
  processedEventsMap.clear();
}

export interface InvalidationTargets {
  paths: string[];
  tags: string[];
}

/**
 * Strictly constructs authorized invalidation paths and cache tags internally.
 * Never accepts external or arbitrary paths from the webhook payload.
 */
export function resolveInvalidationTargets(payload: RevalidateWebhookPayload): InvalidationTargets {
  const { event, publicationId, slug, previousSlug } = payload;
  const paths = new Set<string>();
  const tags = new Set<string>();

  const pub = publicationId || 'a2max';

  switch (event) {
    case 'showcase.updated': {
      paths.add('/');
      tags.add(`organic:${pub}:showcase`);
      break;
    }

    case 'content.published':
    case 'content.archived':
    case 'content.unpublished': {
      paths.add('/blog');
      paths.add('/');
      paths.add('/sitemap.xml');
      tags.add(`organic:${pub}:articles`);
      tags.add(`organic:${pub}:showcase`);

      if (slug) {
        paths.add(`/blog/${slug}`);
        tags.add(`organic:${pub}:article:${slug}`);
      }

      if (previousSlug) {
        paths.add(`/blog/${previousSlug}`);
        tags.add(`organic:${pub}:article:${previousSlug}`);
      }
      break;
    }

    case 'content.updated': {
      paths.add('/blog');
      paths.add('/'); // In case this article is currently displayed in the showcase
      tags.add(`organic:${pub}:articles`);
      tags.add(`organic:${pub}:showcase`);

      if (slug) {
        paths.add(`/blog/${slug}`);
        tags.add(`organic:${pub}:article:${slug}`);
      }

      if (previousSlug) {
        paths.add(`/blog/${previousSlug}`);
        paths.add('/sitemap.xml'); // Slug change affects public sitemap URLs
        tags.add(`organic:${pub}:article:${previousSlug}`);
      }
      break;
    }
  }

  return {
    paths: Array.from(paths),
    tags: Array.from(tags),
  };
}
