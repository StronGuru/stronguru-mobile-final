import { DietType } from "@/lib/zod/userSchemas";
import { useMemo, useState } from "react";
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

  const sortedWeeklyPlan = useMemo(() => {
    const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    return [...diet.weeklyPlan].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
  }, [diet.weeklyPlan]);

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
    return { text: "Attiva", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" };
  };

  const statusInfo = getDietStatus(diet.endDate, diet.status);

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Info Summary Card */}
      <View className="bg-card p-4 m-4 rounded-lg border border-secondary">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-semibold text-foreground">Informazioni Generali</Text>
          <View className={`px-3 py-1 rounded-full ${statusInfo.bg}`}>
            <Text className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.text}</Text>
          </View>
        </View>

        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-foreground/70">Durata:</Text>
            <Text className="text-foreground font-medium">{diet.duration} settimane</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground/70">Inizio:</Text>
            <Text className="text-foreground font-medium">{formatDate(diet.startDate)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground/70">Fine:</Text>
            <Text className="text-foreground font-medium">{formatDate(diet.endDate)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground/70">Tipo:</Text>
            <Text className="text-foreground font-medium">{diet.type}</Text>
          </View>
        </View>

        {diet.notes && diet.notes.trim() !== "" && (
          <View className="mt-3 pt-3 border-t border-secondary">
            <Text className="text-foreground/70 text-sm mb-1">Note:</Text>
            <Text className="text-foreground">{diet.notes}</Text>
          </View>
        )}
      </View>

      {/* Days Tabs */}
      <View className="px-4 mb-4">
        <Text className="text-xl font-semibold text-foreground mb-3">Piano Settimanale</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row space-x-2">
            {sortedWeeklyPlan.map((dayPlan) => (
              <TouchableOpacity
                key={dayPlan.day}
                onPress={() => setSelectedDay(dayPlan.day)}
                className={`px-4 py-2 rounded-full border ${selectedDay === dayPlan.day ? "bg-primary border-primary" : "bg-card border-secondary"}`}
              >
                <Text className={`font-medium ${selectedDay === dayPlan.day ? "text-primary-foreground" : "text-foreground"}`}>
                  {dayLabels[dayPlan.day as keyof typeof dayLabels]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Selected Day Plan */}
      {selectedDayPlan && <DayPlanView dayPlan={selectedDayPlan} />}
    </ScrollView>
  );
}
