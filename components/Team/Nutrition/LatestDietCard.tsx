import AppText from "@/components/ui/AppText";
import { DietType } from "@/lib/zod/userSchemas";
import { View } from "react-native";
import DietElementCard from "./DietElementCard";

interface LatestDietCardProps {
  diet: DietType;
  profileId: string;
}

export default function LatestDietCard({ diet, profileId }: LatestDietCardProps) {
  return (
    <View className="bg-card shadow-sm p-4 pb-7 rounded-lg mt-5 mb-2 border border-card  dark:border-secondary">
      <AppText w="semi" className="text-xl text-primary mb-3">
        La più recente
      </AppText>
      <DietElementCard diet={diet} profileId={profileId} variant="latest" />
    </View>
  );
}
