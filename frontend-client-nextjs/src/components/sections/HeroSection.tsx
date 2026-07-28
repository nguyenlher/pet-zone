'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { MagneticButton } from '../ui/MagneticButton';
import { ArrowUpRight, Star } from 'lucide-react';

// Dynamic import with SSR false for R3F Canvas
const PetModelViewer = dynamic(
  () => import('../3d/PetModelViewer').then((mod) => mod.PetModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] sm:h-[520px] lg:h-[600px] bg-neutral-100 animate-pulse flex items-center justify-center text-neutral-400">
        <span className="text-xs font-semibold uppercase tracking-wider">Đang khởi tạo không gian 3D...</span>
      </div>
    ),
  }
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Editorial Text Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-6 space-y-6 sm:space-y-8"
        >
          {/* Tag & Editorial Headline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 border border-neutral-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-600 bg-neutral-50">
              Bộ sưu tập 2026 / 3D Lookbook
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-black leading-[1.06] uppercase">
              TẤT CẢ CHO <br />
              CHO <br />
              NGƯỜI BẠN NHỎ
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-neutral-600 text-sm sm:text-base max-w-lg leading-relaxed font-normal">
            Khám phá thức ăn, phụ kiện và sản phẩm chăm sóc được tuyển chọn cho những người bạn bốn chân.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/category/all"
              className="px-7 py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <span>Khám Phá Sản Phẩm</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/studio-3d"
              className="px-7 py-3.5 border border-neutral-300 hover:border-black bg-white text-black font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <span>3D Studio</span>
            </Link>
          </div>

          {/* Minimal 3-column stats */}
          <div className="pt-6 grid grid-cols-3 gap-6 border-t border-neutral-200 max-w-lg">
            <div>
              <div className="text-2xl font-black text-black tracking-tight">150K+</div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Khách hàng</div>
            </div>
            <div>
              <div className="text-2xl font-black text-black tracking-tight">100%</div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Kiểm định</div>
            </div>
            <div>
              <div className="text-2xl font-black text-black tracking-tight">3D</div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Tương tác thực</div>
            </div>
          </div>
        </motion.div>

        {/* Right 3D Interactive Model Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-6 relative"
        >
          <PetModelViewer />
        </motion.div>
      </div>
    </section>
  );
};
