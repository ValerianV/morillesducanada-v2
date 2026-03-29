import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/lib/products';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedWeightGrams?: number;
  unitPrice: number;
}

interface AddItemOptions {
  selectedWeightGrams?: number;
  unitPriceOverride?: number;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number, options?: AddItemOptions) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (product, quantity = 1, options) => {
        const { items } = get();
        const itemId = options?.selectedWeightGrams
          ? `${product.id}-${options.selectedWeightGrams}`
          : product.id;
        const unitPrice = options?.unitPriceOverride ?? product.price;

        const existing = items.find((i) => i.id === itemId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: itemId,
                product,
                quantity,
                selectedWeightGrams: options?.selectedWeightGrams,
                unitPrice,
              },
            ],
          });
        }
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    {
      name: 'morilles-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
