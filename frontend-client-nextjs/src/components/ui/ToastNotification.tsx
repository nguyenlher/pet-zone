'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, setToastMessage, setIsCartOpen } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700/60 flex items-center gap-3 backdrop-blur-md max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[#D4F442] text-black flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>

            <div className="flex-1 text-xs">
              <p className="font-semibold text-stone-100">{toastMessage}</p>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-[#D4F442] transition-colors cursor-pointer shrink-0"
            >
              Mở giỏ
            </button>

            <button
              onClick={() => setToastMessage(null)}
              className="text-stone-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
