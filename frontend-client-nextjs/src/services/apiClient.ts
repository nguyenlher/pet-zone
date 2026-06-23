import { notifyFallback } from '../components/providers/ApiStatusProvider';

// Resolve Base URL for API Gateway (strictly port 8090)
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // In browser: use rewrite path /api/backend to avoid CORS, or direct gateway URL
    return '/api/backend';
  }
  // On server: directly call API Gateway container / localhost port 8090
  return (process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8090') + '/api';
};

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;
  const timeoutMs = options.timeoutMs || 6000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    // Notify fallback globally & log to browser console
    notifyFallback(fullUrl, error);
    throw error;
  }
}
