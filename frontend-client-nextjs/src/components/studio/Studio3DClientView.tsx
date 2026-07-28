'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import {
  Maximize2,
  Minimize2,
  RotateCw,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  Compass,
  Eye,
  Layers,
  MousePointerClick,
  X,
  Play,
  RefreshCw,
  Clock,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Laptop,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Studio3DClientView: React.FC = () => {
  // Mobile detection via matchMedia
  const [isMobile, setIsMobile] = useState(false);
  const [dismissMobileWarning, setDismissMobileWarning] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Fullscreen state and synchronization
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const target = containerRef.current;
    if (!target) return;

    if (!document.fullscreenElement && !(document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement) {
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if ((target as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
        (target as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as unknown as { webkitExitFullscreen?: () => void }).webkitExitFullscreen) {
        (target as unknown as { webkitExitFullscreen: () => void }).webkitExitFullscreen();
      }
    }
  };

  // Reload iframe
  const [reloadKey, setReloadKey] = useState(0);
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 500);

    try {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.location.reload();
        return;
      }
    } catch {
      // Fallback if cross-origin or contentWindow is not accessible
    }
    setReloadKey((prev) => prev + 1);
  };

  // Launcher & Build detection state
  const [isStarted, setIsStarted] = useState(false);
  const [isCheckingBuild, setIsCheckingBuild] = useState(false);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'available' | 'missing'>('idle');
  const [showControlsModal, setShowControlsModal] = useState(false);

  // Check whether Unity build files exist
  const verifyUnityBuildFiles = async (): Promise<boolean> => {
    setIsCheckingBuild(true);
    try {
      const res = await fetch('/unity_build/Build/Downloads.loader.js', { method: 'HEAD' });
      const isOk = res.ok && res.status === 200;
      setBuildStatus(isOk ? 'available' : 'missing');
      setIsCheckingBuild(false);
      return isOk;
    } catch {
      setBuildStatus('missing');
      setIsCheckingBuild(false);
      return false;
    }
  };

  const handleStartExperience = async () => {
    await verifyUnityBuildFiles();
    setIsStarted(true);
  };

  const handleRecheckBuild = async () => {
    const isReady = await verifyUnityBuildFiles();
    if (isReady) {
      setReloadKey((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black flex flex-col selection:bg-black selection:text-white">
      <Navbar />

      {/* Header & Breadcrumbs */}
      <section className="pt-24 sm:pt-28 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-4 uppercase tracking-wider" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-black transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-bold">3D Studio</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-black uppercase">
              3D Studio
            </h1>
            <p className="mt-2 text-neutral-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Môi trường 3D tương tác sử dụng đồ họa Unity WebGL. Nhấn nút bên dưới để khởi động studio và bắt đầu trải nghiệm trực quan.
            </p>
          </div>
        </div>

        {/* Mobile Advisory Banner (Non-blocking) */}
        {isMobile && !dismissMobileWarning && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-6 p-4 rounded-none bg-neutral-50 border border-neutral-200 flex items-start justify-between gap-3 text-neutral-800 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-black uppercase tracking-wider">Lưu ý thiết bị di động</p>
                <p className="text-neutral-600 mt-0.5 leading-relaxed">
                  Trải nghiệm không gian 3D đạt chất lượng đồ họa và góc nhìn tốt nhất trên máy tính hoặc laptop.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissMobileWarning(true)}
              className="p-1 rounded-none text-neutral-500 hover:text-black transition-colors shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </section>

      {/* Main Studio Viewport Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16 flex-1">
        {/* Fullscreen Container Wrapper */}
        <div
          ref={containerRef}
          className={`relative rounded-none overflow-hidden bg-black border border-neutral-800 shadow-2xl transition-all duration-300 flex flex-col ${
            isFullscreen
              ? 'w-full h-full rounded-none border-none'
              : 'min-h-[580px] h-[75vh] max-h-[850px]'
          }`}
        >
          {/* Studio Top Control Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-neutral-950 border-b border-neutral-800 z-20 text-white text-xs">
            {/* Left: Studio Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 ${
                    buildStatus === 'available'
                      ? 'bg-white'
                      : buildStatus === 'missing'
                      ? 'bg-neutral-500'
                      : 'bg-neutral-600'
                  }`}
                />
                <span className="font-mono text-[10px] font-bold tracking-widest text-neutral-300 uppercase">
                  {buildStatus === 'available'
                    ? 'UNITY WEBGL ACTIVE'
                    : buildStatus === 'missing'
                    ? 'UNDER MAINTENANCE'
                    : 'STANDBY MODE'}
                </span>
              </div>
              <span className="hidden sm:inline-block text-neutral-700">|</span>
              <span className="hidden sm:inline-block text-neutral-500 text-[10px] font-mono">
                WebGL 0.1.0
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowControlsModal((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                title="Hướng dẫn điều khiển"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Hướng dẫn</span>
              </button>

              {isStarted && buildStatus === 'available' && (
                <button
                  onClick={handleReload}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px] font-bold uppercase tracking-wider ${
                    isReloading ? 'opacity-50' : ''
                  }`}
                  title="Tải lại phòng 3D"
                  aria-label="Tải lại mô hình"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">Tải lại</span>
                </button>
              )}

              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Mở toàn màn hình'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-white" />
                    <span>Thu nhỏ</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Toàn màn hình</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Controls Guide Dropdown Overlay */}
          <AnimatePresence>
            {showControlsModal && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-4 sm:right-6 z-30 max-w-sm w-full bg-neutral-950 border border-neutral-800 rounded-none p-4 shadow-2xl text-white text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    Hướng Dẫn Điều Khiển 3D
                  </span>
                  <button
                    onClick={() => setShowControlsModal(false)}
                    className="p-1 rounded-none text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 space-y-3 text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <MousePointerClick className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white text-xs uppercase tracking-wider">Xoay camera 360°</p>
                      <p className="text-[11px] text-neutral-400">Rê chuột xung quanh mô hình để thay đổi góc nhìn</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white text-xs uppercase tracking-wider">Di chuyển</p>
                      <p className="text-[11px] text-neutral-400">Sử dụng cụm phím W-A-S-D để di chuyển không gian</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Viewport Area */}
          <div className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center">
            {!isStarted ? (
              /* Initial Launcher Screen */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                  <button
                    onClick={handleStartExperience}
                    disabled={isCheckingBuild}
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-none cursor-pointer disabled:opacity-50"
                  >
                    {isCheckingBuild ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-black text-black" />
                    )}
                    <span>{isCheckingBuild ? 'Đang Khởi Chạy...' : 'Bắt đầu trải nghiệm'}</span>
                  </button>

                  <p className="text-[10px] uppercase tracking-wider text-neutral-500 mt-4 font-mono">
                    Unity WebGL Engine • Tự động kích hoạt
                  </p>
                </div>
              </div>
            ) : buildStatus === 'missing' ? (
              /* Maintenance Screen */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
                <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center py-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mb-2">
                    Hệ thống đang bảo trì
                  </h3>

                  <p className="text-neutral-400 text-xs leading-relaxed mb-6 max-w-md">
                    Không gian 3D Studio đang trong lịch trình cập nhật mô hình mới. Tính năng sẽ mở lại trong thời gian sớm nhất.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
                    <Link
                      href="/category/all"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-none cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-black" />
                      <span>Khám Phá Cửa Hàng</span>
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center justify-center text-xs text-neutral-500">
                    <button
                      onClick={handleRecheckBuild}
                      disabled={isCheckingBuild}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer disabled:opacity-50 text-xs font-mono"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCheckingBuild ? 'animate-spin' : ''}`} />
                      <span>{isCheckingBuild ? 'Đang kiểm tra...' : 'Thử lại'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Embedded Unity WebGL Iframe */
              <iframe
                key={reloadKey}
                ref={iframeRef}
                src="/unity_build/index.html"
                title="Pet 3D Studio"
                className="w-full h-full border-0 block"
                allowFullScreen
                allow="autoplay; fullscreen *; xr-spatial-tracking"
              />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};
