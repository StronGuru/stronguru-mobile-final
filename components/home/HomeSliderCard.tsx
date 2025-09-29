import { router } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import AppText from "../ui/AppText";

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
            [-width * 0.2, 0, width * 0.2],
            Extrapolation.CLAMP
          )
        },
        {
          scale: interpolate(scrollX?.value ?? 0, [(index - 1) * width, index * width, (index + 1) * width], [0.8, 1, 0.8], Extrapolation.CLAMP)
        }
      ]
    };
  });
  return (
    <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
      <TouchableOpacity
        onPress={() => {
          router.push(`${item.route}` as any);
        }}
        className="bg-primary rounded-3xl p-4 my-2 items-center justify-center shadow-sm"
        style={{ width: 350, height: 180 }}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10
  }
});
