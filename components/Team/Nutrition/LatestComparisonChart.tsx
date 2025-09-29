import AppText from "@/components/ui/AppText";
import { NutritionType } from "@/lib/zod/userSchemas";
import React, { useMemo } from "react";
import { Dimensions, ScrollView, Text, useColorScheme, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface LatestComparisonChartProps {
  nutrition: NutritionType;
}

export default function LatestComparisonChart({ nutrition }: LatestComparisonChartProps) {
  const screenWidth = Dimensions.get("window").width;
  const colorScheme = useColorScheme();

  const comparisonData = useMemo(() => {
    const measurements = nutrition.measurements || [];

    if (measurements.length < 2) return null;

    // Ordina per data e prendi le ultime due
    const sortedMeasurements = measurements
      .filter((m) => Object.values(m).some((val) => val !== null && val !== undefined))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2);

    if (sortedMeasurements.length < 2) return null;

    const latest = sortedMeasurements[0];
    const previous = sortedMeasurements[1];

    // Definisci le metriche da confrontare
    const metrics = [
      { key: "neckCm", label: "Collo", latest: latest.neckCm || 0, previous: previous.neckCm || 0 },
      { key: "shouldersCm", label: "Spalle", latest: latest.shouldersCm || 0, previous: previous.shouldersCm || 0 },
      { key: "chestCm", label: "Petto", latest: latest.chestCm || 0, previous: previous.chestCm || 0 },
      { key: "waistCm", label: "Vita", latest: latest.waistCm || 0, previous: previous.waistCm || 0 },
      { key: "abdomenCm", label: "Addome", latest: latest.abdomenCm || 0, previous: previous.abdomenCm || 0 },
      { key: "armCm", label: "Braccio", latest: latest.armCm || 0, previous: previous.armCm || 0 },
      { key: "hipsCm", label: "Fianchi", latest: latest.hipsCm || 0, previous: previous.hipsCm || 0 },
      { key: "glutesCm", label: "Glutei", latest: latest.glutesCm || 0, previous: previous.glutesCm || 0 },
      { key: "thighCm", label: "Coscia", latest: latest.thighCm || 0, previous: previous.thighCm || 0 },
      { key: "calfCm", label: "Polpaccio", latest: latest.calfCm || 0, previous: previous.calfCm || 0 }
    ].filter((m) => m.latest > 0 && m.previous > 0);

    if (metrics.length < 3) return null;

    // Calcola le statistiche
    const improvements = metrics.filter((m) => m.latest < m.previous).length;
    const worsenings = metrics.filter((m) => m.latest > m.previous).length;
    const unchanged = metrics.filter((m) => Math.abs(m.latest - m.previous) < 0.5).length;

    // Prepara i dati per il BarChart raggruppato
    const barData = metrics.flatMap((metric, index) => [
      {
        value: metric.previous,
        label: metric.label,
        spacing: 2,
        labelWidth: 60,
        labelTextStyle: { color: colorScheme === "dark" ? "white" : "#10b981", fontSize: 13, textAlign: "center" as const },
        frontColor: "#bbf7d0",
        topLabelComponent: () => <Text style={{ color: "#94a3b8", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>{metric.previous}</Text>
      },
      {
        value: metric.latest,
        frontColor: "#10b981",
        topLabelComponent: () => <Text style={{ color: "#10b981", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>{metric.latest}</Text>
      }
    ]);

    return {
      barData,
      metrics,
      latestDate: new Date(latest.date).toLocaleDateString("it-IT"),
      previousDate: new Date(previous.date).toLocaleDateString("it-IT"),
      improvements,
      worsenings,
      unchanged
    };
  }, [nutrition, colorScheme]);

  if (!comparisonData) {
    return (
      <View className=" p-4 rounded-lg">
        <AppText className="text-lg text-muted-foreground text-center">Servono almeno 2 misurazioni complete per il grafico di confronto</AppText>
      </View>
    );
  }

  return (
    <View>
      <AppText w="semi" className="text-xl text-primary mb-0 text-center">
        Confronto Misurazioni
      </AppText>
      <AppText className="text-md  mb-4 text-center">
        {comparisonData.previousDate} vs {comparisonData.latestDate}
      </AppText>

      {/* Legenda */}
      <View className="flex-row justify-center gap-3 ">
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-[#bbf7d0] rounded mr-2" />
          <AppText className="text-md ">Precedente</AppText>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-primary rounded mr-2" />
          <AppText className="text-md ">Ultima</AppText>
        </View>
      </View>

      {/* BarChart orizzontale scrollabile */}
      <View className="my-7 mr-4 rounded-lg">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={comparisonData.barData}
            width={Math.max(screenWidth - 80, comparisonData.metrics.length * 80)}
            height={200}
            barWidth={25}
            spacing={15}
            roundedTop
            isAnimated
            animationDuration={1000}
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisColor="#e5e7eb"
            xAxisColor="#e5e7eb"
            yAxisTextStyle={{ color: colorScheme === "dark" ? "white" : "#6b7280", fontSize: 13 }}
            noOfSections={4}
            backgroundColor="transparent"
            showYAxisIndices
            yAxisIndicesColor="#e5e7eb"
          />
        </ScrollView>
      </View>

      {/* Statistiche riassuntive */}
      <View className="flex-row justify-around mb-2 dark:bg-muted p-1 pb-2 rounded-lg">
        <View className="items-center">
          <AppText w="semi" className="text-primary text-2xl">
            {comparisonData.improvements}
          </AppText>
          <AppText className="text-md">Miglioramenti</AppText>
        </View>
        <View className="items-center">
          <AppText w="semi" className="text-muted-foreground text-2xl">
            {comparisonData.unchanged}
          </AppText>
          <AppText className="text-md">Stabili</AppText>
        </View>
        <View className="items-center">
          <AppText w="semi" className="text-destructive text-2xl">
            {comparisonData.worsenings}
          </AppText>
          <AppText className="text-md">Peggioramenti</AppText>
        </View>
      </View>

      {/* Dettaglio variazioni più significative */}
      {/* <View className="mt-4">
        <Text className="text-base font-semibold text-foreground mb-3">Variazioni Più Significative</Text>
        {comparisonData.metrics
          .sort((a, b) => Math.abs(b.latest - b.previous) - Math.abs(a.latest - a.previous))
          .slice(0, 3)
          .map((item, index) => {
            const change = item.latest - item.previous;
            const changePercent = item.previous > 0 ? ((change / item.previous) * 100).toFixed(1) : "0.0";
            const changeColor = change > 0 ? "text-red-600" : change < 0 ? "text-green-600" : "text-gray-500";
            const bgColor = change > 0 ? "bg-red-50 dark:bg-red-900/20" : change < 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-900/20";

            return (
              <View key={index} className={`p-4 rounded-lg mb-2 ${bgColor}`}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-medium text-foreground">{item.label}</Text>
                  <Text className={`text-lg font-bold ${changeColor}`}>
                    {change > 0 ? "+" : ""}
                    {change.toFixed(1)}cm
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-sm text-foreground/70">
                    {item.previous}cm → {item.latest}cm
                  </Text>
                  <Text className={`text-sm font-semibold ${changeColor}`}>
                    {change > 0 ? "+" : ""}
                    {changePercent}%
                  </Text>
                </View>
              </View>
            );
          })}
      </View> */}
    </View>
  );
}
