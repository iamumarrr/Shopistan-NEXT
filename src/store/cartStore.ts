import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product === item.product);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product === item.product
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.product !== id) })),
      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product === id ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) } : i
          ),
        })),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);