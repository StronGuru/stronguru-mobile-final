import LatestMeasuresCard from "@/components/Team/Nutrition/LatestMeasuresCard";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Nutrition() {
  const { profileId } = useLocalSearchParams<{ profileId?: string }>();
  const { user } = useUserDataStore();

  const selectedProfile = useMemo(() => {
    if (!user?.profiles) return null;

    if (profileId) {
      // Se abbiamo un profileId specifico, usalo
      return user.profiles.find((p) => p._id === profileId && p.nutrition) || null;
    } else {
      // Fallback: primo profile con nutrition (per retrocompatibilità)
      return user.profiles.find((p) => p.nutrition) || null;
    }
  }, [user?.profiles, profileId]);

  if (!selectedProfile?.nutrition) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-xl text-foreground">Nessun dato nutrizionale disponibile</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-4">
      <LatestMeasuresCard profileId={selectedProfile._id} />
      {/* Altre cards passeranno anche il profileId */}
      {/* CARD GRAFICI */}
      {/* CARD TABELLA DIETE */}
    </ScrollView>
  );
}
