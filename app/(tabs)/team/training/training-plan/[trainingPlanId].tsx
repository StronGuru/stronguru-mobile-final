import TrainingPlanDetail from "@/components/Team/Training/TrainingPlanDetail";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function TrainingPlanDetailPage() {
  const { trainingPlanId, profileId } = useLocalSearchParams<{ trainingPlanId: string; profileId?: string }>();
  const { user } = useUserDataStore();
  const router = useRouter();

  const { training, profile } = useMemo(() => {
    if (!user?.profiles || !trainingPlanId) return { training: null, profile: null };

    // Trova il profile corretto
    let targetProfile;
    if (profileId) {
      targetProfile = user.profiles.find((p) => p._id === profileId && p.training);
    } else {
      targetProfile = user.profiles.find((p) => p.training);
    }

    if (!targetProfile?.training) return { training: null, profile: null };

    // Trova il piano di allenamento specifico
    const targetTrainingPlan = targetProfile.training.trainingPlans?.find((p) => p._id === trainingPlanId);

    return { training: targetTrainingPlan || null, profile: targetProfile };
  }, [user?.profiles, trainingPlanId, profileId]);

  if (!training || !profile) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-xl text-foreground">Piano di allenamento non trovato</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-4 py-2 rounded-lg">
          <Text className="text-primary-foreground">Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TrainingPlanDetail trainingPlan={training} />
    </View>
  );
}
