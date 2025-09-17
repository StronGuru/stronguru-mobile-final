import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

export default function EventsLayout() {
  const colorScheme = useColorScheme();

  const colors = {
    light: {
      background: "#10b981",
      border: "#e5e7eb"
    },
    dark: {
      background: "#1e293b",
      border: "#94a3b8"
    }
  };
  const currentColors = colors[colorScheme ?? "light"];
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: currentColors.background },
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 }
      }}
    >
      <Stack.Screen name="index" options={{ title: "Eventi" }} />
      <Stack.Screen name="[eventsId]" options={{ title: "Dettagli evento" }} />
    </Stack>
  );
}
