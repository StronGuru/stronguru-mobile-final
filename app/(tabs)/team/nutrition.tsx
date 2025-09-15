import LatestMeasuresCard from "@/components/Team/LatestMeasuresCard";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

const Nutrition = () => {
  // console.log debug if needed:
  // console.log("latestMeasurement:", JSON.stringify(latestMeasurement ?? "none", null, 2));
  // console.log("latestBia:", JSON.stringify(latestBia ?? "none", null, 2));
  return (
    <SafeAreaView className="flex-1 bg-background ">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-4  ">
          <LatestMeasuresCard />
        </View>

        {/* card per diete /charts */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Nutrition;
