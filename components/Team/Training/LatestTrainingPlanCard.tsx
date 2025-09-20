import Card from "@/components/ui/Card";
import { TrainingPlanType } from "@/lib/zod/userSchemas";
import React from "react";
import { Text } from "react-native";
import TrainingPlanElementCard from "./TrainingPlanElementCard";

interface LatestTrainingPlanCardProps {
  trainingPlan: TrainingPlanType;
  profileId: string;
}

export default function LatestTrainingPlanCard({ trainingPlan, profileId }: LatestTrainingPlanCardProps) {
  return (
    <Card className="mt-5">
      <Text className="text-xl font-semibold text-primary mb-3">La piu recente</Text>
      <TrainingPlanElementCard trainingPlan={trainingPlan} profileId={profileId} variant="latest" />
    </Card>
  );
}
