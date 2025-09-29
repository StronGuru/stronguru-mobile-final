import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import AppText from "../ui/AppText";

export default function TrainingsCard() {
  return (
    <TouchableOpacity className="w-[48%] min-h-[150px] bg-orange-400 p-4 rounded-3xl shadow-sm overflow-visible">
      <View className="flex-1 relative items-center justify-end">
        <Image
          source={{ uri: "https://ucarecdn.com/f5e1a7da-0216-4b4d-b4aa-4d23d65e072e/-/preview/1000x1000/" }}
          resizeMode="contain"
          style={{
            width: 140,
            aspectRatio: 3 / 4, // mantiene proporzioni
            position: "absolute",
            bottom: 8, // fa "uscire" la testa sopra la card
            left: -18 // piccolo offset laterale
          }}
        />{" "}
        <AppText w="bold" className="text-white text-2xl shadow-sm">
          Trainings
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
