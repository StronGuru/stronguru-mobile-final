import AllTrainingPlansCard from "@/components/Team/Training/AllTrainingPlansCard";
import LatestTrainingPlanCard from "@/components/Team/Training/LatestTrainingPlanCard";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useLocalSearchParams } from "expo-router";
import { Dumbbell } from "lucide-react-native";
import { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

type TrainingTabType = "trainingPlans" | "charts";

const trainingTabOptions = [
  { key: "trainingPlans" as TrainingTabType, label: "Schede" }
  // { key: "charts" as TrainingTabType, label: "Grafici" } // Aggiungi altre tab se necessario
];

export default function Training() {
  const { profileId } = useLocalSearchParams<{ profileId?: string }>();
  const { user } = useUserDataStore();
  const [selectedTab, setSelectedTab] = useState<TrainingTabType>("trainingPlans");

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
    const sortedTrainingPlans = [...trainingPlans].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

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
        <Dumbbell size={64} color="#10b981" />
        <Text className="text-xl font-semibold text-foreground text-center mt-4 mb-2">I tuoi piani di allenamento appariranno qui</Text>
        <Text className="text-foreground text-center">Quando il tuo trainer creerà una scheda di allenamento la vedrai in questa sezione</Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case "trainingPlans":
        return (
          <View>
            {trainingPlanData.latestTrainingPlan && (
              <LatestTrainingPlanCard trainingPlan={trainingPlanData.latestTrainingPlan} profileId={selectedProfile?._id || ""} />
            )}

            {trainingPlanData.hasMultipleTrainingPlans && (
              <AllTrainingPlansCard trainingPlans={trainingPlanData.remainingTrainingPlans} profileId={selectedProfile?._id || ""} />
            )}
          </View>
        );

      // case "charts":
      //   return (
      //     <View className="p-4">
      //       <Text className="text-lg text-foreground">Grafici di allenamento (in sviluppo)</Text>
      //     </View>
      //   );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Tab Selector */}
      <View className="px-4 pt-4">
        <View className="flex-row bg-muted shadow-sm rounded-lg p-1">
          {trainingTabOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setSelectedTab(option.key)}
              className={`flex-1 py-3 px-4 rounded-md ${selectedTab === option.key ? "bg-primary" : "bg-transparent"}`}
            >
              <Text className={`text-center font-medium ${selectedTab === option.key ? "text-primary-foreground" : "text-muted-foreground"}`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
