import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import AppText from "../ui/AppText";

export default function MindfulnessCard() {
  return (
    <TouchableOpacity
      className="w-[48%] min-h-[150px] bg-violet-400 p-4 rounded-3xl shadow-sm overflow-visible"
      onPress={() => {
        // naviga a mindfulnessHome
        router.push("/(tabs)/home/mindfulness");
      }}
    >
      <View className="flex-1 relative items-center justify-end">
        <Image
          source={{ uri: "https://ucarecdn.com/8f613848-68d2-4abb-a01e-c89af8268757/-/preview/1000x1000/" }}
          resizeMode="contain"
          style={{
            width: 170,
            aspectRatio: 3 / 4, // mantiene proporzioni
            position: "absolute",
            bottom: -20, // fa "uscire" la testa sopra la card
            right: 20 // piccolo offset laterale
          }}
        />
        <AppText w="bold" className="text-white text-2xl shadow-sm">
          Mindfulness
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
