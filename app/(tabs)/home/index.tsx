import { HeroCard } from "@/components/home/HeroCard";
import MindfulnessCard from "@/components/home/MindfulnessCard";
import Slider from "@/components/home/Slider";
import TrainingsCard from "@/components/home/TrainingsCard";
import AppText from "@/components/ui/AppText";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useRouter } from "expo-router";
import { CircleUser, Settings } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Circular Progress Component

const Index = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { user } = useUserDataStore();

  const today = new Date();
  let weekday = today.toLocaleDateString("it-IT", { weekday: "long" }).replace(".", "");
  weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  const day = today.toLocaleDateString("it-IT", { day: "numeric" });
  let month = today.toLocaleDateString("it-IT", { month: "short" }).replace(".", "");
  month = month.charAt(0).toUpperCase() + month.slice(1);

  const formattedFull = `${weekday}, ${day} ${month}`; // "Gio, 25 Set"

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header Name, Profile, Settings - sticky top */}
      <View className="px-4 pb-1 mb-2">
        <View className="flex-row items-center justify-between mt-2 gap-6">
          <TouchableOpacity onPress={() => router.push("/home/profile-page")}>
            <CircleUser size={32} color={colorScheme === "dark" ? "white" : "black"} />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <AppText w="semi" className="text-xl">
              Ciao, {user?.firstName}
            </AppText>
            <AppText className="text-sm text-muted-foreground">{formattedFull}</AppText>
          </View>

          <TouchableOpacity onPress={() => router.push("/home/settings")}>
            <Settings size={32} color={colorScheme === "dark" ? "white" : "black"} />
          </TouchableOpacity>

          {/* <Image source={{ uri: `${user?.}` }} className="w-10 h-10 rounded-full border border-white" /> */}
        </View>
      </View>
      <ScrollView className="flex-1 ">
        {/* Hero Card */}
        <HeroCard />
        {/* Quick Access scrollable Cards */}
        <Slider />

        <View className="mt-8 px-4 flex-row gap-2 justify-around ">
          <MindfulnessCard />
          <TrainingsCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
