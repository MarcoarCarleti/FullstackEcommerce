import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set) => ({
      items: [],

      addProduct: (product) =>
        set((state) => {
          // Verifica se o produto já está no carrinho
          const existingProductIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingProductIndex >= 0) {
            // Atualiza a quantidade do produto existente
            const updatedItems = state.items.map((item, index) =>
              index === existingProductIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return { items: updatedItems };
          }

          // Adiciona o novo produto ao carrinho
          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        }),
      removeProduct: (productId: number) =>
        set((state) => {
          const existingProductIndex = state.items.findIndex(
            (item) => item.product.id === productId
          );

          if (existingProductIndex >= 0) {
            const updatedItems = state.items.reduce((acc, item, index) => {
              if (index === existingProductIndex) {
                // Diminui a quantidade ou remove se for 1
                if (item.quantity > 1) {
                  acc.push({ ...item, quantity: item.quantity - 1 });
                }
              } else {
                acc.push(item);
              }
              return acc;
            }, []);

            return { items: updatedItems };
          }

          return state; // Retorna o estado inalterado se o produto não existir
        }),

      resetCart: () => set({ items: [] }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
