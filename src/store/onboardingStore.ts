import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  isHydrated: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      isHydrated: false,
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed })
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      }
    }
  )
);
