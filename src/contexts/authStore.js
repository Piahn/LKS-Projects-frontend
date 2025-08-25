import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        // untuk decode token, untuk mendapatkan infomasi user
        set({ token });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // Nama Ket di localStorages
    }
  )
);

export default useAuthStore;
