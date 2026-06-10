'use client';

import React, { useState, useMemo, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';
import { Product } from '@/types';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ArrowUpDown,
  Filter,
  PackageOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_TABS = [
  { slug: 'all', name: 'Tất Cả' },
  { slug: 'thu-cung', name: 'Thú Cưng' },
  { slug: 'thuc-an', name: 'Thức Ăn' },
  { slug: 'quan-ao', name: 'Quần Áo' },
  { slug: 'nha-chuong', name: 'Nhà / Chuồng' },
  { slug: 'phu-kien', name: 'Phụ Kiện' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-300', label: 'Dưới 300.000đ', max: 300000 },
  { id: '300-600', label: '300.000đ - 600.000đ', min: 300000, max: 600000 },
  { id: 'above-600', label: 'Trên 600.000đ', min: 600000 },
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Nổi bật nhất' },
  { id: 'price-asc', label: 'Giá: Thấp đến Cao' },
  { id: 'price-desc', label: 'Giá: Cao đến Thấp' },
  { id: 'rating', label: 'Đánh giá cao nhất' },
];

const ITEMS_PER_PAGE = 8;

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const currentSlug = unwrappedParams.slug || 'all';

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentSlug, searchTerm, selectedPriceRange, organicOnly, inStockOnly, sortBy]);

  // Current category info
  const currentCategoryInfo = useMemo(() => {
    if (currentSlug === 'all') {
      return {
        name: 'Tất Cả Sản Phẩm',
        description:
          'Khám phá trọn bộ các dòng sản phẩm tuyển cho thú cưng.',
      };
    }
    const found = CATEGORIES.find((c) => c.slug === currentSlug);
    return (
      found || {
        name: 'Sản Phẩm',
        description: 'Các sản phẩm chất lượng chuẩn an toàn sinh học dành cho boss yêu.',
      }
    );
  }, [currentSlug]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Filter by category slug
    if (currentSlug !== 'all') {
      result = result.filter((p) => p.categorySlug === currentSlug);
    }

    // 2. Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 3. Price range
    if (selectedPriceRange !== 'all') {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (range) {
        if (range.min !== undefined && range.max !== undefined) {
          result = result.filter((p) => p.price >= range.min! && p.price <= range.max!);
        } else if (range.max !== undefined) {
          result = result.filter((p) => p.price < range.max);
        } else if (range.min !== undefined) {
          result = result.filter((p) => p.price > range.min);
        }
      }
    }

    // 4. Organic filter
    if (organicOnly) {
      result = result.filter((p) => p.isOrganic);
    }

    // 5. In-stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // 6. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [currentSlug, searchTerm, selectedPriceRange, organicOnly, inStockOnly, sortBy]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedPriceRange !== 'all' ||
    organicOnly ||
    inStockOnly ||
    sortBy !== 'default';

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedPriceRange('all');
    setOrganicOnly(false);
    setInStockOnly(false);
    setSortBy('default');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#121316]">
      <Navbar />

      {/* Header & Breadcrumb */}
      <section className="pt-28 sm:pt-36 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
          <Link href="/" className="hover:text-black transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link href="/category/all" className="hover:text-black transition-colors">
            Danh Mục
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="font-semibold text-stone-900">
            {currentCategoryInfo.name}
          </span>
        </nav>

        {/* Title Banner */}
        <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6 sm:space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-bold tracking-wide">
              <Sparkles className="w-3 h-3 text-[#D4F442]" />
              {totalItems} Sản phẩm
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900">
              {currentCategoryInfo.name}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {currentCategoryInfo.description}
            </p>
          </div>

          {/* Quick Category Switcher Tabs - Dedicated row independent of description length */}
          <div className="pt-6 border-t border-stone-200/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2 hidden sm:inline-block">
              Danh mục:
            </span>
            {CATEGORY_TABS.map((tab) => {
              const active = currentSlug === tab.slug;
              return (
                <Link
                  key={tab.slug}
                  href={`/category/${tab.slug}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-black text-white shadow-md'
                      : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-black border border-stone-200'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Filter & Products Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên sản phẩm, công dụng..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-black cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 text-xs">
              <span className="text-stone-500">Giá:</span>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Organic Toggle */}
            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                organicOnly
                  ? 'bg-[#D4F442] text-black border-[#c1e032] shadow-sm'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>100% Organic</span>
            </button>

            {/* In-Stock Toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                inStockOnly
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>Còn Hàng</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All Button */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 underline cursor-pointer"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
          <span>
            Hiển thị <strong className="text-stone-900">{paginatedProducts.length}</strong> trên{' '}
            <strong className="text-stone-900">{totalItems}</strong> sản phẩm
          </span>
          <span>
            Trang <strong className="text-stone-900">{currentPage}</strong> / {totalPages}
          </span>
        </div>

        {/* Product Grid or Empty State */}
        {paginatedProducts.length === 0 ? (
          <div className="rounded-3xl bg-white border border-stone-200 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <PackageOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Không có sản phẩm nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn.
              </p>
            </div>
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Khôi phục tất cả bộ lọc
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-full border border-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-stone-50 text-stone-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>

            {/* Page Number Pills */}
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-black text-white shadow-md scale-105'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-full border border-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-stone-50 text-stone-700"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
