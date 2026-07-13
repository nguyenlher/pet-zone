'use client';

import React, { useState, useEffect } from 'react';
import { useApiStatus, setGlobalTriggerFallback } from '../providers/ApiStatusProvider';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export const FallbackBanner: React.FC = () => {
  const { isFallbackActive, fallbackUrl, triggerFallback, retryConnection } = useApiStatus();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Bind global trigger so apiClient can notify outside React tree
  useEffect(() => {
    setGlobalTriggerFallback(triggerFallback);
  }, [triggerFallback]);

  // If in production or not active or dismissed, don't show
  if (process.env.NODE_ENV === 'production' || !isFallbackActive || isDismissed) {
    return null;
  }

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryConnection();
    setIsRetrying(false);
  };

  return (
    <div
      role="alert"
      className="relative z-50 bg-black text-white text-xs px-4 py-2 border-b border-neutral-800 flex items-center justify-between gap-3 transition-all"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto overflow-hidden">
        <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
        <span className="font-mono text-xs truncate">
          <strong className="font-bold uppercase tracking-wider">Fallback Mode:</strong> Không thể kết nối tới API Gateway. Đang sử dụng dữ liệu dự phòng.
        </span>
        {fallbackUrl && (
          <span className="hidden md:inline-block px-2 py-0.5 border border-neutral-700 bg-neutral-900 text-[10px] font-mono text-neutral-400 truncate">
            {fallbackUrl}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-neutral-700 hover:border-white bg-transparent text-white font-mono text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
          title="Kiểm tra kết nối lại tới API Gateway và tải lại trang"
        >
          <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Đang thử...' : 'Thử lại'}</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-none text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Tạm ẩn cảnh báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
