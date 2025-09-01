import { useAuthStore } from "@/src/store/authStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { Tabs } from "expo-router";
import { CalendarSearch, Home, MessagesSquare, Search, Settings, UsersRound } from "lucide-react-native";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId, user]);
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "green" }}>
      <Tabs.Screen name="index" options={{ title: "Home", /*  headerShown: false, */ tabBarIcon: ({ color }) => <Home size={24} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: "CercaPro", /* headerShown: false, */ tabBarIcon: ({ color }) => <Search size={24} color={color} /> }} />
      <Tabs.Screen
        name="team"
        options={{
          title: "Team",
          tabBarIcon: ({ color }) => <UsersRound size={24} color={color} />,
          tabBarStyle: user?.profiles?.length ? {} : { display: "none" }, // Hide tab bar button
          href: user?.profiles?.length ? undefined : null // Prevent navigation
        }}
      />
      <Tabs.Screen name="events" options={{ title: "Eventi", tabBarIcon: ({ color }) => <CalendarSearch size={24} color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: "Chat", tabBarIcon: ({ color }) => <MessagesSquare size={24} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <Settings size={24} color={color} /> }} />
    </Tabs>
  );
}
