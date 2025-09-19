import { useUserDataStore } from "@/src/store/userDataStore";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LatestComparisonChart from "./LatestComparisonChart";
import ProgressLineChart from "./ProgressLineChart";

interface NutritionChartsCardProps {
  profileId?: string;
}

type ChartType = "progress" | "comparison";

const chartOptions = [
  { key: "progress" as ChartType, label: "Peso" },
  { key: "comparison" as ChartType, label: "Confronto" }
];

export default function NutritionChartsCard({ profileId }: NutritionChartsCardProps) {
  const { user } = useUserDataStore();
  const [selectedChart, setSelectedChart] = useState<ChartType>("progress");

  const profileWithNutrition = useMemo(() => {
    if (!user?.profiles) return null;

    if (profileId) {
      return user.profiles.find((p) => p._id === profileId && p.nutrition) || null;
    } else {
      return user.profiles.find((p) => p.nutrition) || null;
    }
  }, [user?.profiles, profileId]);

  if (!profileWithNutrition?.nutrition) {
    return (
      <View className="bg-card p-4 rounded-lg my-6 border border-secondary">
        <Text className="text-xl font-semibold text-foreground">Grafici Nutrizione</Text>
        <Text className="text-sm text-foreground/70 mt-1">Nessun dato disponibile.</Text>
      </View>
    );
  }

  const { nutrition } = profileWithNutrition;

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case "progress":
        return <ProgressLineChart nutrition={nutrition} />;
      case "comparison":
        return <LatestComparisonChart nutrition={nutrition} />;
      default:
        return <ProgressLineChart nutrition={nutrition} />;
    }
  };

  return (
    <View className="bg-card p-4 rounded-lg my-6 shadow-sm border border-card dark:border-secondary">
      {/* Custom Segmented Control */}
      <View className="flex-row bg-secondary dark:bg-input shadow-sm rounded-lg p-1 mb-6">
        {chartOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            onPress={() => setSelectedChart(option.key)}
            className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-md ${selectedChart === option.key ? "bg-primary" : "bg-transparent"}`}
          >
            <Text className={`text-md font-medium ${selectedChart === option.key ? "text-primary-foreground" : "text-foreground"}`}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart selezionato */}
      {renderSelectedChart()}
    </View>
  );
}
