'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
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
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-black" />
                <h2 className="font-bold text-black text-sm uppercase tracking-wider">Giỏ Hàng</h2>
                <span className="text-[10px] px-2 py-0.5 border border-neutral-200 bg-neutral-50 font-bold text-black">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-none border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-xs">
              <div className="flex items-center gap-2 text-neutral-600 font-medium mb-1.5">
                <Truck className="w-3.5 h-3.5 text-black shrink-0" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Mua thêm <strong className="text-black">{formattedRemaining}</strong> để được miễn phí vận chuyển.
                  </span>
                ) : (
                  <span className="text-black font-bold">
                    Đủ điều kiện Miễn Phí Vận Chuyển.
                  </span>
                )}
              </div>
              <div className="w-full h-1 bg-neutral-200 rounded-none overflow-hidden">
                <div
                  className="h-full bg-black rounded-none transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-12 h-12 rounded-none border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-black text-xs uppercase tracking-wider">Giỏ hàng đang trống</h3>
                    <p className="text-xs text-neutral-500 max-w-xs">
                      Khám phá bộ sưu tập sản phẩm và thêm vào giỏ.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-none cursor-pointer"
                  >
                    Khám phá sản phẩm
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor || 'default'}`}
                    className="flex gap-3.5 p-3 rounded-none bg-white border border-neutral-200"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-18 h-18 rounded-none object-cover bg-neutral-100 shrink-0 border border-neutral-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Title & Price on the Right */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-black text-xs uppercase tracking-wide line-clamp-1">
                            {item.product.name}
                          </h4>
                          {item.selectedColor && (
                            <span className="text-[10px] text-neutral-500 block uppercase mt-0.5">
                              Màu: {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-black">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        {Boolean(
                          item.product.isPet ||
                          item.product.categorySlug === 'thu-cung' ||
                          item.product.category?.toLowerCase().includes('thú cưng')
                        ) ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-neutral-200 rounded-none bg-neutral-50">
                              <button
                                disabled
                                className="p-1 text-neutral-300 cursor-not-allowed opacity-30"
                                title="Số lượng tối thiểu là 1"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-black font-mono">
                                1
                              </span>
                              <button
                                disabled
                                className="p-1 text-neutral-300 cursor-not-allowed opacity-30"
                                title="Thú cưng chỉ có một cá thể duy nhất"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center border border-neutral-200 rounded-none bg-white">
                            <button
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className={`p-1 transition-colors ${
                                item.quantity <= 1
                                  ? 'text-neutral-300 cursor-not-allowed opacity-30'
                                  : 'text-neutral-500 hover:text-black cursor-pointer'
                              }`}
                              title={item.quantity <= 1 ? 'Số lượng tối thiểu là 1' : 'Giảm số lượng'}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-black font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                              title="Tăng số lượng"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Xoá sản phẩm khỏi giỏ"
                          aria-label="Xoá sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Subtotal / Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-neutral-200 bg-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider">Tạm tính:</span>
                  <span className="font-extrabold text-base text-black">{formattedSubtotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-none cursor-pointer"
                >
                  <span>Tiến Hành Đặt Hàng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
