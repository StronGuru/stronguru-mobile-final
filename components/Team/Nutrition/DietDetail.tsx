import { DietType } from "@/lib/zod/userSchemas";
import { getAutoSelectedDay } from "@/utils/mealUtils";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import DayPlanView from "./DayPlanView";

interface DietDetailProps {
  diet: DietType;
}

const dayLabels = {
  monday: "Lunedì",
  tuesday: "Martedì",
  wednesday: "Mercoledì",
  thursday: "Giovedì",
  friday: "Venerdì",
  saturday: "Sabato",
  sunday: "Domenica"
};

export default function DietDetail({ diet }: DietDetailProps) {
  const [selectedDay, setSelectedDay] = useState<string>("monday");
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  const sortedWeeklyPlan = useMemo(() => {
    const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    return [...diet.weeklyPlan].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
  }, [diet.weeklyPlan]);

  // Auto-selezione del giorno all'apertura
  useEffect(() => {
    if (!hasAutoSelected && diet.weeklyPlan.length > 0) {
      const weeklyPlanMap = diet.weeklyPlan.reduce((acc, dayPlan) => {
        acc[dayPlan.day] = dayPlan;
        return acc;
      }, {} as any);

      const autoSelectedDay = getAutoSelectedDay(weeklyPlanMap);
      setSelectedDay(autoSelectedDay);
      setHasAutoSelected(true);

      // Scroll orizzontale basato sull'indice del giorno
      setTimeout(() => scrollToSelectedDay(autoSelectedDay), 300);
    }
  }, [diet.weeklyPlan, hasAutoSelected]);

  const scrollToSelectedDay = (dayKey: string) => {
    if (!horizontalScrollRef.current) return;

    const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayIndex = dayOrder.indexOf(dayKey);

    if (dayIndex === -1) return;

    // Da venerdì in poi, scrolla alla fine. Lun-Gio non servono scroll
    if (dayIndex >= 4) {
      horizontalScrollRef.current.scrollToEnd({ animated: true });
    }
    // Lun-Gio: niente scroll, sono già visibili
  };

  const handleDayPress = (dayKey: string) => {
    setSelectedDay(dayKey);
    setHasAutoSelected(true);
    scrollToSelectedDay(dayKey);
  };

  const selectedDayPlan = useMemo(() => sortedWeeklyPlan.find((day) => day.day === selectedDay), [sortedWeeklyPlan, selectedDay]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getDietStatus = (endDate: string, status: boolean) => {
    const end = new Date(endDate);
    const now = new Date();

    if (!status) return { text: "Sospesa", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20" };
    if (end < now) return { text: "Scaduta", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20" };
    return { text: "Attiva", color: "text-primary", bg: "bg-green-100 dark:bg-secondary" };
  };

  const statusInfo = getDietStatus(diet.endDate, diet.status);

  const weeklyPlanMap = useMemo(() => {
    return diet.weeklyPlan.reduce((acc, dayPlan) => {
      acc[dayPlan.day] = dayPlan;
      return acc;
    }, {} as any);
  }, [diet.weeklyPlan]);

  return (
    <ScrollView ref={scrollViewRef} className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Info Summary Card */}
      <View className="bg-card shadow-sm p-4 m-4 mt-7 rounded-lg border border-card dark:border-secondary">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-xl font-semibold text-primary">{diet.name}</Text>
            <Text className="text-md text-foreground font-medium">{diet.goal}</Text>
          </View>
          <View className={`px-4 py-1 rounded-full ${statusInfo.bg}`}>
            <Text className={`text-lg font-medium ${statusInfo.color}`}>{statusInfo.text}</Text>
          </View>
        </View>

        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-foreground font-semibold">Durata:</Text>
            <Text className="text-foreground font-light">{diet.duration} settimane</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground font-semibold">Inizio:</Text>
            <Text className="text-foreground font-light">{formatDate(diet.startDate)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground font-semibold">Fine:</Text>
            <Text className="text-foreground font-light">{formatDate(diet.endDate)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground font-semibold">Tipo:</Text>
            <Text className="text-foreground font-light">{diet.type}</Text>
          </View>
        </View>

        {diet.notes && diet.notes.trim() !== "" && (
          <View className="mt-3 pt-3 border-t border-secondary">
            <Text className="text-foreground text-md font-semibold mb-1">Note:</Text>
            <Text className="text-foreground italic">{diet.notes}</Text>
          </View>
        )}
      </View>

      {/* Days Tabs */}
      <View className="px-4 mb-4">
        <ScrollView ref={horizontalScrollRef} horizontal showsHorizontalScrollIndicator={false} className="mb-2 mt-2">
          <View className="flex-row p-1">
            {sortedWeeklyPlan.map((dayPlan) => (
              <TouchableOpacity
                key={dayPlan.day}
                onPress={() => handleDayPress(dayPlan.day)}
                className={`px-3 py-2 mr-2 shadow-sm rounded-xl border ${selectedDay === dayPlan.day ? "bg-primary border-primary" : "bg-card border-card"}`}
              >
                <Text className={`font-medium text-lg ${selectedDay === dayPlan.day ? "text-primary-foreground" : "text-foreground"}`}>
                  {dayLabels[dayPlan.day as keyof typeof dayLabels]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Selected Day Plan */}
      {selectedDayPlan && <DayPlanView dayPlan={selectedDayPlan} weeklyPlan={weeklyPlanMap} scrollViewRef={scrollViewRef} />}
    </ScrollView>
  );
}
