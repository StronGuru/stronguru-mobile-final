import AppText from "@/components/ui/AppText";
import Card from "@/components/ui/Card";
import { TrainingPlanType } from "@/lib/zod/userSchemas";
import React from "react";
import TrainingPlanElementCard from "./TrainingPlanElementCard";

interface LatestTrainingPlanCardProps {
  trainingPlan: TrainingPlanType;
  profileId: string;
}

export default function LatestTrainingPlanCard({ trainingPlan, profileId }: LatestTrainingPlanCardProps) {
  return (
    <Card className="mt-5">
      <AppText w="semi" className="text-xl text-primary mb-2">
        La piu recente
      </AppText>
      <TrainingPlanElementCard trainingPlan={trainingPlan} profileId={profileId} variant="latest" />
    </Card>
  );
}
