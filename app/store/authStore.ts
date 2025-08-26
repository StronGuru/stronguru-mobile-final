import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { login } from "../services/authService";
import { useUserDataStore } from "./userDataStore";

interface AuthState {
  token: string | null;
  error: string | null;
  deviceId: string | null;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  setAuthData: (data: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState>()(
  //MEMO: non serve salvare i dati nell'asyncstorage, perche il metodo persist li salva automaticamente
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      error: null,
      deviceId: null,

      setAuthData: (data) => set((state) => ({ ...state, ...data })),

      loginUser: async (email, password) => {
        set({
          token: null,
          isAuthenticated: false,
          error: null,
          deviceId: null
        });

        try {
          const resp = await login({ email, password });

          if (resp.accessToken) {
            set({
              token: resp.accessToken,
              isAuthenticated: true,
              deviceId: resp.deviceId,
              error: null
            });

            useUserDataStore.getState().setUser({
              id: resp.user?.id || "",
              email: resp.user?.email || ""
            });

            console.log("token", resp.accessToken);
            console.log("deviceId", resp.deviceId);
            console.log("userId", resp.user?.id);
          }
        } catch (error: any) {
          let errorMessage = "Unknown error";

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          set({ error: errorMessage, token: null, isAuthenticated: false });
        }
      },

      logoutUser: async () => {
        set({ isAuthenticated: false, error: null, token: null, deviceId: null });

        // Rimuovi i dati da AsyncStorage
        await AsyncStorage.removeItem("auth_token");
        await AsyncStorage.removeItem("device_id");
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
