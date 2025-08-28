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
    const { useAuthStore } = await import("../src/store/authStore");
    const { token, deviceId } = useAuthStore.getState();

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
// Refresh token
apiClient.interceptors.response.use(
  (response) => {
    // Debug successful responses
    console.log("📥 [apiClient] Response success:", {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    console.error("📥 [apiClient] Response error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });

    const originalRequest = error.config;

    // 🎯 Solo gestisci 401 (Unauthorized) per refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔄 [apiClient] 401 detected, attempting token refresh...");

      if (isRefreshing) {
        console.log("⏳ [apiClient] Refresh già in corso, aspetta...");
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
        // 🎯 Get deviceId from store
        const { useAuthStore } = await import("../src/store/authStore");
        const { deviceId } = useAuthStore.getState();

        console.log("🔄 [apiClient] Calling refresh token endpoint...");
        console.log("🔑 [apiClient] DeviceId:", deviceId);

        // 🎯 Refresh token call - i cookies vengono inviati automaticamente
        const refreshResp = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {}, // Empty body
          {
            headers: {
              "X-Device-Id": deviceId,
              "X-Device-Type": "mobile"
            },
            withCredentials: true // 🎯 IMPORTANTE: Invia i cookies HTTP-only
          }
        );

        const newToken = refreshResp.data.accessToken;
        console.log("✅ [apiClient] Refresh successful, new token:", newToken?.substring(0, 20) + "...");

        // 🎯 Check if new refresh token was set
        if (refreshResp.headers["set-cookie"]) {
          console.log("🍪 [apiClient] New refresh token received in cookies");
        }

        // 🎯 Update store with new access token
        useAuthStore.getState().setAuthData({
          token: newToken,
          error: null
        });

        // Notify all waiting requests
        onRefreshed(newToken);
        isRefreshing = false;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error("❌ [apiClient] Refresh token failed:", {
          status: refreshError.response?.status,
          message: refreshError.message
        });

        isRefreshing = false;

        // 🎯 Se il refresh fallisce, logout completo
        try {
          const { useAuthStore } = await import("../src/store/authStore");
          const { useUserDataStore } = await import("../src/store/userDataStore");

          console.log("🔄 [apiClient] Refresh failed, executing logout...");

          // Clear stores
          useAuthStore.getState().logoutUser();
          useUserDataStore.getState().clearUser();

          console.log("✅ [apiClient] Logout completato dopo refresh fallito");
        } catch (logoutError) {
          console.error("❌ [apiClient] Errore durante logout:", logoutError);
        }

        return Promise.reject(refreshError);
      }
    }

    // Per tutti gli altri errori, passa attraverso
    return Promise.reject(error);
  }
);

export default apiClient;
