import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

export type SliderDataItem = {
  title: string;
  description: string;
  route: string;
};

interface HomeSliderCardProps {
  item: SliderDataItem;
  index: number;
  scrollX?: SharedValue<number>;
}

const { width } = Dimensions.get("screen");

export default function HomeSliderCard({ item, index, scrollX }: HomeSliderCardProps) {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX?.value ?? 0,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP
          )
        },
        {
          scale: interpolate(scrollX?.value ?? 0, [(index - 1) * width, index * width, (index + 1) * width], [0.9, 1, 0.9], Extrapolation.CLAMP)
        }
      ]
    };
  });
  return (
    <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
      <TouchableOpacity className="bg-secondary rounded-xl shadow-sm p-6 my-2 items-center justify-center" style={{ width: 280, height: 400 }}>
        <View className="items-center justify-center ">
          <Text className="text-3xl font-bold mb-10">{item.title}</Text>
          <Text className="text-medium">{item.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  }
});
