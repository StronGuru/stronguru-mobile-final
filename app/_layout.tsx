import { ThemeProvider } from "@/providers/ThemeProvider";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../src/store/authStore";
import "./globals.css";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const { hasCompletedOnboarding } = useOnboardingStore();

  useEffect(() => {
    setTimeout(() => {
      if (!isAuthenticated) {
        console.log("Redirecting to auth..."); // DEBUG
        router.replace("/(auth)/login");
      } else if (isAuthenticated && !hasCompletedOnboarding) {
        console.log("Showing post-login onboarding..."); // DEBUG
        router.replace("/(onboarding)");
      } else {
        console.log("User is authenticated and onboarded, redirecting to tabs..."); // DEBUG
        router.replace("/(tabs)");
      }
    }, 0);
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </ThemeProvider>
  );
}
