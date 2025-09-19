import { useUserDataStore } from "@/src/store/userDataStore";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Training() {
  const { profileId } = useLocalSearchParams<{ profileId?: string }>();
  const { user } = useUserDataStore();

  const selectedProfile = useMemo(() => {
    if (!user?.profiles) return null;

    if (profileId) {
      return user.profiles.find((p) => p._id === profileId && p.training) || null;
    } else {
      return user.profiles.find((p) => p.training) || null;
    }
  }, [user?.profiles, profileId]);

  const trainingPlanData = useMemo(() => {
    const trainingPlans = selectedProfile?.training?.trainingPlans || [];

    // Ordina per createdAt più recente prima
    const sortedTrainingPlans = [...trainingPlans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const latestTrainingPlan = sortedTrainingPlans[0] || null;

    // Per AllTrainingPlansCard, rimuovi il primo piano (quello già mostrato in LatestTrainingPlanCard)
    const remainingTrainingPlans = sortedTrainingPlans.slice(1);

    return {
      latestTrainingPlan,
      remainingTrainingPlans,
      hasTrainingPlans: sortedTrainingPlans.length > 0,
      hasMultipleTrainingPlans: sortedTrainingPlans.length >= 2
    };
  }, [selectedProfile?.training?.trainingPlans]);

  if (!trainingPlanData.hasTrainingPlans) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-xl text-foreground">Nessun piano di allenamento disponibile</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="">
          <Text className="text-2xl font-bold text-foreground">Training Page</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
