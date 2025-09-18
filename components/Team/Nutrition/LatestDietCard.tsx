import { DietType } from "@/lib/zod/userSchemas";
import { Text, View } from "react-native";
import DietElementCard from "./DietElementCard";

interface LatestDietCardProps {
  diet: DietType;
  profileId: string;
}

export default function LatestDietCard({ diet, profileId }: LatestDietCardProps) {
  return (
    <View className="bg-card shadow-sm p-4 rounded-lg mt-5 mb-2 border border-card  dark:border-secondary">
      <Text className="text-xl font-semibold text-primary mb-2">La più recente</Text>
      <DietElementCard diet={diet} profileId={profileId} variant="latest" />
    </View>
  );
}
