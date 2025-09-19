import Card from "@/components/ui/Card";
import { TrainingPlanType } from "@/lib/zod/userSchemas";
import { ChevronDown, ChevronUp, Clock, Dumbbell, FileText, Flame, RotateCw, Route, Shuffle, Weight, Zap } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface TrainingPlanDetailProps {
  trainingPlan: TrainingPlanType;
}

const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

export default function TrainingPlanDetail({ trainingPlan }: TrainingPlanDetailProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const colorScheme = useColorScheme();

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
        <Card key={`exercise-${index}`} className="mt-4">
          {/* Header */}
          <View className="flex-row items-center mb-2 px-2 rounded-md">
            <Dumbbell size={18} color="#10b981" />
            <Text className="font-semibold text-primary ml-2 text-base">{exercise.name}</Text>
          </View>

          {/* Dettagli */}
          <View className=" flex-row flex-wrap px-1 py-1 mb-2 gap-1 rounded-md">
            <View className="flex-row items-center mb-1">
              <Flame size={16} color="#f97316" />
              <Text className="text-md  text-foreground ml-1">Sets: {exercise.sets}</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Shuffle size={16} color="#3b82f6" />
              <Text className="text-md  text-foreground ml-1">Reps: {exercise.reps}</Text>
            </View>
            {exercise.rest && (
              <View className="flex-row items-center mb-1">
                <Clock size={16} color="#10b981" />
                <Text className="text-md  text-foreground ml-1">Rest: {exercise.rest}</Text>
              </View>
            )}
            {exercise.weight && (
              <View className="flex-row items-center mb-1">
                <Weight size={16} color="#6b7280" />
                <Text className="text-md  text-foreground ml-1">Peso: {exercise.weight}</Text>
              </View>
            )}
            {exercise.distance && (
              <View className="flex-row items-center mb-1">
                <Route size={16} color="#6b7280" />
                <Text className="text-md  text-foreground ml-1">Distanza: {exercise.distance}</Text>
              </View>
            )}
            {exercise.intensity && (
              <View className="flex-row items-center mb-1">
                <Zap size={16} color="#facc15" />
                <Text className="text-md  text-foreground ml-1">Intensità: {exercise.intensity}</Text>
              </View>
            )}
            {exercise.duration && (
              <View className="flex-row items-center mb-1">
                <Clock size={16} color="#6b7280" />
                <Text className="text-md  text-foreground ml-1">Durata: {exercise.duration}</Text>
              </View>
            )}
          </View>

          {/* Note */}
          {exercise.notes && (
            <View className="bg-gray-100 dark:bg-muted p-3 rounded-md flex-row items-start">
              <FileText size={16} color="#6b7280" />
              <Text className="text-sm text-wrap text-muted-foreground  ml-2 italic">{exercise.notes}</Text>
            </View>
          )}
        </Card>
      );
    } else if (content.type === "circuit") {
      const circuit = content.data;
      return (
        <Card key={`circuit-${index}`} className="bg-muted border-2 border-secondary dark:border-accent p-4 mt-4">
          {/* Header */}
          <View className="flex-row items-center mb-3 bg-green-100 dark:bg-ring p-2 rounded-md">
            <RotateCw size={18} color={colorScheme === "dark" ? "#1e293b" : "#10b981"} />
            <Text className="font-bold text-primary dark:text-card ml-2 text-base">{circuit.name}</Text>
          </View>

          {/* Dettagli del circuito */}
          <View className="flex-row gap-2 p-2 justify-center rounded-md mb-3">
            <View className="flex-row items-center mb-2">
              <Flame size={16} color="#f97316" />
              <Text className="text-md font-medium text-foreground ml-2">Sets: {circuit.sets}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Clock size={16} color="#10b981" />
              <Text className="text-md font-medium text-foreground ml-2">Rest: {circuit.rest}</Text>
            </View>
          </View>

          {/* Esercizi nel circuito */}
          {circuit.exercises &&
            circuit.exercises.map((exercise: any, exIndex: number) => (
              <Card key={exIndex} className="border border-secondary p-3 mb-2">
                {/* Header */}
                <View className="flex-row items-center mb-2">
                  <Dumbbell size={16} color="#10b981" />
                  <Text className="text-md font-semibold text-primary ml-2">{exercise.name}</Text>
                </View>

                {/* Dettagli */}
                <View className="flex-row flex-wrap gap-2">
                  <View className="flex-row items-center">
                    <Flame size={14} color="#f97316" />
                    <Text className="text-md text-foreground ml-1">Sets: {exercise.sets}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Shuffle size={14} color="#3b82f6" />
                    <Text className="text-md text-foreground ml-1">Reps: {exercise.reps}</Text>
                  </View>
                  {exercise.rest && (
                    <View className="flex-row items-center">
                      <Clock size={14} color="#10b981" />
                      <Text className="text-md text-foreground ml-1">Rest: {exercise.rest}</Text>
                    </View>
                  )}
                  {exercise.weight && (
                    <View className="flex-row items-center">
                      <Weight size={14} color="#6b7280" />
                      <Text className="text-md text-foreground ml-1">Peso: {exercise.weight}</Text>
                    </View>
                  )}
                  {exercise.distance && (
                    <View className="flex-row items-center">
                      <Route size={14} color="#6b7280" />
                      <Text className="text-md text-foreground ml-1">Distanza: {exercise.distance}</Text>
                    </View>
                  )}
                  {exercise.intensity && (
                    <View className="flex-row items-center">
                      <Zap size={14} color="#facc15" />
                      <Text className="text-md text-foreground ml-1">Intensità: {exercise.intensity}</Text>
                    </View>
                  )}
                  {exercise.duration && (
                    <View className="flex-row items-center">
                      <Clock size={14} color="#6b7280" />
                      <Text className="text-md text-foreground ml-1">Durata: {exercise.duration}</Text>
                    </View>
                  )}
                </View>

                {/* Note */}
                {exercise.notes && (
                  <View className="bg-gray-100 dark:bg-muted p-3 mt-2 rounded-md flex-row items-start">
                    <FileText size={16} color="#6b7280" />
                    <Text className="text-sm text-wrap text-muted-foreground  ml-2 italic">{exercise.notes}</Text>
                  </View>
                )}
              </Card>
            ))}
        </Card>
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
          className="bg-card border border-border shadow-sm rounded-lg p-4 flex-row justify-between items-center"
        >
          <Text className="font-semibold text-xl text-foreground dark:text-primary">{day.dayNumber}</Text>
          <View className="flex-row items-center">
            <Text className="text-md text-muted-foreground dark:text-foreground mr-2">
              {exerciseCount} esercizi • {circuitCount} circuiti
            </Text>
            {isExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#10b981" />}
          </View>
        </TouchableOpacity>

        {isExpanded && <View className="">{day.contents.map((content: any, index: number) => renderExercise(content, index))}</View>}
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
