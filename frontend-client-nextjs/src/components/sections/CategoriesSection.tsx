'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { STORE_CATEGORIES } from '@/constants/categories';
import { fetchStoreCategories } from '@/services/storeService';
import { Category } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(STORE_CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    fetchStoreCategories().then((liveCategories) => {
      if (isMounted && liveCategories) {
        setCategories(liveCategories);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="categories" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1.5">
            Danh Mục
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black uppercase">
            Phân loại sản phẩm
          </h2>
        </div>
      </div>

      {/* Grid: 3 columns per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="block group h-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative rounded-none p-5 sm:p-6 flex flex-col justify-between overflow-hidden border border-neutral-200 bg-white hover:border-black transition-colors duration-200 h-full"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between z-10">
                <span className="px-2 py-0.5 border border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-50 rounded-none">
                  {cat.count}
                </span>
                <div className="w-8 h-8 rounded-none border border-neutral-200 bg-white group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Middle Image Preview Container */}
              <div className="my-5 relative w-full h-40 sm:h-44 rounded-none overflow-hidden bg-neutral-100 border border-neutral-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Bottom Info */}
              <div className="z-10 mt-auto">
                <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
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
