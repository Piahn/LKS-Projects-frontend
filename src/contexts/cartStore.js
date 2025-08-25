import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // berfungsi untuk menyimpan produk di keranjang

      addItem: (product) => {
        const { items } = get();
        const itemExists = items.find((item) => item.id === product.id);

        if (itemExists) {
          // Jika produk sudah ada, tambah jumlahnya
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          toast.success(`${product.name} ditambahkan ke keranjang!`);
        } else {
          // Jika produk baru, tambahkan ke keranjang dengan jumlah 1
          set({
            items: [...items, { ...product, quantity: 1 }],
          });
          toast.success(`${product.name} berhasil ditambahkan ke keranjang!`);
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
        toast.error("Item dihapus dari keranjang.");
      },

      updateQuantity: (productId, quantity) => {
        const newQuantity = Math.max(1, quantity); // Pastikan jumlah tidak kurang dari 1
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
