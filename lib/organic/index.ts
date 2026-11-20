/**
 * A2 Organic Acquisition — Client Module Index
 * Re-exports public contracts, client factory, errors and config validation.
 */

export * from './types.ts';
export * from './errors.ts';
export * from './config.ts';
export * from './preview.ts';
export * from './siteUrl.ts';
export * from './revalidateTypes.ts';
export * from './revalidateSecurity.ts';
export { createOrganicClient, type OrganicClient } from './client.ts';
