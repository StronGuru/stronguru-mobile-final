import { NutritionType } from "@/lib/zod/userSchemas";
import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface ProgressLineChartProps {
  nutrition: NutritionType;
}

export default function ProgressLineChart({ nutrition }: ProgressLineChartProps) {
  const screenWidth = Dimensions.get("window").width;

  const chartData = useMemo(() => {
    const measurements = nutrition.measurements || [];

    if (measurements.length === 0) return [];

    // Ordina per data e crea i dati per il grafico
    const sortedMeasurements = measurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedMeasurements.map((measurement, index) => ({
      value: measurement.weightKg || 0,
      label: new Date(measurement.date).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit"
      }),
      dataPointText: `${measurement.weightKg}kg`
    }));
  }, [nutrition]);

  if (chartData.length === 0) {
    return (
      <View className="bg-muted p-4 rounded-lg">
        <Text className="text-foreground/70 text-center">Dati insufficienti per il grafico di progresso</Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-lg font-semibold text-foreground mb-3">Andamento Peso nel Tempo</Text>
      <View className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
        <LineChart
          data={chartData}
          width={screenWidth - 100}
          height={200}
          color="#10b981"
          thickness={3}
          dataPointsColor="#10b981"
          dataPointsRadius={6}
          textColor="#374151"
          textFontSize={12}
          showValuesAsDataPointsText
          curved
          isAnimated
          animationDuration={1000}
          areaChart
          startFillColor="rgba(16, 185, 129, 0.3)"
          endFillColor="rgba(16, 185, 129, 0.1)"
          startOpacity={0.3}
          endOpacity={0.1}
          spacing={Math.max(40, (screenWidth - 140) / Math.max(chartData.length - 1, 1))}
          backgroundColor="transparent"
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisColor="#e5e7eb"
          xAxisColor="#e5e7eb"
          yAxisTextStyle={{ color: "#6b7280", fontSize: 10 }}
          xAxisLabelTextStyle={{ color: "#6b7280", fontSize: 10 }}
        />
      </View>
    </View>
  );
}
