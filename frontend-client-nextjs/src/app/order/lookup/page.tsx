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
    <main className="min-h-screen bg-white text-black pt-24 md:pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-black transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-bold">Tra cứu đơn hàng</span>
        </div>

        {/* Hero title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black uppercase tracking-tight mb-2">
            Tra Cứu Đơn Hàng
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Dành cho khách hàng chưa đăng nhập. Nhập mã đơn và số điện thoại nhận hàng để kiểm tra tiến trình chuẩn bị và vận chuyển.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-none border border-neutral-200 p-6 sm:p-8 relative">
          <OrderLookupForm />
        </div>

        {/* Help and Support Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {/* Account link */}
          <Link
            href="/account/orders"
            className="p-4 rounded-none bg-white border border-neutral-200 hover:border-black transition-colors flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-none border border-neutral-200 bg-neutral-50 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-black">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-black">Đã có tài khoản?</span>
              <span className="text-[11px] text-neutral-400">Xem lịch sử đơn</span>
            </div>
          </Link>

          {/* Hotline */}
          <div className="p-4 rounded-none bg-white border border-neutral-200 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-none border border-neutral-200 bg-neutral-50 flex items-center justify-center text-black">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-black">Hotline hỗ trợ</span>
              <span className="text-[11px] text-neutral-600 font-semibold font-mono">1900 6868</span>
            </div>
          </div>

          {/* Policy */}
          <div className="p-4 rounded-none bg-white border border-neutral-200 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-none border border-neutral-200 bg-neutral-50 flex items-center justify-center text-black">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-black">Chính sách</span>
              <span className="text-[11px] text-neutral-400">Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
