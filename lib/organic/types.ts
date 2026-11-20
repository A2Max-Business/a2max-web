/**
 * A2 Organic Acquisition — Public Consumer Contracts & DTOs
 * Isolated client-side DTO contracts for consumer websites (e.g. A2Max).
 * 
 * STRICT ARCHITECTURAL PRINCIPLE:
 * Zero coupling with Organic internal database, Supabase, or internal domain entities.
 * Can be extracted into standalone @a2/organic-client package.
 */

export interface PublicAuthorDTO {
  name: string;
  role?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface PublicCoverDTO {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface PublicCategoryDTO {
  slug: string;
  name: string;
  description?: string;
}

export interface PublicCtaDTO {
  id: string;
  label: string;
  destinationUrl: string;
  conversionGoal: string;
  supportingText?: string;
}

export interface PublicSeoDTO {
  title: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, unknown>;
}

export interface PublicSocialDTO {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface PublicArticleSummaryDTO {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  cover?: PublicCoverDTO;
  author: PublicAuthorDTO;
  category?: PublicCategoryDTO;
  tags: string[];
  publishedAt: string;
  readingTime?: number;
  canonical?: string;
}

export interface PublicArticleDTO extends PublicArticleSummaryDTO {
  id?: string;
  body: string;
  updatedAt: string;
  seo: PublicSeoDTO;
  social?: PublicSocialDTO;
  cta?: PublicCtaDTO;
  related: PublicArticleSummaryDTO[];
  status?: string;
  preview?: boolean;
  canonical?: string;
}

export interface PublicShowcaseArticleDTO extends PublicArticleSummaryDTO {
  position?: number;
  canonical?: string;
}

export interface PublicShowcaseListDTO {
  articles: PublicShowcaseArticleDTO[];
}

export interface PublicArticleListDTO {
  articles: PublicArticleSummaryDTO[];
  total: number;
  limit: number;
  offset: number;
}

export interface PublicCategoryListDTO {
  categories: PublicCategoryDTO[];
}

export interface PublicErrorDTO {
  error: string;
  message: string;
  status: number;
}

export interface GetArticlesOptions {
  limit?: number;
  offset?: number;
  category?: string;
}

export interface OrganicConfig {
  apiUrl: string;
  publicationId: string;
  installationKey: string;
  timeoutMs: number;
  previewTimeoutMs?: number;
  revalidateSeconds: number;
  previewSecret?: string;
}

