import { TrainingPlanType } from "@/lib/zod/userSchemas";
import { ChevronDown, ChevronUp, Clock, Hash, Repeat, Target, Weight } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface TrainingPlanDetailProps {
  trainingPlan: TrainingPlanType;
}

const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

export default function TrainingPlanDetail({ trainingPlan }: TrainingPlanDetailProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const toggleDay = (weekNumber: number, dayNumber: string) => {
    const dayId = `${weekNumber}-${dayNumber}`;
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  const renderExercise = (content: any, index: number) => {
    if (content.type === "exercise") {
      const exercise = content.data;
      return (
        <View key={`exercise-${index}`} className="bg-secondary/50 p-3 rounded-lg mb-2">
          <Text className="font-semibold text-foreground mb-2">{exercise.name}</Text>

          <View className="flex-row flex-wrap gap-4 mb-2">
            <View className="flex-row items-center">
              <Hash size={14} color="#6b7280" />
              <Text className="text-sm text-muted-foreground ml-1">{exercise.sets} serie</Text>
            </View>
            <View className="flex-row items-center">
              <Target size={14} color="#6b7280" />
              <Text className="text-sm text-muted-foreground ml-1">{exercise.reps}</Text>
            </View>
            {exercise.weight && (
              <View className="flex-row items-center">
                <Weight size={14} color="#6b7280" />
                <Text className="text-sm text-muted-foreground ml-1">{exercise.weight}</Text>
              </View>
            )}
            <View className="flex-row items-center">
              <Clock size={14} color="#6b7280" />
              <Text className="text-sm text-muted-foreground ml-1">{exercise.rest}</Text>
            </View>
          </View>

          {exercise.notes && <Text className="text-sm text-muted-foreground mt-2 italic">{exercise.notes}</Text>}
        </View>
      );
    } else if (content.type === "circuit") {
      const circuit = content.data;
      return (
        <View key={`circuit-${index}`} className="bg-primary/10 p-3 rounded-lg mb-2">
          <Text className="font-semibold text-primary mb-2">🔄 {circuit.name}</Text>
          <View className="flex-row items-center mb-2">
            <Repeat size={14} color="#10b981" />
            <Text className="text-sm text-primary ml-1">{circuit.sets} giri</Text>
            <Clock size={14} color="#10b981" className="ml-4" />
            <Text className="text-sm text-primary ml-1">{circuit.rest}</Text>
          </View>

          {circuit.exercises &&
            circuit.exercises.map((exercise: any, exIndex: number) => (
              <View key={exIndex} className="bg-background/50 p-2 rounded mb-1 ml-4">
                <Text className="text-sm font-medium text-foreground">{exercise.name}</Text>
                <View className="flex-row flex-wrap gap-2 mt-1">
                  <Text className="text-xs text-muted-foreground">
                    {exercise.sets} x {exercise.reps}
                  </Text>
                  {exercise.weight && <Text className="text-xs text-muted-foreground">• {exercise.weight}</Text>}
                  {exercise.distance && <Text className="text-xs text-muted-foreground">• {exercise.distance}</Text>}
                  {exercise.intensity && <Text className="text-xs text-muted-foreground">• {exercise.intensity}</Text>}
                  {exercise.duration && <Text className="text-xs text-muted-foreground">• {exercise.duration}</Text>}
                </View>
                {exercise.notes && (
                  <Text className="text-xs text-muted-foreground mt-1 italic" numberOfLines={2}>
                    {exercise.notes}
                  </Text>
                )}
              </View>
            ))}
        </View>
      );
    }
    return null;
  };

  const renderDay = (day: any, weekNumber: number) => {
    const dayId = `${weekNumber}-${day.dayNumber}`;
    const isExpanded = expandedDays.has(dayId);

    const exerciseCount = day.contents.filter((content: any) => content.type === "exercise").length;
    const circuitCount = day.contents.filter((content: any) => content.type === "circuit").length;

    return (
      <View key={day.dayNumber} className="mb-3 px-4">
        <TouchableOpacity
          onPress={() => toggleDay(weekNumber, day.dayNumber)}
          className="bg-card border border-border shadow-sm rounded-lg p-3 flex-row justify-between items-center"
        >
          <Text className="font-semibold text-foreground">{day.dayNumber}</Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground mr-2">
              {exerciseCount} esercizi • {circuitCount} circuiti
            </Text>
            {isExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#10b981" />}
          </View>
        </TouchableOpacity>

        {isExpanded && <View className="mt-2 ml-4">{day.contents.map((content: any, index: number) => renderExercise(content, index))}</View>}
      </View>
    );
  };

  const renderWeek = (week: any) => {
    if (week.weekNumber !== selectedWeek) return null;

    return (
      <View key={week.weekNumber} className="mb-4">
        {week.days.map((day: any) => renderDay(day, week.weekNumber))}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Info Summary Card */}
      <View className="bg-card shadow-sm p-4 m-4 mt-7 rounded-lg border border-card dark:border-secondary">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-xl font-semibold text-primary">{trainingPlan.planName}</Text>
            <Text className="text-md text-foreground font-medium">{trainingPlan.goal}</Text>
          </View>
        </View>

        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-foreground font-semibold">Durata:</Text>
            <Text className="text-foreground font-light">{trainingPlan.weeklyPlanning?.length || 0} settimane</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground font-semibold">Sport:</Text>
            <Text className="text-foreground font-light">{trainingPlan.sportActivity || "Non specificato"}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground font-semibold">Livello:</Text>
            <Text className="text-foreground font-light">{trainingPlan.level || "Non specificato"}</Text>
          </View>
        </View>
        {trainingPlan.description && trainingPlan.description.trim() !== "" && (
          <View className="mt-3 pt-3 border-t border-secondary">
            <Text className="text-foreground text-md font-semibold mb-1">Descrizione:</Text>
            <Text className="text-foreground italic">{trainingPlan.description}</Text>
          </View>
        )}
      </View>

      {/* Weeks Tabs */}
      <View className="px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2 mt-2">
          <View className="flex-row p-1">
            {trainingPlan.weeklyPlanning?.map((week) => (
              <TouchableOpacity
                key={week.weekNumber}
                onPress={() => setSelectedWeek(week.weekNumber)}
                className={`px-3 py-2 mr-2 shadow-sm rounded-xl border ${
                  selectedWeek === week.weekNumber ? "bg-primary border-primary" : "bg-card border-card"
                }`}
              >
                <Text className={`font-medium text-lg ${selectedWeek === week.weekNumber ? "text-primary-foreground" : "text-foreground"}`}>
                  {weekLabels[week.weekNumber - 1] || `Settimana ${week.weekNumber}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Selected Week */}
      {trainingPlan.weeklyPlanning?.map((week) => renderWeek(week))}
    </ScrollView>
  );
}
