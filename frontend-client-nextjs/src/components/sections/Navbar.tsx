'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Dog,
  Utensils,
  Shirt,
  Home,
  Package,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMenu } from '../ui/UserMenu';
import { STORE_CATEGORIES } from '@/constants/categories';

interface NavLinkItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: 'Trang Chủ', href: '/' },
  { name: 'Sản Phẩm', href: '/category/all' },
  { name: 'Danh Mục', href: '/#categories', hasDropdown: true },
  { name: 'Liên Hệ', href: '/#contact' },
  { name: '3D Studio', href: '/studio-3d' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'thu-cung': <Dog className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-stone-900 transition-colors shrink-0" />,
  'thuc-an': <Utensils className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-stone-900 transition-colors shrink-0" />,
  'quan-ao': <Shirt className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-stone-900 transition-colors shrink-0" />,
  'nha-chuong': <Home className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-stone-900 transition-colors shrink-0" />,
  'phu-kien': <Package className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-stone-900 transition-colors shrink-0" />,
};

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setCategoryDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCategoryDropdownOpen(false);
    }, 150);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-full transition-all duration-300 px-5 sm:px-7 py-3.5 flex items-center justify-between border ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md border-stone-200/90 shadow-md'
            : 'bg-white/60 backdrop-blur-sm border-stone-200/50 shadow-sm'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white transition-transform group-hover:scale-105 group-hover:rotate-6">
            <svg
              className="w-5 h-5 text-[#D4F442] fill-current"
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
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 leading-none">
              Pet Zone<span className="text-[#FF5E3A]">.</span>
            </span>
            <span className="text-[10px] font-semibold text-stone-400 tracking-wider uppercase mt-0.5">
              Pet Store & 3D
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.name}
                className="relative py-1"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.href}
                  className="text-sm font-semibold text-stone-700 hover:text-black transition-colors relative py-1 flex items-center gap-1.5 group"
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                      categoryDropdownOpen ? 'rotate-180 text-black' : 'group-hover:text-black'
                    }`}
                  />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>

                <AnimatePresence>
                  {categoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-auto"
                    >
                      <div className="w-52 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-xl p-1.5 space-y-0.5">
                        {STORE_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={() => setCategoryDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-black hover:bg-stone-100 transition-colors text-left group/item"
                          >
                            {CATEGORY_ICONS[cat.slug] || <Package className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
                            <span>{cat.name}</span>
                          </Link>
                        ))}
                        <div className="border-t border-stone-100 my-1" />
                        <Link
                          href="/category/all"
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-black hover:bg-stone-100 transition-colors text-left group/item"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-amber-500 transition-colors shrink-0" />
                          <span>Tất cả sản phẩm</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-stone-700 hover:text-black transition-colors relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            )
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-black text-white hover:bg-stone-800 transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
            aria-label="Xem giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4F442] text-black font-extrabold text-[11px] flex items-center justify-center shadow-md animate-bounce">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Section */}
          <UserMenu />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-full hover:bg-stone-100 text-stone-700 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-2 p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-stone-200 shadow-2xl max-w-sm mx-auto"
          >
            <nav className="flex flex-col gap-3 text-center">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <div key={link.name} className="border-b border-stone-100 pb-2">
                    <div className="flex items-center justify-between py-2">
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-bold text-stone-800 hover:text-black text-left flex-1"
                      >
                        {link.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500"
                        aria-label="Mở danh mục con"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileCategoryOpen ? 'rotate-180 text-black' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {mobileCategoryOpen && (
                      <div className="flex flex-col gap-1 pt-1 pb-2 pl-4">
                        {STORE_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-black py-1.5 text-left group"
                          >
                            {CATEGORY_ICONS[cat.slug] || <Package className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
                            <span>{cat.name}</span>
                          </Link>
                        ))}
                        <Link
                          href="/category/all"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 text-xs font-semibold text-stone-900 hover:text-black py-1.5 text-left border-t border-stone-100 mt-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                          <span>Tất cả sản phẩm</span>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold text-stone-800 hover:text-black py-2 border-b border-stone-100"
                  >
                    {link.name}
                  </Link>
                )
              )}

              <div className="pt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full py-3.5 rounded-full bg-black text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Giỏ Hàng ({totalItems})
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
