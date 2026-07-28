'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchTopSellingProducts } from '@/services/storeService';
import { Product } from '@/types';
import { ProductCard } from '../ui/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchTopSellingProducts(10)
      .then((products) => {
        if (isMounted && products) {
          const sliced = products.slice(0, 10);
          const ranked = sliced.map((p) => ({
            ...p,
            badge: `Đã bán ${p.soldCount ?? 0}`,
          }));
          setTopProducts(ranked);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement;
    const cardStep = firstCard ? firstCard.offsetWidth + 24 : 320;
    scrollRef.current.scrollTo({ left: index * cardStep, behavior: 'smooth' });
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (loading || topProducts.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % topProducts.length;
        if (scrollRef.current) {
          const firstCard = scrollRef.current.firstElementChild as HTMLElement;
          const cardStep = firstCard ? firstCard.offsetWidth + 24 : 320;
          scrollRef.current.scrollTo({ left: next * cardStep, behavior: 'smooth' });
        }
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [loading, topProducts.length, isPaused]);

  const checkScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement;
    if (firstCard) {
      const cardStep = firstCard.offsetWidth + 24; // width + gap
      const idx = Math.min(
        topProducts.length - 1,
        Math.max(0, Math.round(scrollLeft / cardStep))
      );
      setCurrentIndex(idx);
    }
  };

  const handleScrollPrev = () => {
    if (!scrollRef.current || topProducts.length === 0) return;
    const prev = (currentIndex - 1 + topProducts.length) % topProducts.length;
    scrollToIndex(prev);
  };

  const handleScrollNext = () => {
    if (!scrollRef.current || topProducts.length === 0) return;
    const next = (currentIndex + 1) % topProducts.length;
    scrollToIndex(next);
  };

  return (
    <section id="products" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200">
      {/* Title */}
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1.5">
          Nổi Bật
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black uppercase">
          Sản phẩm đề xuất
        </h2>
      </div>

      {/* Loading Skeletons */}
      {loading && topProducts.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-neutral-200 p-4 space-y-4 animate-pulse rounded-none"
            >
              <div className="aspect-square bg-neutral-100 rounded-none" />
              <div className="h-3 bg-neutral-200 rounded-none w-3/4" />
              <div className="h-3 bg-neutral-200 rounded-none w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        /* Slideshow Track */
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={scrollRef}
            onScroll={checkScrollState}
            className="flex items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {topProducts.length > 0 && (
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8">
              {/* Prev */}
              <button
                type="button"
                onClick={handleScrollPrev}
                className="w-8 h-8 flex items-center justify-center border border-neutral-200 bg-white text-black hover:bg-black hover:text-white transition-colors cursor-pointer select-none rounded-none shrink-0"
                title="Sản phẩm trước"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {topProducts.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToIndex(i)}
                    className={`h-1.5 transition-all duration-300 rounded-none cursor-pointer ${
                      i === currentIndex ? 'w-8 bg-black' : 'w-2 bg-neutral-200 hover:bg-neutral-400'
                    }`}
                    aria-label={`Đi tới sản phẩm ${i + 1}`}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                type="button"
                onClick={handleScrollNext}
                className="w-8 h-8 flex items-center justify-center border border-neutral-200 bg-white text-black hover:bg-black hover:text-white transition-colors cursor-pointer select-none rounded-none shrink-0"
                title="Sản phẩm tiếp theo"
                aria-label="Next product"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

