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
      <div className="w-full h-[460px] sm:h-[520px] lg:h-[600px] rounded-3xl bg-stone-100 animate-pulse flex items-center justify-center text-stone-400">
        <span className="text-sm font-medium">Đang khởi tạo không gian 3D...</span>
      </div>
    ),
  }
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Blur Rings */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#EBF3ED] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-[#FBF3D5] blur-3xl opacity-50 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Editorial Text Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 space-y-6 sm:space-y-8"
        >

          {/* Punchy Headline with Personality */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight text-stone-900 leading-[1.08]">
              Tất cả vì <br />
              <span className="relative inline-block">
                Boss
                {/* Minimal Accent Scribble Underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#D4F442] -z-10"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C50 3 150 2 197 8"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              . <br />
              Hạnh phúc cho Sen.
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-stone-600 text-base sm:text-lg max-w-lg leading-relaxed font-normal">
            Điểm hẹn mua sắm thú cưng đáng tin cậy với ngàn sản phẩm tuyển chọn, giống pet thuần chủng và trải nghiệm quan sát 3D chân thực.
          </p>

          {/* CTAs with Magnetic Effect */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/category/all">
              <MagneticButton
                className="px-8 py-4 rounded-full bg-black hover:bg-stone-800 text-white font-bold text-sm sm:text-base shadow-xl group transition-all"
              >
                <span>Khám Phá Sản Phẩm</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            </Link>
          </div>

          {/* Social Proof Mini Card */}
          <div className="pt-4 flex items-center gap-4 border-t border-stone-200/80">
            {/* Avatars */}
            <div className="flex -space-x-2.5 overflow-hidden">
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=100&auto=format&fit=crop&q=80"
                alt="Pet 1"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&auto=format&fit=crop&q=80"
                alt="Pet 2"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&auto=format&fit=crop&q=80"
                alt="Pet 3"
              />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1 text-stone-900 font-bold">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span>4.9 / 5.0</span>
              </div>
              <p className="text-stone-500 mt-0.5">
                Được tin chọn bởi <strong className="text-stone-900">150.000+</strong> chủ nuôi tại Việt Nam
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right 3D Interactive Model Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative"
        >
          <PetModelViewer />
        </motion.div>
      </div>
    </section>
  );
};
