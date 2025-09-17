import DietDetail from "@/components/Team/Nutrition/DietDetail";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function DietDetailPage() {
  const { dietId, profileId } = useLocalSearchParams<{ dietId: string; profileId?: string }>();
  const { user } = useUserDataStore();
  const router = useRouter();

  const { diet, profile } = useMemo(() => {
    if (!user?.profiles || !dietId) return { diet: null, profile: null };

    // Trova il profile corretto
    let targetProfile;
    if (profileId) {
      targetProfile = user.profiles.find((p) => p._id === profileId && p.nutrition);
    } else {
      targetProfile = user.profiles.find((p) => p.nutrition);
    }

    if (!targetProfile?.nutrition) return { diet: null, profile: null };

    // Trova la dieta specifica
    const targetDiet = targetProfile.nutrition.diets?.find((d) => d._id === dietId);

    return { diet: targetDiet || null, profile: targetProfile };
  }, [user?.profiles, dietId, profileId]);

  if (!diet || !profile) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-xl text-foreground">Dieta non trovata</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-4 py-2 rounded-lg">
          <Text className="text-primary-foreground">Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header con back button */}
      <View className="flex-row items-center p-4 border-b border-secondary bg-card">
        <View className="flex-1">
          <Text className="text-xl font-semibold text-foreground">{diet.name}</Text>
          <Text className="text-sm text-foreground/70">{diet.goal}</Text>
        </View>
      </View>

      {/* Componente dettaglio */}
      <DietDetail diet={diet} />
    </View>
  );
}
