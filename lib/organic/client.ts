/**
 * A2 Organic Acquisition — Server-Side Public API Client
 * Framework-agnostic typed client consuming the A2 Organic Public API V1.
 * 
 * STRICT INVARIANTS:
 * 1. Zero database, Supabase or private secret access.
 * 2. Communicates strictly over HTTP/JSON with /api/public/v1/*.
 * 3. Supports Next.js ISR caching and custom fetch injection for testing.
 */

import type {
  OrganicConfig,
  GetArticlesOptions,
  PublicArticleListDTO,
  PublicArticleDTO,
  PublicCategoryDTO,
  PublicCategoryListDTO,
  PublicArticleSummaryDTO,
  PublicShowcaseArticleDTO,
  PublicShowcaseListDTO,
  PublicErrorDTO,
} from './types.ts';
import {
  OrganicClientError,
  OrganicAuthError,
  OrganicTimeoutError,
  OrganicNetworkError,
} from './errors.ts';

export interface OrganicClient {
  readonly config: Readonly<OrganicConfig>;
  getArticles(options?: GetArticlesOptions): Promise<PublicArticleListDTO>;
  getAllArticles(pageSize?: number): Promise<PublicArticleSummaryDTO[]>;
  getArticleBySlug(slug: string): Promise<PublicArticleDTO | null>;
  getCategories(): Promise<PublicCategoryDTO[]>;
  getLatestArticles(limit?: number): Promise<PublicArticleSummaryDTO[]>;
  getShowcaseArticles(limit?: number): Promise<PublicShowcaseArticleDTO[]>;
  getPreviewArticle(contentId: string, token: string): Promise<PublicArticleDTO | null>;
}

export function createOrganicClient(
  config: OrganicConfig,
  fetchFn: typeof fetch = fetch
): OrganicClient {
  const { apiUrl, publicationId, installationKey, timeoutMs, previewTimeoutMs, revalidateSeconds } = config;
  const baseUrl = `${apiUrl}/api/public/v1`;

  async function request<T>(path: string, tags?: string[]): Promise<T | null> {
    const url = `${baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const fetchOptions: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'X-Installation-Id': installationKey,
        },
      };

      if (revalidateSeconds !== undefined) {
        if (revalidateSeconds === 0) {
          fetchOptions.cache = 'no-store';
        } else {
          fetchOptions.next = {
            revalidate: revalidateSeconds,
            ...(tags && tags.length > 0 ? { tags } : {}),
          };
        }
      }

      const response = await fetchFn(url, fetchOptions);
      clearTimeout(timer);

      if (response.status === 404) {
        return null;
      }

      if (response.status === 401 || response.status === 403) {
        const errJson = (await response.json().catch(() => null)) as PublicErrorDTO | null;
        throw new OrganicAuthError(
          errJson?.message || `Access denied for installation "${installationKey}" or publication "${publicationId}".`,
          response.status,
          errJson?.error || 'FORBIDDEN'
        );
      }

      if (!response.ok) {
        const errJson = (await response.json().catch(() => null)) as PublicErrorDTO | null;
        throw new OrganicClientError(
          errJson?.message || `API error from A2 Organic (HTTP ${response.status})`,
          response.status,
          errJson?.error || 'INTERNAL_ERROR'
        );
      }

      const body = await response.json();
      return (body && typeof body === 'object' && 'data' in body ? body.data : body) as T;
    } catch (err: unknown) {
      clearTimeout(timer);

      if (err instanceof OrganicClientError) {
        throw err;
      }

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new OrganicTimeoutError(
            `A2 Organic API request timed out after ${timeoutMs}ms: ${url}`
          );
        }
        throw new OrganicNetworkError(
          `Network connection failed when reaching A2 Organic API: ${err.message}`,
          err
        );
      }

      throw new OrganicNetworkError('Unknown network failure communicating with A2 Organic API');
    }
  }

  return {
    config: Object.freeze({ ...config }),

    async getArticles(options: GetArticlesOptions = {}): Promise<PublicArticleListDTO> {
      const params = new URLSearchParams();
      if (options.limit !== undefined) params.set('limit', String(options.limit));
      if (options.offset !== undefined) params.set('offset', String(options.offset));
      if (options.category) params.set('category', options.category);

      const qs = params.toString();
      const path = `/publications/${encodeURIComponent(publicationId)}/articles${qs ? `?${qs}` : ''}`;
      const result = await request<PublicArticleListDTO>(path, [
        'organic',
        `organic:${publicationId}`,
        `organic:${publicationId}:articles`,
      ]);

      if (!result) {
        return {
          articles: [],
          total: 0,
          limit: options.limit || 10,
          offset: options.offset || 0,
        };
      }

      return result;
    },

    async getAllArticles(pageSize: number = 50): Promise<PublicArticleSummaryDTO[]> {
      const safePageSize = Math.min(Math.max(pageSize, 1), 50);
      const articleMap = new Map<string, PublicArticleSummaryDTO>();
      let offset = 0;
      let total = Infinity;
      const maxPages = 100;
      let pagesFetched = 0;

      while (offset < total && pagesFetched < maxPages) {
        const page = await this.getArticles({ limit: safePageSize, offset });
        pagesFetched++;

        if (!page || !page.articles || page.articles.length === 0) {
          break;
        }

        for (const article of page.articles) {
          if (article && article.slug) {
            // Deduplicate by slug to guarantee no duplicate URLs in sitemap
            articleMap.set(article.slug, article);
          }
        }

        if (typeof page.total === 'number' && Number.isFinite(page.total)) {
          total = page.total;
        }

        const countThisPage = page.articles.length;
        offset += countThisPage;

        // Terminate cleanly if offset reached total or last incomplete page without total
        if (offset >= total) {
          break;
        }
        if (countThisPage < safePageSize && !Number.isFinite(total)) {
          break;
        }
      }

      // Reject truncated sets if maxPages was exhausted while more articles remain
      if (pagesFetched >= maxPages && offset < total) {
        throw new Error(
          `[OrganicClient] getAllArticles: Limite máximo de paginação (${maxPages} páginas) atingido com registros pendentes (${articleMap.size}/${total}). Conjunto truncado rejeitado para proteger integridade de SEO.`
        );
      }

      return Array.from(articleMap.values());
    },

    async getArticleBySlug(slug: string): Promise<PublicArticleDTO | null> {
      if (!slug || typeof slug !== 'string') {
        return null;
      }

      const cleanSlug = slug.trim();
      const path = `/publications/${encodeURIComponent(publicationId)}/articles/${encodeURIComponent(cleanSlug)}`;
      return request<PublicArticleDTO>(path, [
        'organic',
        `organic:${publicationId}`,
        `organic:${publicationId}:article:${cleanSlug}`,
      ]);
    },

    async getCategories(): Promise<PublicCategoryDTO[]> {
      const path = `/publications/${encodeURIComponent(publicationId)}/categories`;
      const result = await request<PublicCategoryListDTO | { categories: PublicCategoryDTO[] }>(path, [
        'organic',
        `organic:${publicationId}`,
        `organic:${publicationId}:categories`,
      ]);

      if (!result || !('categories' in result) || !Array.isArray(result.categories)) {
        return [];
      }

      return result.categories;
    },

    async getLatestArticles(limit: number = 3): Promise<PublicArticleSummaryDTO[]> {
      const safeLimit = Math.min(Math.max(limit, 1), 20);
      const path = `/publications/${encodeURIComponent(publicationId)}/latest?limit=${safeLimit}`;
      const result = await request<{ articles: PublicArticleSummaryDTO[] } | PublicArticleSummaryDTO[]>(path, [
        'organic',
        `organic:${publicationId}`,
        `organic:${publicationId}:latest`,
      ]);

      if (!result) {
        return [];
      }

      if (Array.isArray(result)) {
        return result;
      }

      if ('articles' in result && Array.isArray(result.articles)) {
        return result.articles;
      }

      return [];
    },

    async getShowcaseArticles(limit: number = 4): Promise<PublicShowcaseArticleDTO[]> {
      const safeLimit = Math.min(Math.max(limit, 1), 10);
      const path = `/publications/${encodeURIComponent(publicationId)}/showcase?limit=${safeLimit}`;
      const result = await request<PublicShowcaseListDTO | { articles: PublicShowcaseArticleDTO[] } | PublicShowcaseArticleDTO[]>(path, [
        'organic',
        `organic:${publicationId}`,
        `organic:${publicationId}:showcase`,
      ]);

      if (!result) {
        return [];
      }

      if (Array.isArray(result)) {
        return result;
      }

      if ('articles' in result && Array.isArray(result.articles)) {
        return result.articles;
      }

      return [];
    },

    async getPreviewArticle(contentId: string, token: string): Promise<PublicArticleDTO | null> {
      const path = `${apiUrl}/api/editorial/v1/preview/${encodeURIComponent(contentId)}`;
      const previewTimeout = previewTimeoutMs || timeoutMs;

      async function executeFetch(): Promise<Response> {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), previewTimeout);
        try {
          const res = await fetchFn(path, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
              'X-Preview-Token': token,
              'X-Installation-Id': installationKey,
            },
            cache: 'no-store',
          });
          clearTimeout(timer);
          return res;
        } catch (err) {
          clearTimeout(timer);
          throw err;
        }
      }

      let response: Response;
      try {
        try {
          response = await executeFetch();
        } catch (firstErr: unknown) {
          // If first attempt timed out (e.g. during Next.js cold route compilation), retry once before failing
          if (firstErr instanceof Error && firstErr.name === 'AbortError') {
            response = await executeFetch();
          } else {
            throw firstErr;
          }
        }
      } catch (err: unknown) {
        if (err instanceof OrganicClientError) {
          throw err;
        }
        if (err instanceof Error && err.name === 'AbortError') {
          throw new OrganicTimeoutError(`A2 Organic Preview timed out after ${previewTimeout}ms`);
        }
        throw new OrganicNetworkError(
          `Falha de conexão com A2 Organic Preview: ${err instanceof Error ? err.message : String(err)}`
        );
      }

      if (response.status === 404) {
        return null;
      }

      if (response.status === 401 || response.status === 403) {
        const errJson = (await response.json().catch(() => null)) as PublicErrorDTO | null;
        throw new OrganicAuthError(
          errJson?.message || 'Acesso negado para visualização de preview editorial.',
          response.status,
          errJson?.error || 'FORBIDDEN'
        );
      }

      if (!response.ok) {
        const errJson = (await response.json().catch(() => null)) as PublicErrorDTO | null;
        throw new OrganicClientError(
          errJson?.message || `Erro ao carregar preview editorial (HTTP ${response.status})`,
          response.status,
          errJson?.error || 'INTERNAL_ERROR'
        );
      }

      const body = await response.json();
      return (body && typeof body === 'object' && 'data' in body ? body.data : body) as PublicArticleDTO;
    },
  };
}
