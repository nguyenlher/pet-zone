'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Dog,
  Utensils,
  Shirt,
  Home,
  Package,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMenu } from '../ui/UserMenu';
import { STORE_CATEGORIES } from '@/constants/categories';
import { fetchStorePetTypes } from '@/services/storeService';
import { PetType } from '@/types';

interface NavLinkItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: 'Trang Chủ', href: '/' },
  { name: 'Danh Mục', href: '/#categories', hasDropdown: true },
  { name: 'Liên Hệ', href: '/#contact' },
  { name: '3D Studio', href: '/studio-3d' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'thu-cung': <Dog className="w-3.5 h-3.5 text-neutral-500 group-hover/item:text-black transition-colors shrink-0" />,
  'thuc-an': <Utensils className="w-3.5 h-3.5 text-neutral-500 group-hover/item:text-black transition-colors shrink-0" />,
  'quan-ao': <Shirt className="w-3.5 h-3.5 text-neutral-500 group-hover/item:text-black transition-colors shrink-0" />,
  'nha-chuong': <Home className="w-3.5 h-3.5 text-neutral-500 group-hover/item:text-black transition-colors shrink-0" />,
  'phu-kien': <Package className="w-3.5 h-3.5 text-neutral-500 group-hover/item:text-black transition-colors shrink-0" />,
};

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [petSubmenuOpen, setPetSubmenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobilePetTypesOpen, setMobilePetTypesOpen] = useState(false);
  const [petTypes, setPetTypes] = useState<PetType[]>([
    { id: '04a6180f-2e90-45eb-a841-4e23d5613046', name: 'Chó', displayOrder: 1 },
    { id: '92052781-7a60-49d5-a079-6855295b5c21', name: 'Mèo', displayOrder: 2 },
    { id: 'f483ca59-5c35-445a-a5e6-38dfd6d48f89', name: 'Chim', displayOrder: 3 },
    { id: '60ae1eee-fcb0-4335-a1a9-fbdc041da1a0', name: 'Cá', displayOrder: 4 },
    { id: 'a0d9673c-eb11-4ca6-80eb-82f7c6084072', name: 'Hamster', displayOrder: 5 },
  ]);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const petSubmenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchStorePetTypes()
      .then((types) => {
        if (types && types.length > 0) {
          setPetTypes(types);
        }
      })
      .catch(() => {});

    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      if (petSubmenuTimeoutRef.current) clearTimeout(petSubmenuTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setCategoryDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCategoryDropdownOpen(false);
      setPetSubmenuOpen(false);
    }, 150);
  };

  const handlePetSubmenuEnter = () => {
    if (petSubmenuTimeoutRef.current) clearTimeout(petSubmenuTimeoutRef.current);
    setPetSubmenuOpen(true);
  };

  const handlePetSubmenuLeave = () => {
    petSubmenuTimeoutRef.current = setTimeout(() => {
      setPetSubmenuOpen(false);
    }, 150);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <span className="font-extrabold text-lg sm:text-xl tracking-widest text-black uppercase">
            PET ZONE
          </span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold border-l border-neutral-300 pl-2.5 hidden sm:inline">
            STUDIO
          </span>
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
                  className="text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-black transition-colors relative py-1 flex items-center gap-1 group"
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                      categoryDropdownOpen ? 'rotate-180 text-black' : 'group-hover:text-black'
                    }`}
                  />
                </Link>

                <AnimatePresence>
                  {categoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-0 pt-2 z-50 pointer-events-auto"
                    >
                      <div className="w-56 bg-white border border-neutral-200 shadow-xl p-1 space-y-0.5 rounded-none">
                        {STORE_CATEGORIES.map((cat) => {
                          const isPetCategory = cat.slug === 'thu-cung';
                          if (isPetCategory) {
                            return (
                              <div
                                key={cat.id}
                                className="relative"
                                onMouseEnter={handlePetSubmenuEnter}
                                onMouseLeave={handlePetSubmenuLeave}
                              >
                                <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors text-left rounded-none group/item cursor-pointer">
                                  <Link
                                    href={`/category/${cat.slug}`}
                                    onClick={() => {
                                      setCategoryDropdownOpen(false);
                                      setPetSubmenuOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 flex-1"
                                  >
                                    {CATEGORY_ICONS[cat.slug] || <Package className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                                    <span>{cat.name}</span>
                                  </Link>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 text-neutral-400 group-hover/item:text-black transition-transform duration-150 ${
                                      petSubmenuOpen ? 'translate-x-0.5 text-black' : ''
                                    }`}
                                  />
                                </div>

                                {/* Pet Types Submenu Flyout */}
                                <AnimatePresence>
                                  {petSubmenuOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, x: -6 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -6 }}
                                      transition={{ duration: 0.12, ease: 'easeOut' }}
                                      className="absolute top-0 left-full pl-1 z-50 pointer-events-auto"
                                    >
                                      <div className="w-48 bg-white border border-neutral-200 shadow-xl p-1 space-y-0.5 rounded-none">
                                        <Link
                                          href="/category/thu-cung"
                                          onClick={() => {
                                            setCategoryDropdownOpen(false);
                                            setPetSubmenuOpen(false);
                                          }}
                                          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-900 hover:text-black hover:bg-neutral-50 transition-colors text-left rounded-none border-b border-neutral-100"
                                        >
                                          <span>Tất cả thú cưng</span>
                                        </Link>
                                        {petTypes.map((pt) => (
                                          <Link
                                            key={pt.id}
                                            href={`/category/thu-cung?type=${pt.id}`}
                                            onClick={() => {
                                              setCategoryDropdownOpen(false);
                                              setPetSubmenuOpen(false);
                                            }}
                                            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors text-left rounded-none group/subitem"
                                          >
                                            <span>{pt.name}</span>
                                            <span className="text-[10px] text-neutral-400 group-hover/subitem:text-black font-mono">Xem</span>
                                          </Link>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.slug}`}
                              onClick={() => setCategoryDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors text-left rounded-none group/item"
                            >
                              {CATEGORY_ICONS[cat.slug] || <Package className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                              <span>{cat.name}</span>
                            </Link>
                          );
                        })}
                        <div className="border-t border-neutral-200 my-1" />
                        <Link
                          href="/category/all"
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-900 hover:text-black hover:bg-neutral-50 transition-colors text-left rounded-none group/item"
                        >
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
                className="text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-black transition-colors relative py-1 group"
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 border border-neutral-200 bg-white text-black hover:bg-neutral-50 transition-colors rounded-none cursor-pointer flex items-center justify-center"
            aria-label="Xem giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 bg-black text-white font-bold text-[10px] flex items-center justify-center rounded-none">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Section */}
          <UserMenu />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-neutral-200 text-neutral-800 hover:bg-neutral-50 md:hidden rounded-none cursor-pointer"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-neutral-200 bg-white px-6 py-5 overflow-hidden"
          >
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <div key={link.name} className="border-b border-neutral-100 pb-2">
                    <div className="flex items-center justify-between py-2">
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-black flex-1"
                      >
                        {link.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                        className="p-1 text-neutral-500 hover:text-black"
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
                      <div className="flex flex-col gap-1 pt-1 pb-2 pl-3 border-l border-neutral-200 ml-1">
                        {STORE_CATEGORIES.map((cat) => {
                          const isPetCategory = cat.slug === 'thu-cung';
                          if (isPetCategory) {
                            return (
                              <div key={cat.id} className="flex flex-col">
                                <div className="flex items-center justify-between py-1">
                                  <Link
                                    href={`/category/${cat.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-xs font-medium text-neutral-700 hover:text-black py-1 text-left flex-1"
                                  >
                                    {CATEGORY_ICONS[cat.slug] || <Package className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                                    <span>{cat.name}</span>
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => setMobilePetTypesOpen(!mobilePetTypesOpen)}
                                    className="p-1 text-neutral-400 hover:text-black"
                                    aria-label="Mở danh sách loại thú cưng"
                                  >
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        mobilePetTypesOpen ? 'rotate-180 text-black' : ''
                                      }`}
                                    />
                                  </button>
                                </div>

                                {mobilePetTypesOpen && (
                                  <div className="flex flex-col gap-1 pl-4 pb-1 border-l border-neutral-200 ml-2">
                                    <Link
                                      href="/category/thu-cung"
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="text-[11px] font-semibold text-neutral-900 hover:text-black py-1 text-left"
                                    >
                                      Tất cả thú cưng
                                    </Link>
                                    {petTypes.map((pt) => (
                                      <Link
                                        key={pt.id}
                                        href={`/category/thu-cung?type=${pt.id}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-[11px] font-medium text-neutral-500 hover:text-black py-1 text-left"
                                      >
                                        {pt.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-black py-1.5 text-left group"
                            >
                              {CATEGORY_ICONS[cat.slug] || <Package className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                              <span>{cat.name}</span>
                            </Link>
                          );
                        })}
                        <Link
                          href="/category/all"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 text-xs font-semibold text-black hover:underline py-1.5 text-left border-t border-neutral-100 mt-1"
                        >
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
                    className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-black py-2 border-b border-neutral-100"
                  >
                    {link.name}
                  </Link>
                )
              )}

              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-none hover:bg-neutral-800 transition-colors cursor-pointer"
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
