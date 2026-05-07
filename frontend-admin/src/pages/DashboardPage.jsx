// src/pages/DashboardPage.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import SalesTarget from '../components/SalesTarget';
import ProductCard from '../components/ProductCard';
import OffersPanel from '../components/OffersPanel';
import { useDashboardStats, useTopSellingPets } from '../hooks/useStatistics';

export default function DashboardPage() {
  const [productIndex, setProductIndex] = useState(0);
  const visibleCount = 4;

  // Fetch real data
  const { data: dashboardStats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: topPets, isLoading: isLoadingTopPets } = useTopSellingPets(10);

  const topProducts = topPets?.content || [];
  const statsData = dashboardStats?.stats || [];

  const canScrollLeft = productIndex > 0;
  const canScrollRight = productIndex < topProducts.length - visibleCount;

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <SalesChart />
        </div>
        <div className="lg:col-span-2">
          <SalesTarget />
        </div>
      </div>

      {/* Bottom Row: Top Products + Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Top Selling Products */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Top Selling Pets</h2>
            {topProducts.length > visibleCount && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setProductIndex((i) => Math.max(0, i - 1))}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                    canScrollLeft
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setProductIndex((i) => Math.min(topProducts.length - visibleCount, i + 1))}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                    canScrollRight
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {isLoadingTopPets ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading top pets...</div>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">No data available</div>
            </div>
          ) : (
            <>
              <div className="flex gap-3 overflow-hidden">
                {topProducts.slice(productIndex, productIndex + visibleCount).map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Dots */}
              {topProducts.length > visibleCount && (
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  {Array.from({ length: topProducts.length - visibleCount + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setProductIndex(i)}
                      className={`rounded-full transition-all duration-200 cursor-pointer ${
                        i === productIndex ? 'w-5 h-1.5 bg-emerald-500' : 'w-1.5 h-1.5 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Current Offers */}
        <div className="lg:col-span-2">
          <OffersPanel />
        </div>
      </div>
    </div>
  );
}
