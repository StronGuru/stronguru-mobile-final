import { useUserDataStore } from "@/src/store/userDataStore";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

const Nutrition = () => {
  const { user } = useUserDataStore();
  console.log("user profiles:", JSON.stringify(user?.profiles ?? "no profiles", null, 2));
  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-card p-4 rounded-lg mt-4 ">
          <Text className="text-2xl font-bold text-foreground">Nutrition </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Nutrition;
