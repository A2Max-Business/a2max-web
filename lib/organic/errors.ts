/**
 * A2 Organic Acquisition — Typed Client Errors
 * Distinct error hierarchy for clean handling in Next.js Server Components.
 */

export class OrganicClientError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.name = 'OrganicClientError';
    this.status = status;
    this.code = code;
  }
}

export class OrganicConfigError extends OrganicClientError {
  constructor(message: string) {
    super(message, 500, 'CONFIGURATION_ERROR');
    this.name = 'OrganicConfigError';
  }
}

export class OrganicAuthError extends OrganicClientError {
  constructor(message: string, status: number = 403, code: string = 'UNAUTHORIZED') {
    super(message, status, code);
    this.name = 'OrganicAuthError';
  }
}

export class OrganicTimeoutError extends OrganicClientError {
  constructor(message: string = 'Request timed out waiting for A2 Organic API') {
    super(message, 408, 'TIMEOUT');
    this.name = 'OrganicTimeoutError';
  }
}

export class OrganicNetworkError extends OrganicClientError {
  constructor(message: string, cause?: unknown) {
    super(message, 503, 'SERVICE_UNAVAILABLE');
    this.name = 'OrganicNetworkError';
    if (cause) {
      this.cause = cause;
    }
  }
}
