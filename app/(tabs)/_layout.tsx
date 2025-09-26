import { useGlobalChatRealtime } from "@/hooks/use-global-chat-realtime";
import { useAuthStore } from "@/src/store/authStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { Tabs } from "expo-router";
import { CalendarSearch, Home, MessagesSquare, Search, UsersRound } from "lucide-react-native";
import { useEffect } from "react";

import { useChatBadgeStore } from "@/src/store/chatBadgeStore";
import { Text, useColorScheme, View } from "react-native";

// Extend the Window interface to include __maxChatUnread
declare global {
  interface Window {
    __maxChatUnread?: number;
  }
}

export default function TabsLayout() {
  useGlobalChatRealtime();
  const { isAuthenticated, userId } = useAuthStore();
  const { user, fetchUserData } = useUserDataStore();
  const colorScheme = useColorScheme();
  const maxChatUnread = useChatBadgeStore((s) => s.maxUnread);

  const colors = {
    light: {
      activeTint: "#059669",
      inactiveTint: "#6b7280",
      background: "#fefffe",
      border: "#e5e7eb"
    },
    dark: {
      activeTint: "#34d399",
      inactiveTint: "#94a3b8",
      background: "#1e293b",
      border: "#94a3b8"
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
          fontSize: 14,
          marginTop: 2,
          fontFamily: "Kanit_400Regular"
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Home} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Cerca Pro",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Search} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "Team",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={UsersRound} color={color} focused={focused} />,
          tabBarStyle: user?.profiles?.length
            ? {
                backgroundColor: currentColors.background,
                borderTopColor: currentColors.border,
                paddingTop: 3
              }
            : { display: "none" }, // Nasconde il tab bar button
          href: user?.profiles?.length ? undefined : null // Previene la navigazione
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Eventi",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={CalendarSearch} color={color} focused={focused} />
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: "relative" }}>
              <TabIcon icon={MessagesSquare} color={color} focused={focused} />
              {maxChatUnread > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -8,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: "#ef4444",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>{maxChatUnread}</Text>
                </View>
              )}
            </View>
          )
        }}
      />
    </Tabs>
  );
}
