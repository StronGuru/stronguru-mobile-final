import { LinearGradient } from "expo-linear-gradient"; // Import corretto
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
            [-width * 0.3, 0, width * 0.3],
            Extrapolation.CLAMP
          )
        },
        {
          scale: interpolate(scrollX?.value ?? 0, [(index - 1) * width, index * width, (index + 1) * width], [0.85, 1, 0.85], Extrapolation.CLAMP)
        }
      ]
    };
  });
  return (
    <Animated.View style={[styles.itemContainer, rnAnimatedStyle]} className={"shadow-sm py-3"}>
      <LinearGradient
        colors={["#065f46", "#10b981", "#059669", "#34d399"]} // 4 tonalità per smoothness
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <TouchableOpacity
          onPress={() => {
            router.push(`${item.route}` as any);
          }}
          className="rounded-xl p-6 my-2 items-center justify-center shadow-lg"
          style={{ width: 280, height: 400 }}
        >
          <View className="items-center justify-center">
            <AppText w="semi" className="text-5xl text-white pt-2 mb-5">
              {item.title}
            </AppText>
            <AppText w="semi" className="text-lg text-white text-center">
              {item.description}
            </AppText>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  gradientBackground: {
    borderRadius: 20, // Arrotondare i bordi
    width: 280,
    height: 400,
    justifyContent: "center",
    alignItems: "center"
  }
});
