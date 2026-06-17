'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

export interface CartStoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  quickViewProduct: Product | null;
  toastMessage: string | null;

  // Actions
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  restoreCart: (items: CartItem[]) => void;
  setIsCartOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setToastMessage: (msg: string | null) => void;
}

let toastTimer: NodeJS.Timeout | null = null;

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      quickViewProduct: null,
      toastMessage: null,

      addToCart: (product, quantity = 1, selectedColor) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.product.id === product.id && item.selectedColor === selectedColor
          );
          let nextCart: CartItem[];
          if (existingIndex > -1) {
            nextCart = [...state.cart];
            nextCart[existingIndex] = {
              ...nextCart[existingIndex],
              quantity: nextCart[existingIndex].quantity + quantity,
            };
          } else {
            nextCart = [...state.cart, { product, quantity, selectedColor }];
          }

          // Trigger toast with auto-clear
          if (toastTimer) clearTimeout(toastTimer);
          toastTimer = setTimeout(() => {
            set({ toastMessage: null });
          }, 3500);

          return {
            cart: nextCart,
            toastMessage: `Đã thêm "${product.name}" vào giỏ hàng thành công!`,
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, delta) => {
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      restoreCart: (items) => {
        if (Array.isArray(items)) {
          set({ cart: items });
        }
      },

      setIsCartOpen: (open) => set({ isCartOpen: open }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
      setToastMessage: (msg) => {
        if (toastTimer) clearTimeout(toastTimer);
        if (msg) {
          toastTimer = setTimeout(() => {
            set({ toastMessage: null });
          }, 3500);
        }
        set({ toastMessage: msg });
      },
    }),
    {
      name: 'pet-mart-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist the 'cart' array to localStorage, leaving runtime UI states in memory
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
