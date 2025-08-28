import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// Refresh token lock mechanism
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Device-Type": "mobile"
  },
  withCredentials: true
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    const deviceId = await AsyncStorage.getItem("device_id");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (deviceId) {
      config.headers["X-Device-Id"] = deviceId;
    }

    config.headers["X-Device-Type"] = "mobile";

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Evita loop infiniti
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // C'è già un refresh in corso: aspetta che finisca
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const deviceId = await AsyncStorage.getItem("device_id");
        // Chiamata al refresh token
        const refreshResp = await axios.post(
          `${API_URL}auth/refresh-token`,
          {},
          {
            headers: {
              "X-Device-Id": deviceId,
              "X-Device-type": "mobile"
            }
          }
        );
        const newToken = refreshResp.data.accessToken;
        console.log("Refresh token successful, new token:", newToken?.substring(0, 20) + "...");

        // Salva il nuovo token
        await AsyncStorage.setItem("auth_token", newToken);

        // Notifica tutti i subscriber che il refresh è completato
        onRefreshed(newToken);
        isRefreshing = false;

        // Aggiorna header e ripeti la richiesta originale
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Logout se il refresh fallisce - rimuovi i dati salvati
        try {
          const { useAuthStore } = await import("../src/store/authStore");
          await useAuthStore.getState().logoutUser();
          console.log("Refresh fallito - logout automatico completato");
        } catch (logoutError) {
          console.error("Errore durante il logout automatico:", logoutError);
          // Fallback: pulizia manuale solo se il logout dello store fallisce
          await AsyncStorage.removeItem("auth_token");
          await AsyncStorage.removeItem("device_id");
          await AsyncStorage.removeItem("user_data");
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
