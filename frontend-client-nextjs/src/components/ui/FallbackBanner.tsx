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
      className="relative z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-xs px-4 py-2 shadow-md flex items-center justify-between gap-3 transition-all animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto overflow-hidden">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
        <span className="font-medium truncate">
          <strong className="font-bold">Chế độ Fallback:</strong> Không thể kết nối tới API Gateway (8090). Đang tạm thời hiển thị dữ liệu dự phòng để đảm bảo trải nghiệm.
        </span>
        {fallbackUrl && (
          <span className="hidden md:inline-block px-2 py-0.5 rounded bg-black/20 text-[10px] font-mono text-amber-100 truncate">
            {fallbackUrl}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 active:scale-95 text-white font-semibold transition-all disabled:opacity-50 cursor-pointer"
          title="Kiểm tra kết nối lại tới API Gateway và tải lại trang"
        >
          <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Đang thử...' : 'Thử lại'}</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Tạm ẩn cảnh báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
