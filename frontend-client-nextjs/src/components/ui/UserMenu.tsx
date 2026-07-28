'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  LogOut,
  ShoppingBag,
  Heart,
  UserPlus,
  LogIn,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UserMenu: React.FC = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If session expired or refresh failed, silently clean up session cookie
  useEffect(() => {
    if ((session as { error?: string } | null)?.error === 'RefreshAccessTokenError') {
      signOut({ redirect: false });
    }
  }, [session]);

  const user = session?.user;

  return (
    <div className="relative" ref={menuRef}>
      {status === 'authenticated' && user ? (
        // Authenticated User Avatar Button
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-black text-xs font-semibold rounded-none transition-colors cursor-pointer"
          aria-label="Menu tài khoản"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="w-5 h-5 rounded-none object-cover border border-neutral-200"
            />
          ) : (
            <div className="w-5 h-5 bg-black text-white flex items-center justify-center text-[10px] font-bold uppercase rounded-none">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
          )}
          <span className="text-xs font-semibold text-black hidden sm:inline max-w-[100px] truncate">
            {user.name || 'Tài khoản'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-500 transition-transform hidden sm:inline ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : (
        // Unauthenticated User Button
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-black text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer"
          aria-label="Tài khoản & Đăng nhập"
        >
          <User className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Tài Khoản</span>
          <ChevronDown
            className={`w-3 h-3 text-neutral-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-1 w-60 bg-white border border-neutral-200 shadow-xl p-0 z-50 rounded-none text-neutral-800"
          >
            {status === 'authenticated' && user ? (
              // Authenticated Dropdown Menu
              <div>
                {/* User Header */}
                <div className="p-3.5 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2.5">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Avatar"
                      className="w-8 h-8 rounded-none object-cover border border-neutral-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs rounded-none">
                      {user.name ? user.name.charAt(0) : 'P'}
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-black text-xs truncate">
                      {user.name || 'Thành viên'}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/account/orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Đơn hàng của tôi</span>
                  </Link>

                  <Link
                    href="/category/all"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Danh sách yêu thích</span>
                  </Link>
                </div>

                <div className="border-t border-neutral-100 py-1">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            ) : (
              // Unauthenticated Dropdown Menu
              <div className="p-3.5 space-y-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-none"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng Nhập</span>
                </Link>

                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-neutral-200 text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors rounded-none"
                >
                  <UserPlus className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Đăng Ký</span>
                </Link>

                <div className="border-t border-neutral-100 pt-2 mt-2">
                  <Link
                    href="/order/lookup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-1 py-1.5 text-xs font-medium text-neutral-500 hover:text-black transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Tra cứu đơn hàng (khách)</span>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
