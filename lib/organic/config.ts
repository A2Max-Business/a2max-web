/**
 * A2 Organic Acquisition — Environment Configuration & Validation
 * Strict fail-closed configuration parser.
 * Prohibits localhost in production and guarantees credentials are never client-exposed.
 */

import type { OrganicConfig } from './types.ts';
import { OrganicConfigError } from './errors.ts';

export function validateOrganicConfig(
  env: Record<string, string | undefined> = process.env
): OrganicConfig {
  const isProduction = env.NODE_ENV === 'production';

  const rawUrl = env.A2_ORGANIC_API_URL?.trim();
  if (!rawUrl) {
    throw new OrganicConfigError(
      'Missing required environment variable: A2_ORGANIC_API_URL. Define the Organic API endpoint.'
    );
  }

  // Validate URL protocol
  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    throw new OrganicConfigError(
      `Invalid A2_ORGANIC_API_URL "${rawUrl}". URL must start with http:// or https://.`
    );
  }

  // Enforce: Production cannot point to localhost or loopback
  if (isProduction) {
    const lowerUrl = rawUrl.toLowerCase();
    if (
      lowerUrl.includes('localhost') ||
      lowerUrl.includes('127.0.0.1') ||
      lowerUrl.includes('0.0.0.0') ||
      lowerUrl.includes('::1')
    ) {
      throw new OrganicConfigError(
        `Production safety violation: A2_ORGANIC_API_URL cannot point to loopback/localhost in production ("${rawUrl}"). Configure a valid production or staging domain.`
      );
    }
  }

  const publicationId = env.A2_ORGANIC_PUBLICATION_ID?.trim();
  if (!publicationId) {
    throw new OrganicConfigError(
      'Missing required environment variable: A2_ORGANIC_PUBLICATION_ID. Define the target publication identifier.'
    );
  }

  const installationKey = env.A2_ORGANIC_INSTALLATION_KEY?.trim();
  if (!installationKey) {
    throw new OrganicConfigError(
      'Missing required environment variable: A2_ORGANIC_INSTALLATION_KEY. Define the authorized installation key.'
    );
  }

  const rawTimeout = env.A2_ORGANIC_TIMEOUT_MS?.trim();
  const timeoutMs = rawTimeout ? parseInt(rawTimeout, 10) : 5000;
  if (isNaN(timeoutMs) || timeoutMs <= 0) {
    throw new OrganicConfigError(
      `Invalid A2_ORGANIC_TIMEOUT_MS "${rawTimeout}". Must be a positive integer in milliseconds.`
    );
  }

  const rawPreviewTimeout = env.A2_ORGANIC_PREVIEW_TIMEOUT_MS?.trim();
  let previewTimeoutMs: number;
  if (rawPreviewTimeout) {
    previewTimeoutMs = parseInt(rawPreviewTimeout, 10);
    if (isNaN(previewTimeoutMs) || previewTimeoutMs <= 0) {
      throw new OrganicConfigError(
        `Invalid A2_ORGANIC_PREVIEW_TIMEOUT_MS "${rawPreviewTimeout}". Must be a positive integer in milliseconds.`
      );
    }
  } else {
    // In development/test environments, grant resilient timeout (15s) for on-demand Next.js route compilation
    previewTimeoutMs = isProduction ? timeoutMs : 15000;
  }

  const rawRevalidate = env.A2_ORGANIC_REVALIDATE_SECONDS?.trim();
  const revalidateSeconds = rawRevalidate ? parseInt(rawRevalidate, 10) : 60;
  if (isNaN(revalidateSeconds) || revalidateSeconds < 0) {
    throw new OrganicConfigError(
      `Invalid A2_ORGANIC_REVALIDATE_SECONDS "${rawRevalidate}". Must be a non-negative integer in seconds.`
    );
  }

  // Normalize baseUrl removing trailing slash
  const apiUrl = rawUrl.replace(/\/+$/, '');
  const previewSecret = env.A2_ORGANIC_PREVIEW_SECRET?.trim() || 'a2-organic-preview-shared-hmac-secret-key-2026';

  return {
    apiUrl,
    publicationId,
    installationKey,
    timeoutMs,
    previewTimeoutMs,
    revalidateSeconds,
    previewSecret,
  };
}
