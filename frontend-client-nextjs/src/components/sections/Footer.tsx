'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-neutral-600 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-200">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-3">
          <Link href="/" className="inline-block select-none">
            <span className="font-extrabold text-xl tracking-widest text-black uppercase">
              PET ZONE
            </span>
          </Link>

          <p className="text-neutral-500 text-xs max-w-sm leading-relaxed">
            Hệ sinh thái sản phẩm và phụ kiện thú cưng cao cấp theo chuẩn tối giản hiện đại. Tiêu chuẩn thiết kế tinh giản, vật liệu tuyển chọn và trải nghiệm trực quan 3D Studio.
          </p>
        </div>

        {/* Links 1: Danh Mục */}
        <div className="space-y-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-xs">Danh Mục</h4>
          <ul className="space-y-2 text-neutral-500">
            <li><Link href="/category/thu-cung" className="hover:text-black transition-colors">Thú cưng thuần chủng</Link></li>
            <li><Link href="/category/thuc-an" className="hover:text-black transition-colors">Thức ăn & Dinh dưỡng</Link></li>
            <li><Link href="/category/quan-ao" className="hover:text-black transition-colors">Quần áo & Thời trang</Link></li>
            <li><Link href="/category/nha-chuong" className="hover:text-black transition-colors">Nhà & Chuồng thú cưng</Link></li>
            <li><Link href="/category/phu-kien" className="hover:text-black transition-colors">Phụ kiện & Đồ dùng</Link></li>
          </ul>
        </div>

        {/* Links 2: Hỗ trợ khách hàng */}
        <div className="space-y-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-xs">Hỗ Trợ</h4>
          <ul className="space-y-2 text-neutral-500">
            <li><a href="#" className="hover:text-black transition-colors">Chính sách vận chuyển</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Chính sách đổi trả 30 ngày</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Hướng dẫn chọn kích cỡ</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Tư vấn dinh dưỡng thú cưng</a></li>
            <li><Link href="/order/lookup" className="hover:text-black transition-colors">Tra cứu đơn hàng</Link></li>
          </ul>
        </div>

        {/* Links 3: Về Pet Zone */}
        <div className="space-y-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-xs">Về Pet Zone</h4>
          <ul className="space-y-2 text-neutral-500">
            <li><a href="#" className="hover:text-black transition-colors">Câu chuyện thương hiệu</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Tiêu chuẩn kiểm định</a></li>
            <li><Link href="/studio-3d" className="hover:text-black transition-colors">3D Studio Experience</Link></li>
            <li><a href="#" className="hover:text-black transition-colors">Hệ thống phân phối</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Liên hệ hợp tác</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <p className="tracking-wider uppercase">
          © {new Date().getFullYear()} PET ZONE. All Rights Reserved.
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-black hover:text-neutral-600 font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <span>Về đầu trang</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
