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

  const weightChange = useMemo(() => {
    if (chartData.length < 2) return null;

    const firstWeight = chartData[0].value;
    const lastWeight = chartData[chartData.length - 1].value;

    if (firstWeight === 0) return null;

    const change = lastWeight - firstWeight;
    const percentageChange = (change / firstWeight) * 100;

    return {
      change: change,
      percentage: Math.abs(percentageChange),
      isIncrease: change > 0,
      isDecrease: change < 0,
      isStable: change === 0
    };
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <View className="bg-muted p-4 rounded-lg">
        <Text className="text-foreground text-center">Dati insufficienti per il grafico di progresso peso</Text>
      </View>
    );
  }

  const renderWeightChangeText = () => {
    if (!weightChange || chartData.length < 2) return null;

    if (weightChange.isStable) {
      return <Text className="text-center text-sm text-foreground mt-3">Peso stabile</Text>;
    }

    const changeText = weightChange.isDecrease ? "in diminuzione" : "in aumento";
    const changeColor = weightChange.isDecrease ? "text-accent" : "text-destructive";

    return (
      <View className="mt-3 items-center">
        <Text className="text-center text-sm text-foreground">
          Peso {changeText} del <Text className={`font-semibold ${changeColor}`}>{weightChange.percentage.toFixed(1)}%</Text>
        </Text>
        <Text className="text-center text-xs text-foreground mt-1">
          {weightChange.isDecrease ? "-" : "+"}
          {Math.abs(weightChange.change).toFixed(1)} kg rispetto alla prima misurazione
        </Text>
      </View>
    );
  };

  return (
    <View>
      <Text className="text-xl text-center font-semibold text-primary mb-3">Andamento Peso nel Tempo</Text>
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
          yAxisLabelSuffix=" kg"
          yAxisColor="#e5e7eb"
          xAxisColor="#e5e7eb"
          yAxisTextStyle={{ color: colorScheme === "dark" ? "white" : "#6b7280", fontSize: 13 }}
          xAxisLabelTextStyle={{ color: colorScheme === "dark" ? "white" : "#6b7280", fontSize: 13 }}
        />
      </View>

      {/* Testo variazione peso */}
      {renderWeightChangeText()}
    </View>
  );
}
