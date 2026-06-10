'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../../data/mockData';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CategoriesSection: React.FC = () => {
  return (
    <section id="categories" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
            Danh Mục Chọn Lọc
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900">
            Tất cả những gì <br className="hidden sm:block" />
            boss cưng cần.
          </h2>
        </div>
        <p className="text-stone-500 text-sm sm:text-base max-w-md">
          Các nhóm sản phẩm được phân loại khoa học, tuyển chọn nghiêm ngặt từ nguồn gốc nguyên liệu đến độ an toàn sinh học.
        </p>
      </div>

      {/* Grid: 3 columns per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, index) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="block group h-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border border-stone-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full ${cat.bgColor}`}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-xs font-semibold text-stone-800 border border-stone-200/50 shadow-sm">
                  {cat.count}
                </span>
                <div className="w-10 h-10 rounded-full bg-white/80 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Middle Image Preview Container */}
              <div className="my-6 relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden shadow-inner bg-stone-200/40">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Bottom Info */}
              <div className="z-10 mt-auto">
                <h3 className="text-xl font-bold text-stone-900 group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};
