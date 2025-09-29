import AllDietsCard from "@/components/Team/Nutrition/AllDietsCard";
import LatestDietCard from "@/components/Team/Nutrition/LatestDietCard";
import LatestMeasuresCard from "@/components/Team/Nutrition/LatestMeasuresCard";
import NutritionChartsCard from "@/components/Team/Nutrition/NutritionChartsCard";
import AppText from "@/components/ui/AppText";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useLocalSearchParams } from "expo-router";
import { Ruler, UtensilsCrossed } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

type TabType = "measurements" | "diets";

const tabOptions = [
  { key: "measurements" as TabType, label: "Misurazioni", Icon: Ruler },
  { key: "diets" as TabType, label: "Diete", Icon: UtensilsCrossed }
];

export default function Nutrition() {
  const { profileId } = useLocalSearchParams<{ profileId?: string }>();
  const { user } = useUserDataStore();
  const [selectedTab, setSelectedTab] = useState<TabType>("measurements");

  const selectedProfile = useMemo(() => {
    if (!user?.profiles) return null;

    if (profileId) {
      return user.profiles.find((p) => p._id === profileId && p.nutrition) || null;
    } else {
      return user.profiles.find((p) => p.nutrition) || null;
    }
  }, [user?.profiles, profileId]);

  const dietsData = useMemo(() => {
    const diets = selectedProfile?.nutrition?.diets || [];

    // Ordina per createdAt più recente prima
    const sortedDiets = [...diets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const latestDiet = sortedDiets[0] || null;

    // Per AllDietsCard, rimuovi la prima dieta (quella già mostrata in LatestDietCard)
    const remainingDiets = sortedDiets.slice(1);

    return {
      latestDiet,
      remainingDiets,
      hasDiets: sortedDiets.length > 0,
      hasMultipleDiets: sortedDiets.length >= 2
    };
  }, [selectedProfile?.nutrition?.diets]);

  if (!selectedProfile?.nutrition) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <AppText className="text-xl ">Nessun dato nutrizionale disponibile</AppText>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case "measurements":
        return (
          <>
            <LatestMeasuresCard profileId={selectedProfile._id} />
            <NutritionChartsCard profileId={selectedProfile._id} />
          </>
        );

      case "diets":
        if (!dietsData.hasDiets) {
          // Nessuna dieta disponibile
          return (
            <View className="bg-card p-6 shadow-sm rounded-lg my-6 border border-secondary">
              <View className="items-center">
                <UtensilsCrossed size={64} color="#10b981" />
                <AppText w="semi" className="text-2xl text-center mt-4 mb-2">
                  Le tue diete appariranno qui
                </AppText>
                <AppText className="text-foreground text-center">Quando il tuo nutrizionista creerà un piano alimentare lo vedrai in questa sezione</AppText>
              </View>
            </View>
          );
        }

        if (!dietsData.hasMultipleDiets) {
          // Solo una dieta - mostra solo LatestDietCard
          return <LatestDietCard diet={dietsData.latestDiet!} profileId={selectedProfile._id} />;
        }

        // Multiple diete - mostra entrambe le card
        return (
          <>
            <LatestDietCard diet={dietsData.latestDiet!} profileId={selectedProfile._id} />
            <AllDietsCard diets={dietsData.remainingDiets} profileId={selectedProfile._id} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Tab Selector */}
      <View className="px-4 pt-4 pb-1">
        <View className="flex-row bg-secondary dark:bg-input shadow-sm rounded-lg p-1 ">
          {tabOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setSelectedTab(option.key)}
              className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-md ${selectedTab === option.key ? "bg-primary" : "bg-transparent"}`}
            >
              <AppText w="semi" className={`text-lg  ${selectedTab === option.key ? "text-primary-foreground" : "text-foreground"}`}>
                {option.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tab Content */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}
