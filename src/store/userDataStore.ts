import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role?: string;
}

interface UserDataState {
  user: User | null;
  setUser: (data: User) => void;
  clearUser: () => void;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (data) => set({ user: data }),

      clearUser: () => set({ user: null })
    }),
    {
      name: "user-data-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
