import MindfulnessCardApp from "@/components/mindfulness/MindfulnessCardApp";
import React from "react";
import { ScrollView } from "react-native";

export default function MindfulnessHomeScreen() {
  return (
    <ScrollView className="flex-1 px-4 py-6 bg-background" showsVerticalScrollIndicator={false}>
      <MindfulnessCardApp />
    </ScrollView>
  );
}
