import ProfessionalCard from "@/components/Team/ProfessionalCardTeam";
import { ProfileType } from "@/lib/zod/userSchemas";
import { useAuthStore } from "@/src/store/authStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Team() {
  const { userId } = useAuthStore();
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { fetchUserData } = useUserDataStore();

  // Calcola servizi disponibili
  const availableServices = useMemo(() => {
    const { user } = useUserDataStore.getState();
    const userProfiles = user?.profiles || [];

    const hasNutrition = userProfiles.some((p) => p.nutrition?._id);
    const hasTraining = userProfiles.some((p) => p.training?._id);
    const hasPsychology = userProfiles.some((p) => p.psychology?._id);

    // Calcola statistiche per nutrition
    let nutritionStats = "";
    if (hasNutrition) {
      const totalMeasurements = userProfiles.reduce((acc, p) => acc + (p.nutrition?.measurements?.length || 0), 0);
      const totalBia = userProfiles.reduce((acc, p) => acc + (p.nutrition?.bia?.length || 0), 0);
      const totalDiets = userProfiles.reduce((acc, p) => acc + (p.nutrition?.diets?.length || 0), 0);

      const statsParts: string[] = [];
      if (totalMeasurements > 0) statsParts.push(`${totalMeasurements} misurazioni`);
      if (totalBia > 0) statsParts.push(`${totalBia} BIA`);
      if (totalDiets > 0) statsParts.push(`${totalDiets} diete`);

      nutritionStats = statsParts.join(" • ");
    }

    // Calcola statistiche per training
    let trainingStats = "";
    if (hasTraining) {
      const totalTrainingPlans = userProfiles.reduce((acc, p) => acc + (p.training?.trainingPlans?.length || 0), 0);

      if (totalTrainingPlans > 0) {
        trainingStats = `${totalTrainingPlans} piani`;
      }
    }

    return {
      nutrition: { available: hasNutrition, stats: nutritionStats },
      training: { available: hasTraining, stats: trainingStats },
      psychology: { available: hasPsychology }
    };
  }, [profiles]); // Ricalcola quando cambiano i profiles

  const fetchUpdatedProfiles = async () => {
    if (!userId) {
      setProfiles([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Aggiorna lo user nello store per ottenere eventuali nuovi profiles
      await fetchUserData(userId);
      const latestUser = useUserDataStore.getState().user;
      const profilesFromStore = latestUser?.profiles ?? [];
      setProfiles(profilesFromStore);
    } catch (error) {
      console.error("Error fetching profiles (from store):", error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdatedProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNutritionPress = () => {
    const { user } = useUserDataStore.getState();
    const nutritionProfiles = user?.profiles?.filter((p) => p.nutrition?._id) || [];

    if (nutritionProfiles.length === 0) {
      // Nessun nutrizionista
      return;
    } else if (nutritionProfiles.length === 1) {
      // Un solo nutrizionista, vai diretto
      router.push(`/team/nutrition?profileId=${nutritionProfiles[0]._id}`);
    } else {
      // Più nutrizionisti, vai alla selezione
      router.push("/team/nutrition/selector");
    }
  };

  const handleTrainingPress = () => {
    const { user } = useUserDataStore.getState();
    const trainingProfiles = user?.profiles?.filter((p) => p.training?._id) || [];

    if (trainingProfiles.length === 0) {
      // Nessun allenatore
      return;
    } else if (trainingProfiles.length === 1) {
      // Un solo allenatore, vai diretto
      router.push(`/team/training?profileId=${trainingProfiles[0]._id}`);
    } else {
      // Più allenatori, vai alla selezione
      router.push("/team/training/selector");
    }
  };

  const handlePsychologyPress = () => {
    const { user } = useUserDataStore.getState();
    const psychologyProfiles = user?.profiles?.filter((p) => p.psychology?._id) || [];

    if (psychologyProfiles.length === 0) {
      // Nessun psicologo
      return;
    } else if (psychologyProfiles.length === 1) {
      // Un solo psicologo, vai diretto
      router.push(`/team/psychology?profileId=${psychologyProfiles[0]._id}`);
    } else {
      // Più psicologi, vai alla selezione
      router.push("/team/psychology/selector");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-6">
        <Text className="text-foreground">Nessun professionista collegato al tuo account.</Text>
      </View>
    );
  }

  const hasAnyService = availableServices.nutrition.available || availableServices.training.available || availableServices.psychology.available;

  return (
    <SafeAreaView className="flex-1 px-4 pt-4 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap px-4">
          <Text className="w-full text-2xl font-semibold my-4 pb-2 text-foreground border-b border-secondary">Il tuo Team</Text>
          {profiles.map((profile) => (
            <View key={profile._id} className="w-[33.33%]">
              <ProfessionalCard professional={profile.createdBy} />
            </View>
          ))}
        </View>

        <View className="flex-1 px-4">
          <Text className="w-full text-foreground text-2xl font-semibold mb-4 pb-2 border-b border-secondary">I tuoi Dati</Text>

          {hasAnyService ? (
            <View>
              {/* Nutrition Button - mostra solo se disponibile */}
              {availableServices.nutrition.available && (
                <TouchableOpacity onPress={handleNutritionPress} className="mt-2 bg-muted dark:bg-primary rounded-2xl p-4 items-center border border-secondary">
                  <Text className="text-primary dark:text-card text-2xl">Nutrizione</Text>
                  {availableServices.nutrition.stats && <Text className="text-primary dark:text-card text-sm mt-1">{availableServices.nutrition.stats}</Text>}
                </TouchableOpacity>
              )}

              {/* Training Button - mostra solo se disponibile */}
              {availableServices.training.available && (
                <TouchableOpacity onPress={handleTrainingPress} className="mt-2 bg-muted dark:bg-primary rounded-2xl p-4 items-center border border-secondary">
                  <Text className="text-primary dark:text-card text-2xl">Allenamento</Text>
                  {availableServices.training.stats && <Text className="text-primary dark:text-card text-sm mt-1">{availableServices.training.stats}</Text>}
                </TouchableOpacity>
              )}

              {/* Psychology Button - mostra solo se disponibile */}
              {availableServices.psychology.available && (
                <TouchableOpacity
                  onPress={handlePsychologyPress}
                  className="mt-2 bg-muted dark:bg-primary rounded-2xl p-4 items-center border border-secondary"
                >
                  <Text className="text-primary dark:text-card text-2xl">Psicologia</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="bg-muted p-6 rounded-2xl border border-secondary">
              <Text className="text-foreground text-center text-lg">📋 Nessun servizio disponibile</Text>
              <Text className="text-foreground text-center mt-2">Connetti un professionista al tuo team per visualizzare i tuoi dati</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
