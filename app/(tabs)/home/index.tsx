import Slider from "@/components/home/Slider";
import Card from "@/components/ui/Card";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useRouter } from "expo-router";
import { Activity, Flame, Heart, Settings, User2 } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

// Circular Progress Component
const CircularProgress = ({
  size = 120,
  strokeWidth = 8,
  progress = 0.75,
  color = "#10b981",
  backgroundColor = "#e5e7eb",
  children
}: {
  size?: number;
  strokeWidth?: number;
  progress?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View className="relative items-center justify-center">
      <Svg width={size} height={size} className="absolute">
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={backgroundColor} strokeWidth={strokeWidth} fill="transparent" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
};

// Health Stats Component
const HealthStats = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const stats = [
    {
      title: "Passi",
      value: "8,247",
      unit: "passi",
      progress: 0.75,
      color: "#10b981",
      icon: Activity,
      subtitle: "Obiettivo: 10,000"
    },
    {
      title: "Calorie",
      value: "420",
      unit: "kcal",
      progress: 0.6,
      color: "#f59e0b",
      icon: Flame,
      subtitle: "Bruciate oggi"
    },
    {
      title: "Battiti",
      value: "72",
      unit: "bpm",
      progress: 0.9,
      color: "#ef4444",
      icon: Heart,
      subtitle: "Frequenza cardiaca"
    }
  ];

  return (
    <Card>
      <View className="flex-row justify-between ">
        {stats.map((stat, index) => (
          <View key={index} className="flex-1 items-center">
            <View className="items-center mb-3">
              <View className={`p-1 rounded-full ${isDark ? "bg-slate-700" : "bg-gray-50"} `}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{stat.title}</Text>
            </View>

            <CircularProgress size={80} strokeWidth={5} progress={stat.progress} color={stat.color} backgroundColor={isDark ? "#334155" : "#e5e7eb"}>
              <View className="items-center">
                <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stat.value}</Text>
                <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{stat.unit}</Text>
              </View>
            </CircularProgress>

            {/*  <Text className={`text-xs text-center mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{stat.subtitle}</Text> */}
          </View>
        ))}
      </View>
    </Card>
  );
};

const Index = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { user } = useUserDataStore();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header Name, Profile, Settings - sticky top */}
      <View className="px-4 pb-3 mb-2">
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-foreground text-3xl font-semibold">Ciao {user?.firstName}!</Text>
          <View className="flex-row items-center justify-between gap-6">
            <TouchableOpacity onPress={() => router.push("/home/settings")}>
              <Settings size={30} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/home/profile-page")}>
              <User2 size={30} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>

            {/* <Image source={{ uri: `${user?.}` }} className="w-10 h-10 rounded-full border border-white" /> */}
          </View>
        </View>
      </View>
      <ScrollView className="flex-1">
        {/* Health Stats Card */}
        <TouchableOpacity onPress={() => router.push("/home/targets")} className="px-4 mb-4">
          <HealthStats />
        </TouchableOpacity>
        {/* Quick Access scrollable Cards */}
        <Slider />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
