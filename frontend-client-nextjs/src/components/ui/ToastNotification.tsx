'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, setToastMessage, setIsCartOpen } = useCart();

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto bg-black text-white px-5 py-4 rounded-none shadow-2xl border border-neutral-800 flex items-center gap-4 max-w-sm"
          >
            <div className="w-8 h-8 rounded-none bg-white text-black flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>

            <div className="flex-1 text-xs">
              <p className="font-medium text-white">{toastMessage}</p>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3 py-1.5 rounded-none border border-neutral-600 hover:border-white text-[10px] font-bold uppercase tracking-widest text-white transition-colors cursor-pointer shrink-0"
            >
              Mở giỏ
            </button>

            <button
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
