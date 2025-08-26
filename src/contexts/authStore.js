import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        try {
          const decodeUser = jwtDecode(token);
          set({ token, user: decodeUser });
        } catch (error) {
          set({ token: null, user: null });
        }
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // Nama Ket di localStorages
    }
  )
);

export default useAuthStore;
