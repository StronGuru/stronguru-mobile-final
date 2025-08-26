import { Tabs } from "expo-router";
import { Calendar1Icon, Home, Settings } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "green" }}>
      <Tabs.Screen name="index" options={{ title: "Home", headerShown: false, tabBarIcon: ({ color }) => <Home size={24} color={color} /> }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar", headerShown: false, tabBarIcon: ({ color }) => <Calendar1Icon size={24} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <Settings size={24} color={color} /> }} />
    </Tabs>
  );
}
