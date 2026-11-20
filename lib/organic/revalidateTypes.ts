/**
 * A2 Organic Acquisition — Revalidation Webhook Contract & Types
 * Dedicated types for the consumer revalidation endpoint.
 */

export type RevalidateEventType =
  | 'content.published'
  | 'content.updated'
  | 'content.archived'
  | 'content.unpublished'
  | 'showcase.updated';

export interface RevalidateWebhookPayload {
  /** Unique identifier of the event for idempotency and tracing */
  eventId: string;
  /** Editorial event type */
  event: RevalidateEventType;
  /** Destination publication identifier (must match consumer publication) */
  publicationId: string;
  /** Current article slug (required for content.* events) */
  slug?: string;
  /** Previous article slug (optional, used when URL has changed) */
  previousSlug?: string;
  /** Event generation timestamp in Unix milliseconds */
  timestamp: number;
}

export interface RevalidateSuccessResponse {
  ok: true;
  eventId: string;
  event: RevalidateEventType;
  revalidated: boolean;
  duplicate?: boolean;
  paths: string[];
  tags: string[];
  processedAt: string;
  message?: string;
}

export interface RevalidateErrorResponse {
  ok: false;
  error: string;
  message: string;
}

export type RevalidateResponse = RevalidateSuccessResponse | RevalidateErrorResponse;
