'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200/80 bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-stone-600 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-100">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white">
              <svg
                className="w-4 h-4 text-[#D4F442] fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 11c-2.21 0-4 1.79-4 4 0 1.94 1.38 3.56 3.23 3.93.5.1 1.04.1 1.54 0 1.85-.37 3.23-1.99 3.23-3.93 0-2.21-1.79-4-4-4z" />
                <circle cx="7" cy="8.5" r="2" />
                <circle cx="17" cy="8.5" r="2" />
                <circle cx="10" cy="5.5" r="1.8" />
                <circle cx="14" cy="5.5" r="1.8" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-stone-900">
              Pet Zone<span className="text-[#FF5E3A]">.</span>
            </span>
          </Link>

          <p className="text-stone-500 text-xs sm:text-sm max-w-sm leading-relaxed">
            Hệ sinh thái thương mại điện tử phụ kiện & thực phẩm thú cưng cao cấp theo chuẩn tối giản hiện đại. Đồng hành chăm sóc các boss bằng tình yêu thương và sự chuẩn xác khoa học.
          </p>
        </div>

        {/* Links 1: Danh Mục */}
        <div className="space-y-3">
          <h4 className="font-bold text-stone-900 text-sm">Danh Mục</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/category/thu-cung" className="hover:text-black transition-colors">Thú cưng thuần chủng</Link></li>
            <li><Link href="/category/thuc-an" className="hover:text-black transition-colors">Thức ăn & Dinh dưỡng</Link></li>
            <li><Link href="/category/quan-ao" className="hover:text-black transition-colors">Quần áo & Thời trang</Link></li>
            <li><Link href="/category/nha-chuong" className="hover:text-black transition-colors">Nhà & Chuồng thú cưng</Link></li>
            <li><Link href="/category/phu-kien" className="hover:text-black transition-colors">Phụ kiện & Đồ dùng</Link></li>
          </ul>
        </div>

        {/* Links 2: Hỗ trợ khách hàng */}
        <div className="space-y-3">
          <h4 className="font-bold text-stone-900 text-sm">Hỗ Trợ Khách Hàng</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-black transition-colors">Chính sách vận chuyển hoả tốc</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Chính sách đổi trả 30 ngày</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Tư vấn chọn size vòng cổ & nệm</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Hỏi đáp Bác sĩ dinh dưỡng</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Theo dõi đơn hàng</a></li>
          </ul>
        </div>

        {/* Links 3: Về Pet Zone */}
        <div className="space-y-3">
          <h4 className="font-bold text-stone-900 text-sm">Về Pet Zone</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-black transition-colors">Câu chuyện thương hiệu</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Tiêu chuẩn kiểm định chất lượng</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Trải nghiệm 3D Showroom</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Hệ thống showroom đối tác</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Liên hệ hợp tác</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} Pet Zone Vietnam
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-stone-600 hover:text-black font-semibold transition-colors cursor-pointer"
        >
          <span>Về đầu trang</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
