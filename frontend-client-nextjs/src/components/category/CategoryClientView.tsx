'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product, Category, PaginatedResult } from '@/types';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ArrowUpDown,
  PackageOpen,
  Loader2,
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
  { id: 'under-300', label: 'Dưới 300.000đ' },
  { id: '300-600', label: '300.000đ - 600.000đ' },
  { id: 'above-600', label: 'Trên 600.000đ' },
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Nổi bật nhất' },
  { id: 'price-asc', label: 'Giá: Thấp đến Cao' },
  { id: 'price-desc', label: 'Giá: Cao đến Thấp' },
  { id: 'rating', label: 'Đánh giá cao nhất' },
];

interface CategoryClientViewProps {
  currentSlug: string;
  categoriesList: Category[];
  paginatedData: PaginatedResult<Product>;
  currentPage: number;
  currentSearch: string;
  currentPriceRange: string;
  currentSort: string;
  currentInStock: boolean;
}

export const CategoryClientView: React.FC<CategoryClientViewProps> = ({
  currentSlug,
  categoriesList,
  paginatedData,
  currentPage,
  currentSearch,
  currentPriceRange,
  currentSort,
  currentInStock,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const productsSectionRef = useRef<HTMLDivElement>(null);

  // Local state for search input to allow smooth typing before debounce
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Sync search input if URL changes externally
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  // Navigate with updated query parameters
  const updateUrl = (updates: {
    page?: number;
    q?: string;
    price?: string;
    sort?: string;
    stock?: boolean;
  }) => {
    const params = new URLSearchParams();

    const newPage = updates.page !== undefined ? updates.page : 1;
    if (newPage > 1) {
      params.set('page', newPage.toString());
    }

    const newQ = updates.q !== undefined ? updates.q : currentSearch;
    if (newQ && newQ.trim()) {
      params.set('q', newQ.trim());
    }

    const newPrice = updates.price !== undefined ? updates.price : currentPriceRange;
    if (newPrice && newPrice !== 'all') {
      params.set('price', newPrice);
    }

    const newSort = updates.sort !== undefined ? updates.sort : currentSort;
    if (newSort && newSort !== 'default') {
      params.set('sort', newSort);
    }

    const newStock = updates.stock !== undefined ? updates.stock : currentInStock;
    if (newStock) {
      params.set('stock', 'true');
    }

    const queryString = params.toString();
    const targetUrl = `/category/${currentSlug}${queryString ? `?${queryString}` : ''}`;

    startTransition(() => {
      router.push(targetUrl, { scroll: false });
    });
  };

  // Debounce search input (400ms) - resets page to 1
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() !== currentSearch.trim()) {
        updateUrl({ q: searchTerm, page: 1 });
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
    // Smoothly scroll directly to the top of the products toolbar, avoiding hardcoded pixel values
    productsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handlePriceChange = (priceId: string) => {
    updateUrl({ price: priceId, page: 1 });
  };

  const handleSortChange = (sortId: string) => {
    updateUrl({ sort: sortId, page: 1 });
  };

  const handleStockToggle = () => {
    updateUrl({ stock: !currentInStock, page: 1 });
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    startTransition(() => {
      router.push(`/category/${currentSlug}`, { scroll: false });
    });
  };

  const hasActiveFilters =
    currentSearch !== '' ||
    currentPriceRange !== 'all' ||
    currentInStock ||
    currentSort !== 'default';

  // Category Info
  const currentCategoryInfo = (() => {
    if (currentSlug === 'all') {
      return {
        name: 'Tất Cả Sản Phẩm',
        description:
          'Khám phá trọn bộ các dòng sản phẩm tuyển chọn cao cấp: thức ăn dinh dưỡng, bát gốm công thái học và phụ kiện thông minh cho thú cưng.',
      };
    }
    const found = categoriesList.find((c) => c.slug === currentSlug);
    return (
      found || {
        name: 'Sản Phẩm',
        description: 'Các sản phẩm chất lượng chuẩn an toàn dành cho boss yêu.',
      }
    );
  })();

  const totalPages = Math.max(1, paginatedData.totalPages);
  const totalItems = paginatedData.totalElements;

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
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/category/all" className="hover:text-black transition-colors">
            Cửa Hàng
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">
            {currentCategoryInfo.name}
          </span>
        </nav>

        {/* Title Banner */}
        <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6 sm:space-y-8">
          <div className="max-w-3xl space-y-2.5">
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

          {/* Quick Category Switcher Tabs - Dòng riêng bên dưới */}
          <div className="pt-5 border-t border-stone-200/70 flex items-center flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const active = currentSlug === tab.slug;
              return (
                <Link
                  key={tab.slug}
                  href={`/category/${tab.slug}`}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    active
                      ? 'bg-black text-white shadow-md'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 shadow-sm'
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
      <section
        ref={productsSectionRef}
        className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-24"
      >
        {/* Controls Toolbar: Search, Filters, Sorters */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input with Debounce */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, đặc điểm, thương hiệu..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all placeholder:text-stone-400"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  updateUrl({ q: '', page: 1 });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Price Range Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 text-xs">
              <span className="text-stone-500 font-medium">Giá:</span>
              <select
                value={currentPriceRange}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* In-Stock Toggle */}
            <button
              onClick={handleStockToggle}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                currentInStock
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
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Xóa bộ lọc
              </button>
            )}

            {/* Server Transit Loading Indicator */}
            {isPending && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-stone-500 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
                <span>Đang tải...</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {paginatedData.items.length === 0 ? (
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
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Khôi phục tất cả bộ lọc
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-200 ${
              isPending ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {paginatedData.items.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isPending}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
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
              disabled={currentPage >= totalPages || isPending}
              className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Trang tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};
