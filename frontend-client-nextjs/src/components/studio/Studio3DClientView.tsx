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
    <main className="min-h-screen bg-[#FAFAF8] text-[#121316] flex flex-col selection:bg-[#D4F442] selection:text-black">
      <Navbar />

      {/* Header & Breadcrumbs */}
      <section className="pt-28 sm:pt-36 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-black transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-semibold">3D Studio</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-900">
              3D Studio
            </h1>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Môi trường 3D tương tác sử dụng đồ họa Unity WebGL. Hãy nhấn nút bên dưới để khởi động studio và bắt đầu trải nghiệm.
            </p>
          </div>
        </div>

        {/* Mobile Advisory Banner (Non-blocking) */}
        {isMobile && !dismissMobileWarning && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start justify-between gap-3 text-amber-900 text-xs sm:text-sm"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">LƯU Ý TRÊN THIẾT BỊ DI ĐỘNG!</p>
                <p className="text-amber-800/90 mt-0.5 text-xs leading-relaxed">
                  Mô hình 3D yêu cầu nhiều tài nguyên. Để có trải nghiệm mượt mà và góc nhìn tốt nhất, hãy sử dụng máy tính hoặc laptop.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissMobileWarning(true)}
              className="p-1 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </section>

      {/* Main Studio Viewport Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16 flex-1">
        {/* Fullscreen Container Wrapper: holds both toolbar and viewport */}
        <div
          ref={containerRef}
          className={`relative rounded-3xl overflow-hidden bg-[#0A0D14] border border-stone-800/80 shadow-2xl transition-all duration-300 flex flex-col ${
            isFullscreen
              ? 'w-full h-full rounded-none border-none'
              : 'min-h-[580px] h-[75vh] max-h-[850px]'
          }`}
        >
          {/* Studio Top Control Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#111622]/95 backdrop-blur-md border-b border-stone-800/60 z-20 text-white text-xs">
            {/* Left: Studio Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      buildStatus === 'available'
                        ? 'bg-[#D4F442]'
                        : buildStatus === 'missing'
                        ? 'bg-amber-400'
                        : 'bg-stone-500'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      buildStatus === 'available'
                        ? 'bg-[#D4F442]'
                        : buildStatus === 'missing'
                        ? 'bg-amber-400'
                        : 'bg-stone-500'
                    }`}
                  />
                </span>
                <span className="font-mono text-[11px] font-semibold tracking-wide text-stone-300">
                  {buildStatus === 'available'
                    ? 'UNITY WEBGL ACTIVE'
                    : buildStatus === 'missing'
                    ? 'UNDER MAINTENANCE'
                    : 'STANDBY MODE'}
                </span>
              </div>
              <span className="hidden sm:inline-block text-stone-600">|</span>
              <span className="hidden sm:inline-block text-stone-400 text-[11px]">
                Unity WebGL 0.1.0
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowControlsModal((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700/80 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Hướng dẫn điều khiển"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Hướng dẫn</span>
              </button>

              {isStarted && buildStatus === 'available' && (
                <button
                  onClick={handleReload}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700/80 text-stone-300 hover:text-white transition-colors cursor-pointer ${
                    isReloading ? 'opacity-50' : ''
                  }`}
                  title="Tải lại phòng 3D"
                  aria-label="Tải lại mô hình"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline text-[11px]">Tải lại</span>
                </button>
              )}

              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700/80 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Mở toàn màn hình'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-[#D4F442]" />
                    <span className="text-[11px] font-medium">Thu nhỏ</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline text-[11px]">Toàn màn hình</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Controls Guide Dropdown Overlay */}
          <AnimatePresence>
            {showControlsModal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-4 sm:right-6 z-30 max-w-sm w-full bg-[#161B26]/95 backdrop-blur-xl border border-stone-700/70 rounded-2xl p-4 shadow-2xl text-white text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="font-bold text-stone-200 flex items-center gap-2">
                    Hướng Dẫn Điều Khiển 3D
                  </span>
                  <button
                    onClick={() => setShowControlsModal(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 space-y-2.5 text-stone-300">
                  <div className="flex items-start gap-2.5">
                    <MousePointerClick className="w-4 h-4 text-[#D4F442] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Xoay camera 360°</p>
                      <p className="text-[11px] text-stone-400">Di chuyển chuột xung quanh mô hình</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-[#D4F442]" />
                    <div>
                      <p className="font-semibold text-white">Di chuyển</p>
                      <p className="text-[11px] text-stone-400">Sử dụng phím WASD để di chuyển</p>
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
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-800/40 via-[#0A0D14]/90 to-[#0A0D14]" />

                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }}
                />

                <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                  <button
                    onClick={handleStartExperience}
                    disabled={isCheckingBuild}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D4F442] hover:bg-[#c2e434] text-black font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-[#D4F442]/20 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isCheckingBuild ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <Play className="w-4 h-4 fill-black text-black group-hover:translate-x-0.5 transition-transform" />
                    )}
                    <span>{isCheckingBuild ? 'Đang Khởi Chạy...' : 'Bắt đầu trải nghiệm'}</span>
                  </button>

                  <p className="text-[11px] text-stone-500 mt-4">
                    Tối ưu hóa thời gian tải • Unity WebGL Build tự động chạy
                  </p>
                </div>
              </div>
            ) : buildStatus === 'missing' ? (
              /* Maintenance / Hẹn Lần Sau Screen */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
                {/* Background Ambient Radial Glow */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-[#0A0D14]/90 to-[#0A0D14]" />

                <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center py-8">

                  {/* Heading */}
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                    Hệ thống bảo trì!
                  </h3>

                  {/* Friendly Message */}
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
                    3D Studio đang được bảo trì để điều chỉnh. Tính năng sẽ sớm mở lại trong thời gian tới. Cảm ơn sự quan tâm và kiên nhẫn của bạn!
                  </p>

                  {/* Primary Action Button */}
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
                    <Link
                      href="/category/all"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D4F442] hover:bg-[#c2e434] text-black font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-[#D4F442]/20 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-black" />
                      <span>Khám Phá Cửa Hàng</span>
                    </Link>
                  </div>

                  {/* Recheck Action */}
                  <div className="mt-6 flex items-center justify-center text-xs text-stone-400">
                    <button
                      onClick={handleRecheckBuild}
                      disabled={isCheckingBuild}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
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
