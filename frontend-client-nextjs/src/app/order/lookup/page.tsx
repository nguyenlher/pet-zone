import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Package, ShieldCheck, Headphones, RotateCcw, ChevronRight, User } from 'lucide-react';
import OrderLookupForm from '@/components/order/OrderLookupForm';

export const metadata: Metadata = {
  title: 'Tra cứu đơn hàng | Pet Zone 3D',
  description: 'Theo dõi hành trình xử lý và vận chuyển đơn hàng nhanh chóng bằng Mã đơn hàng và Số điện thoại nhận hàng tại Pet Zone 3D.',
};

export default function OrderLookupPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-stone-900 pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-80 right-1/4 w-80 h-80 bg-[#D4F442]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900">Tra cứu đơn hàng</span>
        </div>

        {/* Hero title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            TRA CỨU ĐƠN HÀNG
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Dành cho khách hàng chưa đăng nhập. Nhập mã đơn và số điện thoại nhận hàng để kiểm tra tiến trình chuẩn bị và vận chuyển.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-7 sm:p-9 relative">
          <OrderLookupForm />
        </div>

        {/* Help and Support Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {/* Account link */}
          <Link
            href="/account/orders"
            className="p-4 rounded-2xl bg-white/70 border border-stone-200/70 hover:bg-white hover:border-stone-300 transition-all shadow-sm flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-colors flex items-center justify-center text-stone-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-900">Đã có tài khoản?</span>
              <span className="text-[11px] text-stone-400">Xem toàn bộ lịch sử đơn</span>
            </div>
          </Link>

          {/* Hotline */}
          <div className="p-4 rounded-2xl bg-white/70 border border-stone-200/70 shadow-sm flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-900">Hotline hỗ trợ</span>
              <span className="text-[11px] text-stone-600 font-semibold">1900 6868 (8h-21h)</span>
            </div>
          </div>

          {/* Policy */}
          <div className="p-4 rounded-2xl bg-white/70 border border-stone-200/70 shadow-sm flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-900">Chính sách đổi trả</span>
              <span className="text-[11px] text-stone-400">Miễn phí 7 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
