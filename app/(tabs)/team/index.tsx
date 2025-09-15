import ProfessionalCard from "@/components/Team/ProfessionalCardTeam";
import { ProfileType } from "@/lib/zod/userSchemas";
import { useAuthStore } from "@/src/store/authStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Team() {
  const { userId } = useAuthStore();
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { fetchUserData } = useUserDataStore();

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
      /* console.log("Fetched profiles:", JSON.stringify(profilesFromStore, null, 2)); */
      setProfiles(profilesFromStore);
      /* const foundNutritionId = profilesFromStore.find((p) => p?.nutrition && typeof p.nutrition._id === "string")?.nutrition?._id ?? null;
      setNutritionId(foundNutritionId); */
    } catch (error) {
      console.error("Error fetching profiles (from store):", error);
      setProfiles([]);
      /* setNutritionId(null); */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdatedProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <View className="flex-1  bg-background justify-center items-center">
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

  return (
    <SafeAreaView className="flex-1 px-4 pt-4 bg-background ">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between px-4">
          <Text className="w-full text-2xl font-semibold my-4 text-foreground">Il tuo Team</Text>
          {profiles.map((profile) => (
            <View key={profile._id} className="w-[33.33%]">
              <ProfessionalCard professional={profile.createdBy} />
            </View>
          ))}
        </View>
        <View className="flex-1 px-4">
          <Text className="text-foreground text-2xl font-semibold">I tuoi Dati</Text>
          {/* AGGIUNGI CONDITIONAL RENDER DEI BOTTONI IN BASE ALLA PRESENZA DEGLI ID NUTRITION,TRAINING E PSYCHOLOGY NEL PROFILES ARRAY DELLO USER */}
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push(`/team/nutrition`);
              }}
              className="mt-2 bg-secondary rounded-lg p-4 items-center shadow-sm"
            >
              <Text className="text-foreground text-3xl">Nutrizione</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push(`/team/training`);
              }}
              className="mt-2 bg-secondary rounded-lg p-4 items-center shadow-sm"
            >
              <Text className="text-foreground text-3xl">Allenamento</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push(`/team/psychology`);
              }}
              className="mt-2 bg-secondary rounded-lg p-4 items-center shadow-sm"
            >
              <Text className="text-foreground text-3xl">Psicologia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
