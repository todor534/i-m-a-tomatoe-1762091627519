/* Lightweight API utilities for client-side requests */

export type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export type NewsletterRequest = {
  email: string;
  name?: string;
};

export type NewsletterResponse = {
  success: boolean;
  message: string;
};

export type OrderRequest = {
  quantity: number;
  variant?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  subscribe?: boolean;
};

export type OrderResponse = {
  success: boolean;
  orderId?: string;
  totalCents?: number;
  message?: string;
  errors?: Record<string, string>;
};

export class HttpError<T = unknown> extends Error {
  status: number;
  data?: T;
  constructor(message: string, status: number, data?: T) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

type ApiInit = Omit<RequestInit, 'body' | 'method'> & {
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT = 12000;

function withQuery(url: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return url;
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    usp.append(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;
}

async function parseJsonSafely(res: Response): Promise<unknown> {
  const ct = res.headers.get('content-type') || '';
  if (!ct.toLowerCase().includes('application/json')) {
    // Try to parse as text and return, otherwise null
    try {
      const text = await res.text();
      return text || null;
    } catch {
      return null;
    }
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function doFetch<T = unknown>(
  url: string,
  init: RequestInit,
  { timeoutMs = DEFAULT_TIMEOUT }: ApiInit = {}
): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const data = await parseJsonSafely(res);

    if (!res.ok) {
      const message =
        (data && typeof data === 'object' && 'message' in data && typeof (data as any).message === 'string'
          ? (data as any).message
          : `Request failed with status ${res.status}`) as string;
      throw new HttpError(message, res.status, data);
    }

    return data as T;
  } finally {
    clearTimeout(t);
  }
}

export function getJSON<T = unknown>(
  url: string,
  params?: Record<string, string | number | boolean | undefined | null>,
  init?: ApiInit
): Promise<T> {
  return doFetch<T>(withQuery(url, params), { method: 'GET', headers: { Accept: 'application/json' } }, init);
}

export function postJSON<T = unknown, B = Json>(
  url: string,
  body?: B,
  init?: ApiInit
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(init?.headers || {}),
  };
  const payload = body === undefined ? undefined : JSON.stringify(body);
  return doFetch<T>(url, { method: 'POST', headers, body: payload }, init);
}

export function putJSON<T = unknown, B = Json>(
  url: string,
  body?: B,
  init?: ApiInit
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(init?.headers || {}),
  };
  const payload = body === undefined ? undefined : JSON.stringify(body);
  return doFetch<T>(url, { method: 'PUT', headers, body: payload }, init);
}

export function del<T = unknown>(url: string, init?: ApiInit): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(init?.headers || {}),
  };
  return doFetch<T>(url, { method: 'DELETE', headers }, init);
}

/* Domain-specific helpers */

export async function signupNewsletter(
  payload: NewsletterRequest,
  init?: ApiInit
): Promise<NewsletterResponse> {
  return postJSON<NewsletterResponse, NewsletterRequest>('/api/newsletter', payload, init);
}

export async function createOrder(
  payload: OrderRequest,
  init?: ApiInit
): Promise<OrderResponse> {
  return postJSON<OrderResponse, OrderRequest>('/api/order', payload, init);
}

/* Type guards */

export function isHttpError(e: unknown): e is HttpError {
  return e instanceof HttpError;
}