import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

const Nutrition = () => {
  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="">
          <Text className="text-2xl font-bold text-foreground">Nutrition Page</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Nutrition;
