import { useAuthStore } from "@/src/store/authStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { Tabs } from "expo-router";
import { CalendarSearch, Home, MessagesSquare, Search, Settings, UsersRound } from "lucide-react-native";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";

export default function TabsLayout() {
  const { isAuthenticated, userId } = useAuthStore();
  const { user, fetchUserData } = useUserDataStore();
  const colorScheme = useColorScheme();

  const colors = {
    light: {
      activeTint: "#059669", // Verde per active
      inactiveTint: "#6b7280", // Grigio per inactive
      background: "#fefffe", // Sfondo bianco
      border: "#e5e5e5" // Bordo chiaro
    },
    dark: {
      activeTint: "#34d399", // Verde più chiaro per dark mode
      inactiveTint: "#94a3b8", // Grigio più chiaro per dark mode
      background: "#1e293b", // Sfondo scuro
      border: "#94a3b8" // Bordo scuro
    }
  };
  const currentColors = colors[colorScheme ?? "light"];

  const TabIcon = ({ icon: IconComponent, color, focused }: { icon: any; color: string; focused: boolean }) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 30,
        borderRadius: 15,
        backgroundColor: focused ? currentColors.activeTint + "20" : "transparent" // 20 = opacità 12.5%
      }}
    >
      <IconComponent size={24} color={focused ? currentColors.activeTint : color} />
    </View>
  );

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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentColors.activeTint,
        tabBarInactiveTintColor: currentColors.inactiveTint,
        tabBarStyle: {
          backgroundColor: currentColors.background,
          borderTopColor: currentColors.border,
          paddingTop: 3,
          paddingInline: 10
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 3
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", /*  headerShown: false, */ tabBarIcon: ({ color, focused }) => <TabIcon icon={Home} color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "CercaPro", /* headerShown: false, */ tabBarIcon: ({ color, focused }) => <TabIcon icon={Search} color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "Team",
          tabBarIcon: ({ color, focused }) => <TabIcon icon={UsersRound} color={color} focused={focused} />, // Use a different icon size={24} color={color} />,
          tabBarStyle: user?.profiles?.length
            ? {
                backgroundColor: currentColors.background,
                borderTopColor: currentColors.border,
                paddingTop: 3,
                paddingInline: 10
              }
            : { display: "none" }, // Hide tab bar button
          href: user?.profiles?.length ? undefined : null // Prevent navigation
        }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: "Eventi", tabBarIcon: ({ color, focused }) => <TabIcon icon={CalendarSearch} color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: "Chat", tabBarIcon: ({ color, focused }) => <TabIcon icon={MessagesSquare} color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings", headerShown: false, tabBarIcon: ({ color, focused }) => <TabIcon icon={Settings} color={color} focused={focused} /> }}
      />
    </Tabs>
  );
}
