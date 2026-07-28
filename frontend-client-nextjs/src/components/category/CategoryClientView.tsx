'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { StoreItem, Category, PaginatedResult, PetType } from '@/types';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowUpDown,
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
  paginatedData: PaginatedResult<StoreItem>;
  currentPage: number;
  currentSearch: string;
  currentPriceRange: string;
  currentSort: string;
  currentInStock: boolean;
  currentPetType?: string;
  petTypes?: PetType[];
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
  currentPetType = 'all',
  petTypes = [],
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
    type?: string;
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

    const newType = updates.type !== undefined ? updates.type : currentPetType;
    if (currentSlug === 'thu-cung' && newType && newType !== 'all') {
      params.set('type', newType);
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

  const handlePetTypeChange = (typeId: string) => {
    updateUrl({ type: typeId, page: 1 });
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
    currentSort !== 'default' ||
    (currentSlug === 'thu-cung' && currentPetType !== 'all');

  // Dynamic Pet Type Tabs directly from DB (pet_types.name)
  const dynamicPetTabs = [
    { id: 'all', name: 'Tất Cả' },
    ...(petTypes || []).map((pt) => ({
      id: pt.id,
      name: pt.name,
    })),
  ];

  const isPetTabActive = (tabId: string, tabName: string) => {
    if (tabId === 'all') {
      return !currentPetType || currentPetType === 'all';
    }
    const cur = currentPetType.toLowerCase();
    return (
      currentPetType === tabId ||
      tabName.toLowerCase() === cur ||
      (cur === 'cho' && tabName.toLowerCase().includes('chó')) ||
      (cur === 'meo' && tabName.toLowerCase().includes('mèo'))
    );
  };

  // Category Info
  const currentCategoryInfo = (() => {
    if (currentSlug === 'all') {
      return {
        name: 'Tất Cả Sản Phẩm',
        description:
          'Khám phá toàn bộ cửa hàng',
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
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      {/* Header & Breadcrumb */}
      <section className="pt-24 sm:pt-28 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-4 uppercase tracking-wider">
          <Link href="/" className="hover:text-black transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/category/all" className="hover:text-black transition-colors">
            Cửa Hàng
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-black">
            {currentCategoryInfo.name}
          </span>
        </nav>

        {/* Title Banner */}
        <div className="bg-neutral-50 rounded-none p-6 sm:p-10 border border-neutral-200 space-y-6">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-neutral-200 bg-white text-black text-[10px] font-bold tracking-widest uppercase">
              <span>{totalItems} Sản phẩm</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black uppercase">
              {currentCategoryInfo.name}
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {currentCategoryInfo.description}
            </p>
          </div>

          {/* Quick Category Switcher Tabs */}
          <div className="pt-4 border-t border-neutral-200 flex items-center flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const active = currentSlug === tab.slug;
              return (
                <Link
                  key={tab.slug}
                  href={`/category/${tab.slug}`}
                  className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-colors border ${
                    active
                      ? 'bg-black text-white border-black'
                      : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>

          {/* Pet Types Switcher (Only for THÚ CƯNG) */}
          {currentSlug === 'thu-cung' && (
            <div className="pt-3 border-t border-neutral-200 flex items-center flex-wrap gap-2">
              {dynamicPetTabs.map((pt) => {
                const active = isPetTabActive(pt.id, pt.name);
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => handlePetTypeChange(pt.id)}
                    className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                      active
                        ? 'bg-black text-white border-black'
                        : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {pt.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Main Filter & Products Section */}
      <section
        ref={productsSectionRef}
        className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 scroll-mt-24"
      >
        {/* Controls Toolbar: Search, Filters, Sorters */}
        <div className="bg-white rounded-none p-3.5 border border-neutral-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input with Debounce */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-9 py-2 bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  updateUrl({ q: '', page: 1 });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Price Range Filter */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-2 border border-neutral-200 text-xs rounded-none">
              <span className="text-neutral-500 font-medium">Giá:</span>
              <select
                value={currentPriceRange}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="bg-transparent font-bold text-black focus:outline-none cursor-pointer text-xs"
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
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border rounded-none ${
                currentInStock
                  ? 'bg-black text-white border-black'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <span>Còn Hàng</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-2 border border-neutral-200 text-xs rounded-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent font-bold text-black focus:outline-none cursor-pointer text-xs"
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
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-black border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors flex items-center gap-1 cursor-pointer rounded-none"
              >
                <X className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>
            )}

            {/* Server Transit Loading Indicator */}
            {isPending && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Đang tải...</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {paginatedData.items.length === 0 ? (
          <div className="bg-white border border-neutral-200 p-12 text-center flex flex-col items-center justify-center space-y-4 rounded-none">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Không có sản phẩm nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer rounded-none"
              >
                Khôi phục bộ lọc
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-1.5">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="w-9 h-9 rounded-none border border-neutral-200 bg-white flex items-center justify-center text-black hover:bg-neutral-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
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
                    className={`w-9 h-9 rounded-none text-xs font-bold transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black hover:bg-neutral-50 border-neutral-200'
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
              className="w-9 h-9 rounded-none border border-neutral-200 bg-white flex items-center justify-center text-black hover:bg-neutral-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
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
