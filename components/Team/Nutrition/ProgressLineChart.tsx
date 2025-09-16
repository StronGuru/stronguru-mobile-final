import { NutritionType } from "@/lib/zod/userSchemas";
import React, { useMemo } from "react";
import { Dimensions, Text, useColorScheme, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface ProgressLineChartProps {
  nutrition: NutritionType;
}

export default function ProgressLineChart({ nutrition }: ProgressLineChartProps) {
  const screenWidth = Dimensions.get("window").width;
  const colorScheme = useColorScheme();

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
      <View className="p-2 rounded-lg">
        <LineChart
          data={chartData}
          width={screenWidth - 130}
          height={200}
          color="#10b981"
          thickness={2}
          dataPointsColor="#10b981"
          dataPointsRadius={3}
          textColor={colorScheme === "dark" ? "white" : "#6b7280"}
          textFontSize={13}
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
          yAxisTextStyle={{ color: colorScheme === "dark" ? "white" : "#6b7280", fontSize: 13 }}
          xAxisLabelTextStyle={{ color: colorScheme === "dark" ? "white" : "#6b7280", fontSize: 13 }}
        />
      </View>
    </View>
  );
}
