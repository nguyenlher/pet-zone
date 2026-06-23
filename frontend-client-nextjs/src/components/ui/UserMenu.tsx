'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  LogOut,
  Settings,
  ShoppingBag,
  Heart,
  KeyRound,
  UserPlus,
  LogIn,
  ChevronDown,
  ShieldCheck,
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
    if ((session as any)?.error === 'RefreshAccessTokenError') {
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
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 transition-colors shadow-sm cursor-pointer"
          aria-label="Menu tài khoản"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="w-7 h-7 rounded-full object-cover border border-stone-200"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-stone-900 text-[#D4F442] flex items-center justify-center text-xs font-bold uppercase">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
          )}
          <span className="text-xs font-bold text-stone-800 hidden sm:inline max-w-[100px] truncate">
            {user.name || 'Chủ nuôi'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-stone-500 transition-transform hidden sm:inline ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : (
        // Unauthenticated User Button
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-stone-200/90 bg-white/90 hover:bg-white text-stone-800 hover:text-black transition-all shadow-sm cursor-pointer"
          aria-label="Tài khoản & Đăng nhập"
        >
          <User className="w-4 h-4" />
          <span className="text-xs font-bold hidden sm:inline">Tài Khoản</span>
          <ChevronDown
            className={`w-3 h-3 text-stone-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-stone-200/90 shadow-2xl p-2 z-50 overflow-hidden text-stone-700"
          >
            {status === 'authenticated' && user ? (
              // Authenticated Dropdown Menu
              <div className="space-y-1">
                {/* User Header */}
                <div className="p-3 bg-stone-50 rounded-2xl mb-1 border border-stone-100">
                  <div className="flex items-center gap-2.5">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-black text-[#D4F442] flex items-center justify-center font-bold text-sm">
                        {user.name ? user.name.charAt(0) : 'P'}
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-stone-900 text-sm truncate">
                        {user.name || 'Chủ nuôi Pet Zone'}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Thành viên Pet Zone
                    </span>
                  </div>
                </div>

                <Link
                  href="/account/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-500" />
                  <span>Đơn hàng của tôi</span>
                </Link>

                <Link
                  href="/category/all"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <Heart className="w-4 h-4 text-stone-500" />
                  <span>Danh sách yêu thích</span>
                </Link>

                <div className="border-t border-stone-100 my-1" />

                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              // Unauthenticated Dropdown Menu
              <div className="space-y-1">
                <div className="p-3 bg-[#FAF9F5] rounded-2xl mb-1 text-center border border-stone-100">
                  <p className="text-xs font-extrabold text-stone-900">
                    Xin chào Sen!
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Đăng nhập để theo dõi đơn hàng và nhận ưu đãi tích điểm.
                  </p>
                </div>

                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-stone-800 transition-colors shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-[#D4F442]" />
                  <span>Đăng Nhập</span>
                </Link>

                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-100 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-stone-500" />
                  <span>Đăng Ký</span>
                </Link>

                <div className="border-t border-stone-100 my-1" />

                <Link
                  href="/order/lookup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-400" />
                  <span>Tra cứu đơn hàng (khách)</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
