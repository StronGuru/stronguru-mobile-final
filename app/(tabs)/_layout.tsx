import { useAuthStore } from "@/src/store/authStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { Tabs } from "expo-router";
import { Calendar1Icon, Home, Settings } from "lucide-react-native";
import { useEffect } from "react";

export default function TabsLayout() {
  const { isAuthenticated, userId } = useAuthStore();
  const { user, fetchUserData } = useUserDataStore();

  useEffect(() => {
    // 🎯 Carica dati utente appena accedi alle tabs
    if (isAuthenticated && userId && !user) {
      console.log("🔄 Caricando dati utente nel TabsLayout...");
      fetchUserData(userId).catch((error) => {
        console.error("❌ Errore caricamento dati utente:", error);
      });
    }
  }, [isAuthenticated, userId, user]);
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "green" }}>
      <Tabs.Screen name="index" options={{ title: "Home", headerShown: false, tabBarIcon: ({ color }) => <Home size={24} color={color} /> }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar", headerShown: false, tabBarIcon: ({ color }) => <Calendar1Icon size={24} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <Settings size={24} color={color} /> }} />
    </Tabs>
  );
}
