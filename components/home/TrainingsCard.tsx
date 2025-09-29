import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import AppText from "../ui/AppText";

export default function TrainingsCard() {
  return (
    <TouchableOpacity
      className="w-[48%] min-h-[150px] bg-orange-400 p-4 rounded-3xl shadow-sm overflow-visible"
      onPress={() => {
        router.push("/(tabs)/home/trainings/trainingsHome");
      }}
    >
      <View className="flex-1 relative items-center justify-end">
        <Image
          source={{ uri: "https://ucarecdn.com/c10cd797-d491-4ea9-84ef-6a41b36af7d2/-/preview/1000x1000/" }}
          resizeMode="contain"
          style={{
            width: 135,
            aspectRatio: 3 / 4, // mantiene proporzioni
            position: "absolute",
            bottom: 8, // fa "uscire" la testa sopra la card
            left: -13 // piccolo offset laterale
          }}
        />
        <AppText w="bold" className="text-white text-2xl shadow-sm">
          Trainings
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
