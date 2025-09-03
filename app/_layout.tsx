import { ThemeProvider } from "@/providers/ThemeProvider";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../src/store/authStore";
import "./globals.css";

export default function RootLayout() {
  const { isAuthenticated, isHydrated: authHydrated } = useAuthStore();
  const { hasCompletedOnboarding, isHydrated: onboardingHydrated } = useOnboardingStore();

  // Mantieni la splash fino a quando gli store non sono idratati
  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (authHydrated && onboardingHydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [authHydrated, onboardingHydrated]);

  // Non renderizzare nulla finché gli store non sono pronti (la splash native rimane visibile)
  if (!authHydrated || !onboardingHydrated) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack>
        {/* Utente autenticato e onboard completo -> tabs */}
        <Stack.Protected guard={isAuthenticated && hasCompletedOnboarding}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Utente autenticato ma NON ha completato onboarding -> onboarding */}
        <Stack.Protected guard={isAuthenticated && !hasCompletedOnboarding}>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Utente non autenticato -> auth flow */}
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
