'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Layers, Laptop } from 'lucide-react';

export const ShowroomSection: React.FC = () => {
  return (
    <section id="showroom" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-[#0A0D14] border border-stone-800 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4F442]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-semibold text-stone-300">
              <span>KHÔNG GIAN THỰC TẾ ẢO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Mô hình <span className="text-[#D4F442]">3D Studio</span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Trải nghiệm quan sát đa chiều với công nghệ Unity WebGL. Xoay 360 độ, quan sát thú cưng 3D từ mọi góc.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300">
                <Compass className="w-3.5 h-3.5 text-[#D4F442]" />
                Xoay 360° realtime
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300">
                <Layers className="w-3.5 h-3.5 text-[#D4F442]" />
                Model tỉ lệ chuẩn
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300">
                <Laptop className="w-3.5 h-3.5 text-[#D4F442]" />
                Unity WebGL tối ưu
              </span>
            </div>

            <div className="pt-4">
              <Link
                href="/studio-3d"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D4F442] hover:bg-[#c2e434] text-black font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-[#D4F442]/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Khám Phá 3D Studio Ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Teaser Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-stone-800/60 to-stone-900/80 border border-stone-700/60 p-6 sm:p-8 backdrop-blur shadow-inner">
              <div className="flex items-center justify-between pb-4 border-b border-stone-700/50 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono text-stone-400">Unity WebGL 0.1.0</span>
              </div>

              <div className="aspect-video w-full rounded-xl bg-black/60 border border-stone-800 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-stone-700 transition-colors">
                <p className="text-xs font-bold text-white mb-1">Quan sát cửa hàng 3D</p>
                <p className="text-[11px] text-stone-400">Nhấn nút bên trái để bắt đầu phiên tương tác</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-stone-400">
                <span>Chế độ: Standalone</span>
                <span className="text-[#D4F442] font-semibold">Sẵn sàng trải nghiệm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
