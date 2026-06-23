'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Product, CartItem } from '@/types';

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  restoreCart: (items: CartItem[]) => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  isHydrated?: boolean;
}

export const useCart = (): CartContextType => {
  const store = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During SSR or before client hydration finishes, provide safe defaults to avoid mismatch, then switch to hydrated cart
  const cart = isHydrated ? store.cart : [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return {
    cart,
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    restoreCart: store.restoreCart,
    totalItems,
    subtotal,
    isCartOpen: store.isCartOpen,
    setIsCartOpen: store.setIsCartOpen,
    quickViewProduct: store.quickViewProduct,
    setQuickViewProduct: store.setQuickViewProduct,
    toastMessage: store.toastMessage,
    setToastMessage: store.setToastMessage,
    isHydrated,
  };
};

/**
 * Pass-through CartProvider to ensure layout compatibility without breaking any wrappers
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
