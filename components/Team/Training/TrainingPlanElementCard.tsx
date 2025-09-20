import { TrainingPlanType } from "@/lib/zod/userSchemas";
import { useRouter } from "expo-router";
import { Calendar, Gauge, Target } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface TrainingPlanElementCardProps {
  trainingPlan: TrainingPlanType;
  profileId: string;
  variant?: "latest" | "list";
}

export default function TrainingPlanElementCard({ trainingPlan, profileId, variant = "list" }: TrainingPlanElementCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handlePress = () => {
    router.push(`/team/training/training-plan/${trainingPlan._id}?profileId=${profileId}`);
  };

  return (
    <View className={`bg-muted p-4 shadow-sm rounded-lg border border-card dark:border-secondary`}>
      {/* Header con titolo e status */}
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-1 mr-3">
          <Text className={`font-semibold text-xl text-foreground`}>{trainingPlan.planName}</Text>
        </View>

        <TouchableOpacity onPress={handlePress} className="bg-primary px-5 py-3 rounded-lg">
          <Text className="text-primary-foreground font-medium text-md">Mostra</Text>
        </TouchableOpacity>
      </View>

      {/* Info secondarie */}
      <View className="mt-1 gap-1">
        <View className="flex-row items-center">
          <Calendar size={14} color={colorScheme === "dark" ? "white" : "#000000"} />
          <Text className="text-md text-primary font-semibold ms-1">
            {trainingPlan.weeklyPlanning?.length || 0} {trainingPlan.weeklyPlanning?.length === 1 ? "settimana" : "settimane"}
          </Text>
        </View>

        <View className="gap-0.5">
          <View className="flex-row items-center">
            <Target size={14} color={colorScheme === "dark" ? "white" : "#000000"} />
            <Text className="text-md font-base text-foreground ms-1">{trainingPlan.goal}</Text>
          </View>
          <View className="mx-2"></View>
          <View className="flex-row items-center">
            <Gauge size={14} color={colorScheme === "dark" ? "white" : "#000000"} />
            <Text className="text-md font-base text-foreground ms-1">{trainingPlan.level}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
