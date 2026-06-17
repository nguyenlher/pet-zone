'use client';

import React, { useState, useEffect } from 'react';
import { fetchStoreProducts } from '@/services/storeService';
import { Product } from '@/types';
import { ProductCard } from '../ui/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const FILTER_TABS = [
  { id: 'all', label: 'Tất Cả Sản Phẩm' },
  { id: 'thu-cung', label: 'Thú Cưng' },
  { id: 'thuc-an', label: 'Thức Ăn' },
  { id: 'quan-ao', label: 'Quần Áo' },
  { id: 'nha-chuong', label: 'Nhà / Chuồng' },
  { id: 'phu-kien', label: 'Phụ Kiện' },
];

export const FeaturedProductsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchStoreProducts('all')
      .then((liveProducts) => {
        if (isMounted && liveProducts) {
          setAllProducts(liveProducts);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts =
    activeTab === 'all'
      ? allProducts
      : allProducts.filter((p) => p.categorySlug === activeTab);

  return (
    <section id="products" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
            Tuyển Tập Nổi Bật
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900">
            Thiết kế vì sức khỏe <br className="hidden sm:block" />
            và niềm vui của Boss.
          </h2>
        </div>

        {/* Animated Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-stone-100/90 border border-stone-200/80 w-fit">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer select-none ${
                  isActive ? 'text-white' : 'text-stone-600 hover:text-black'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute inset-0 rounded-full bg-black shadow-md -z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Grid with Animated Layout / Loading Skeletons */}
      {loading && allProducts.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-stone-200/80 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-square bg-stone-100 rounded-2xl" />
              <div className="h-4 bg-stone-100 rounded w-3/4" />
              <div className="h-4 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};
