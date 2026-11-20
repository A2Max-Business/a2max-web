import type { PublicCoverDTO } from './types';

/**
 * Validates whether an article cover object contains a usable, authentic image URL.
 * Rejects empty strings, whitespace-only, non-web protocols, and known synthetic test artifacts.
 */
export function isValidCover(cover?: PublicCoverDTO | null): boolean {
  if (!cover || typeof cover !== 'object') return false;
  if (!cover.url || typeof cover.url !== 'string') return false;
  const cleanUrl = cover.url.trim();
  if (cleanUrl.length === 0) return false;
  if (
    !cleanUrl.startsWith('http://') &&
    !cleanUrl.startsWith('https://') &&
    !cleanUrl.startsWith('/')
  ) {
    return false;
  }
  // Exclude synthetic placeholder test artifacts
  if (cleanUrl.includes('homologacao-persistencia')) {
    return false;
  }
  return true;
}
