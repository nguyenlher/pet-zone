'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Layers, Laptop } from 'lucide-react';

export const ShowroomSection: React.FC = () => {
  return (
    <section id="showroom" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200">
      <div className="relative rounded-none overflow-hidden bg-black text-white p-8 sm:p-12 lg:p-14 border border-black">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <span>3D Interactive Canvas</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
              3D Studio Experience
            </h2>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Trải nghiệm quan sát đa chiều với công nghệ Unity WebGL. Xoay 360 độ, quan sát trực quan vật liệu và tỷ lệ thực của thú cưng từ mọi góc độ.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-300">
                <Compass className="w-3.5 h-3.5 text-white" />
                Xoay 360° Realtime
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-300">
                <Layers className="w-3.5 h-3.5 text-white" />
                Tỷ lệ mô phỏng chuẩn
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-300">
                <Laptop className="w-3.5 h-3.5 text-white" />
                Unity WebGL
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/studio-3d"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer"
              >
                <span>Khám Phá 3D Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Teaser Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-none bg-neutral-950 border border-neutral-800 p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-5 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                <span>Viewport Controller</span>
                <span>WebGL 0.1.0</span>
              </div>

              <div className="aspect-video w-full rounded-none bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-white mb-1">Không gian mô hình 3D</p>
                <p className="text-[11px] text-neutral-500">Tương tác trực tiếp trên trình duyệt</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-500">
                <span>Chế độ: Standalone</span>
                <span className="text-white font-bold">Sẵn sàng trải nghiệm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
