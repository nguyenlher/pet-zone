'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';

import { useRouter } from 'next/navigation';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    clearCart,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 500000;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const formattedSubtotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(subtotal);

  const formattedRemaining = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(remainingForFreeShipping);

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FAFAF8] shadow-2xl z-50 flex flex-col border-l border-stone-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-stone-900" />
                <h2 className="font-extrabold text-stone-900 text-lg">Giỏ Hàng Của Bạn</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 font-semibold text-stone-600">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="px-5 py-3 bg-stone-100/70 border-b border-stone-200 text-xs">
              <div className="flex items-center gap-2 text-stone-700 font-medium mb-1.5">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Mua thêm <strong className="text-stone-900">{formattedRemaining}</strong> để được{' '}
                    <strong className="text-emerald-700">Freeship</strong>!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">
                    Bạn đã đủ điều kiện nhận Miễn Phí Vận Chuyển!
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 text-base">Giỏ hàng đang trống</h3>
                    <p className="text-xs text-stone-500 max-w-xs">
                      Hãy chọn những món quà dinh dưỡng và phụ kiện chất lượng cho boss cưng nhé!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Khám phá sản phẩm
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor || 'default'}`}
                    className="flex gap-4 p-3 rounded-2xl bg-white border border-stone-200/80 shadow-sm"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm line-clamp-1">
                          {item.product.name}
                        </h4>
                        {item.selectedColor && (
                          <span className="text-[11px] text-stone-500 block">
                            Màu: {item.selectedColor}
                          </span>
                        )}
                        <span className="text-xs font-bold text-stone-900 mt-1 block">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.product.price)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 text-stone-600 hover:text-black cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 text-stone-600 hover:text-black cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Subtotal / Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-200 bg-white space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Tạm tính:</span>
                  <span className="font-extrabold text-lg text-stone-900">{formattedSubtotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-full bg-black hover:bg-stone-800 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <span>Tiến Hành Đặt Hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
