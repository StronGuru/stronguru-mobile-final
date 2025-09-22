import React from "react";
import { View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { SliderDataItem } from "./HomeSliderCard";

type Props = {
  items: SliderDataItem[];
  paginationIndex: number;
  scrollX: SharedValue<number>;
};

export default function SliderPagination({ items, paginationIndex, scrollX }: Props) {
  return (
    <View className="flex-row h-15 justify-center items-center">
      {items.map((_, index) => {
        return <View key={index} className={`h-2 rounded-full mx-1 ${index === paginationIndex ? "bg-primary w-4" : "bg-secondary w-2"}`} />;
      })}
    </View>
  );
}
