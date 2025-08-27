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
        console.log("loginUser chiamato nell'authStore"); // DEBUG

        set({
          token: null,
          isAuthenticated: false,
          error: null,
          deviceId: null
        });

        try {
          console.log("Chiamando API login..."); // DEBUG
          const resp = await login({ email, password });

          if (resp.accessToken) {
            console.log("Login riuscito, aggiornando stato"); // DEBUG
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
          } else {
            // IMPORTANTE: Se non c'è accessToken, considera come errore
            console.log("Login fallito - nessun accessToken"); // DEBUG
            const errorMsg = "Credenziali non valide";
            set({ error: errorMsg, token: null, isAuthenticated: false });
            throw new Error(errorMsg); // Lancia eccezione per essere catturata
          }
        } catch (error: any) {
          let errorMessage = "Si è verificato un errore durante il login";

          // Gestione error message specifici
          if (error.response?.status === 400) {
            if (error.response?.data?.message === "Invalid email or password.") {
              errorMessage = "Email o password non corretti";
            } else {
              errorMessage = "Dati mancanti o non validi";
            }
          } else if (error.response?.status === 422) {
            if (error.response?.data?.errors && error.response.data.errors.length > 0) {
              const firstError = error.response.data.errors[0].message;

              if (firstError.includes("Invalid email format")) {
                errorMessage = "Formato email non valido";
              } else {
                errorMessage = "Dati non validi";
              }
            } else {
              errorMessage = "Dati di input non validi";
            }
          } else if (error.response?.status === 401) {
            errorMessage = "Credenziali non valide o account non verificato";
          } else if (error.response?.status === 403) {
            errorMessage = "Accesso negato per questo tipo di dispositivo";
          } else if (error.response?.status === 500) {
            errorMessage = "Errore interno del server. Riprova più tardi";
          } else if (error.response?.status === 429) {
            errorMessage = "Troppi tentativi di login. Riprova tra qualche minuto";
          } else if (error.message === "Network Error" || !error.response) {
            errorMessage = "Problemi di connessione. Verifica la tua connessione internet";
          } else if (error.response?.data?.message) {
            // Fallback: altri possibili messaggi
            const backendMessage = error.response.data.message;
            if (backendMessage.includes("Invalid") || backendMessage.includes("invalid")) {
              errorMessage = "Dati non validi";
            } else if (backendMessage.includes("Missing") || backendMessage.includes("missing")) {
              errorMessage = "Dati mancanti";
            } else {
              errorMessage = "Si è verificato un errore durante il login";
            }
          }

          set({ error: errorMessage, token: null, isAuthenticated: false });

          throw new Error(errorMessage);
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
