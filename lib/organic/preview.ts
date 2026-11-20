/**
 * A2 Organic Acquisition — Consumer Client Preview Token Verifier
 * Validates cryptographically signed preview tokens on the consumer side.
 */

import crypto from 'crypto';

export interface PreviewTokenPayload {
  tenantId: string;
  publicationId: string;
  contentId: string;
  slug: string;
  exp: number; // Unix timestamp in seconds
  iat: number; // Unix timestamp in seconds
}

export type PreviewVerificationResult =
  | { valid: true; payload: PreviewTokenPayload }
  | { valid: false; error: string; code: 'MISSING' | 'MALFORMED' | 'INVALID_SIGNATURE' | 'EXPIRED' | 'PUBLICATION_MISMATCH' };

function base64UrlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8');
}

export function verifyConsumerPreviewToken(
  token: string | null | undefined,
  expectedPublicationId: string,
  secret: string = process.env.A2_ORGANIC_PREVIEW_SECRET || 'a2-organic-preview-shared-hmac-secret-key-2026'
): PreviewVerificationResult {
  if (!token || typeof token !== 'string') {
    return {
      valid: false,
      code: 'MISSING',
      error: 'Token de preview ausente. Solicite o link de preview a partir do Control Center.',
    };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return {
      valid: false,
      code: 'MALFORMED',
      error: 'Estrutura do token de preview é inválida ou foi corrompida.',
    };
  }

  const [encodedPayload, signature] = parts;

  // Recompute signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedSigBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)
  ) {
    return {
      valid: false,
      code: 'INVALID_SIGNATURE',
      error: 'Assinatura criptográfica do token de preview inválida ou adulterada.',
    };
  }

  let payload: PreviewTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as PreviewTokenPayload;
  } catch {
    return {
      valid: false,
      code: 'MALFORMED',
      error: 'Falha ao decodificar os dados do token de preview.',
    };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp < nowSec) {
    const expiredMinutesAgo = Math.round((nowSec - payload.exp) / 60);
    return {
      valid: false,
      code: 'EXPIRED',
      error: `Este token de preview expirou há ${expiredMinutesAgo > 0 ? expiredMinutesAgo : 1} minuto(s). Tokens de rascunho são temporários (validade de 15 minutos). Gere um novo preview no Control Center.`,
    };
  }

  if (payload.publicationId !== expectedPublicationId) {
    return {
      valid: false,
      code: 'PUBLICATION_MISMATCH',
      error: `Token emitido para a publicação "${payload.publicationId}", incompatível com este portal ("${expectedPublicationId}").`,
    };
  }

  return { valid: true, payload };
}

