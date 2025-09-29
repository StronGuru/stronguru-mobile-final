import { UserType } from "@/lib/zod/userSchemas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getUserById, patchUser } from "../services/userService";

interface UserDataState {
  user: UserType | null;
  isHydrated: boolean;
  // Store operations (sync)
  setUser: (data: UserType) => void;
  clearUser: () => void;
  // API operations (async)
  fetchUserData: (userId: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserType>) => Promise<void>;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set, get) => ({
      user: null,
      isHydrated: false,

      setUser: (data) => {
        console.log("🔵 UserDataStore - setUser:", `${data.firstName} ${data.lastName}`);
        set({ user: data });
      },

      fetchUserData: async (userId: string) => {
        console.log("🔄 Fetching user data per ID:", userId);

        try {
          const userData = await getUserById(userId);
          set({ user: userData /* , loading: false, error: null  */ });
          console.log("✅ User data caricati", userData);
        } catch (error: any) {
          console.error("❌ Errore caricamento user data:", error.message);
          throw error;
        }
      },

      updateUserProfile: async (data: Partial<UserType>) => {
        const currentUser = get().user;
        if (!currentUser?._id) {
          throw new Error("Nessun utente trovato");
        }

        console.log("🔄 updateUserProfile - Starting PATCH for user:", currentUser._id);
        console.log("📝 Data to patch:", data);

        try {
          // 1. PATCH al database
          await patchUser(currentUser._id, data);

          const freshUserData = await getUserById(currentUser._id);
          set({ user: freshUserData });
        } catch (error: any) {
          console.error("❌ Errore aggiornamento profilo:", error.message);
          throw error;
        }
      },

      clearUser: () => set({ user: null })
    }),
    {
      name: "user-data-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      }
    }
  )
);
