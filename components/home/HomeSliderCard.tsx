import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "../ui/AppText";

export type SliderDataItem = {
  title: string;
  description: string;
  route: string;
};

interface HomeSliderCardProps {
  item: SliderDataItem;
  index: number;
  scrollX?: any; // removed reanimated usage
}

export default function HomeSliderCard({ item }: HomeSliderCardProps) {
  return (
    <View className=" flex-1 mr-3 items-center justify-center">
      <TouchableOpacity
        onPress={() => {
          router.push(`${item.route}` as any);
        }}
        className="bg-primary w-[345px] h-[170px] rounded-3xl p-4 my-4 items-center justify-center shadow-sm"
      >
        <View className="items-center justify-center ">
          <AppText w="bold" className="text-2xl text-white shadow-sm mb-5">
            {item.title}
          </AppText>
          <AppText w="semi" className="text-lg text-white shadow-sm text-center">
            {item.description}
          </AppText>
        </View>
      </TouchableOpacity>
    </View>
  );
}
