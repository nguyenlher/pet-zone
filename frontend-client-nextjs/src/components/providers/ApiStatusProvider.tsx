'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ApiStatusContextType {
  isFallbackActive: boolean;
  fallbackUrl: string | null;
  triggerFallback: (url: string, error?: unknown) => void;
  resetFallback: () => void;
  retryConnection: () => Promise<boolean>;
}

const ApiStatusContext = createContext<ApiStatusContextType>({
  isFallbackActive: false,
  fallbackUrl: null,
  triggerFallback: () => {},
  resetFallback: () => {},
  retryConnection: async () => false,
});

export const ApiStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const triggerFallback = useCallback((url: string, error?: unknown) => {
    console.warn(
      `%c[apiClient] Backend unreachable tại ${url}, đang kích hoạt dữ liệu fallback`,
      'color: #f59e0b; font-weight: bold;',
      error
    );
    setIsFallbackActive(true);
    setFallbackUrl(url);
  }, []);

  const resetFallback = useCallback(() => {
    setIsFallbackActive(false);
    setFallbackUrl(null);
  }, []);

  const retryConnection = useCallback(async () => {
    try {
      const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8090';
      const res = await fetch(`${gatewayUrl}/api/public/products?size=1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        resetFallback();
        // Reload current page to refresh live data
        window.location.reload();
        return true;
      }
    } catch (err) {
      console.warn('[apiClient] Thử lại kết nối API Gateway thất bại:', err);
    }
    return false;
  }, [resetFallback]);

  return (
    <ApiStatusContext.Provider
      value={{
        isFallbackActive,
        fallbackUrl,
        triggerFallback,
        resetFallback,
        retryConnection,
      }}
    >
      {children}
    </ApiStatusContext.Provider>
  );
};

export const useApiStatus = () => useContext(ApiStatusContext);

// Standalone trigger for use outside of React components (e.g. within apiClient.ts)
let globalTriggerFallback: ((url: string, error?: unknown) => void) | null = null;

export const setGlobalTriggerFallback = (fn: (url: string, error?: unknown) => void) => {
  globalTriggerFallback = fn;
};

export const notifyFallback = (url: string, error?: unknown) => {
  if (globalTriggerFallback) {
    globalTriggerFallback(url, error);
  } else {
    console.warn(
      `%c[apiClient] Backend unreachable tại ${url}, đang dùng dữ liệu fallback`,
      'color: #f59e0b; font-weight: bold;',
      error
    );
  }
};
