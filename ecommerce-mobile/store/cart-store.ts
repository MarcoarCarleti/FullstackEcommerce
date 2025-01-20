import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set) => ({
      items: [],

      addProduct: (product: any) =>
        set((state) => ({
          items: [...state.items, { product, quantity: 1 }],
        })),

      resetCart: () => set({ items: [] }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
