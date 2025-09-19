import { TrainingPlanType } from "@/lib/zod/userSchemas";
import { useRouter } from "expo-router";
import { Gauge, Target } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TrainingPlanElementCardProps {
  trainingPlan: TrainingPlanType;
  profileId: string;
  variant?: "latest" | "list";
}

export default function TrainingPlanElementCard({ trainingPlan, profileId, variant = "list" }: TrainingPlanElementCardProps) {
  const router = useRouter();

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
        <Text className="text-md text-primary font-semibold">
          {trainingPlan.weeklyPlanning?.length || 0} {trainingPlan.weeklyPlanning?.length === 1 ? "settimana" : "settimane"}
        </Text>

        <Text className="text-md font-medium text-foreground  ">
          <Target size={14} color="#6b7280" /> {trainingPlan.goal}
        </Text>
        <Text className="text-md font-medium text-foreground">
          <Gauge size={14} color="#6b7280" /> {trainingPlan.level}
        </Text>
      </View>
    </View>
  );
}
