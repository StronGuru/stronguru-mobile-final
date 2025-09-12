import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Nutrition = () => {
  const params = useLocalSearchParams<{ nutrition?: string }>();
  const nutritionId = params?.nutrition ?? null;

  return (
    <SafeAreaView className="flex-1 bg-background px-4 ">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="">
          <Text className="text-2xl font-bold text-foreground">Nutrition ID: {nutritionId}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Nutrition;
