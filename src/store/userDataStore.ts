import { UserType } from "@/lib/zod/userSchemas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getUserById } from "../services/userService";

interface UserDataState {
  user: UserType | null;
  setUser: (data: UserType) => void;
  fetchUserData: (userId: string) => Promise<void>;
  clearUser: () => void;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (data) => {
        console.log("🔵 UserDataStore - setUser:", `${data.firstName} ${data.lastName}`);
        set({ user: data });
      },

      fetchUserData: async (userId: string) => {
        console.log("🔄 Fetching user data per ID:", userId);

        try {
          const userData = await getUserById(userId);
          set({ user: userData /* , loading: false, error: null  */ });
          console.log("✅ User data caricati");
        } catch (error: any) {
          console.error("❌ Errore caricamento user data:", error.message);
          throw error;
        }
      },

      clearUser: () => set({ user: null })
    }),
    {
      name: "user-data-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
