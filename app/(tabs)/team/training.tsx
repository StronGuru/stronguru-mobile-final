import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Training() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="">
          <Text className="text-2xl font-bold text-foreground">Training Page</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
