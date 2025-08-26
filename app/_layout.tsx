import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "./globals.css";
import { useAuthStore } from "./store/authStore";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (!isAuthenticated) {
        console.log("Redirecting to auth..."); // DEBUG
        router.replace("/auth");
      } else {
        console.log("User is authenticated, redirecting to tabs..."); // DEBUG
        router.replace("/(tabs)");
      }
    }, 0);
  }, [isAuthenticated, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RouteGuard>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </RouteGuard>
  );
}
