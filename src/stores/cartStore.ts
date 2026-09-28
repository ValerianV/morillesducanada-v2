import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { products, getVacuumMorelPrice, MAX_QUANTITY_PER_LINE, type Product } from '@/lib/products';

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

const clampQuantity = (quantity: number) =>
  Number.isFinite(quantity) ? Math.min(Math.max(Math.floor(quantity), 0), MAX_QUANTITY_PER_LINE) : 0;

// Le panier persisté garde une copie du produit : on la remplace par le catalogue courant
// (images à hash, prix) et on écarte les lignes devenues invalides.
export function refreshCartItems(stored: unknown): CartItem[] {
  if (!Array.isArray(stored)) return [];
  return stored.flatMap((raw): CartItem[] => {
    const item = raw as Partial<CartItem> | null;
    const product = products.find((p) => p.id === item?.product?.id);
    const quantity = clampQuantity(Number(item?.quantity));
    if (!item || !product || quantity < 1) return [];
    if (product.weightPriceIds) {
      const grams = Number(item.selectedWeightGrams);
      if (!product.weightPriceIds[grams]) return [];
      return [{ id: `${product.id}-${grams}`, product, quantity, selectedWeightGrams: grams, unitPrice: getVacuumMorelPrice(grams) }];
    }
    return [{ id: product.id, product, quantity, unitPrice: product.price }];
  });
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
              i.id === itemId ? { ...i, quantity: clampQuantity(i.quantity + quantity) } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: itemId,
                product,
                quantity: clampQuantity(quantity),
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
            i.id === itemId ? { ...i, quantity: clampQuantity(quantity) } : i
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
      merge: (persisted, current) => ({
        ...current,
        items: refreshCartItems((persisted as { items?: unknown } | undefined)?.items),
      }),
    }
  )
);
