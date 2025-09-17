import { MealType, SupplementationType, WeeklyPlanItemType } from "@/lib/zod/userSchemas";
import { Apple, ChevronDown, ChevronUp, Coffee, Cookie, Moon, Pill, UtensilsCrossed } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MealSection from "./MealSection";

interface DayPlanViewProps {
  dayPlan: WeeklyPlanItemType;
}

const mealLabels = {
  breakfast: { label: "Colazione", Icon: Coffee, time: "07:00 - 09:00" },
  morningSnack: { label: "Spuntino Mattina", Icon: Apple, time: "10:00 - 11:00" },
  lunch: { label: "Pranzo", Icon: UtensilsCrossed, time: "12:00 - 14:00" },
  afternoonSnack: { label: "Spuntino Pomeriggio", Icon: Cookie, time: "16:00 - 17:00" },
  dinner: { label: "Cena", Icon: Moon, time: "19:00 - 21:00" },
  supplementation: { label: "Integratori", Icon: Pill, time: "Durante il giorno" }
};

export default function DayPlanView({ dayPlan }: DayPlanViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const hasMealContent = (meal: MealType) => {
    return meal.foods.length > 0 || meal.substitutes.length > 0;
  };

  const hasSupplementContent = (supp: SupplementationType) => {
    return supp.supplements.length > 0 || supp.substitutes.length > 0;
  };

  const renderMealAccordion = (mealKey: keyof typeof mealLabels, meal: MealType | SupplementationType, isSupplementation = false) => {
    const mealInfo = mealLabels[mealKey];
    const isExpanded = expandedSections.has(mealKey);
    const hasContent = isSupplementation ? hasSupplementContent(meal as SupplementationType) : hasMealContent(meal as MealType);

    if (!hasContent) {
      return (
        <View key={mealKey} className="bg-muted/30 p-4 rounded-lg mb-3 border border-secondary opacity-50">
          <View className="flex-row items-center">
            <mealInfo.Icon size={24} color="#9ca3af" className="mr-3" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground/70">{mealInfo.label}</Text>
              <Text className="text-sm text-foreground/50">{mealInfo.time}</Text>
            </View>
            <Text className="text-foreground/50 text-sm">Non definito</Text>
          </View>
        </View>
      );
    }

    return (
      <View key={mealKey} className="bg-card p-4 rounded-lg mb-3 border border-secondary">
        <TouchableOpacity onPress={() => toggleSection(mealKey)} className="flex-row items-center">
          <mealInfo.Icon size={24} color="#10b981" className="mr-3" />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{mealInfo.label}</Text>
            <Text className="text-sm text-foreground/70">{mealInfo.time}</Text>
          </View>
          {isExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
        </TouchableOpacity>

        {isExpanded && (
          <View className="mt-4 pt-4 border-t border-secondary">
            <MealSection meal={meal} isSupplementation={isSupplementation} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="px-4 pb-8">
      {renderMealAccordion("breakfast", dayPlan.plan.breakfast)}
      {renderMealAccordion("morningSnack", dayPlan.plan.morningSnack)}
      {renderMealAccordion("lunch", dayPlan.plan.lunch)}
      {renderMealAccordion("afternoonSnack", dayPlan.plan.afternoonSnack)}
      {renderMealAccordion("dinner", dayPlan.plan.dinner)}
      {renderMealAccordion("supplementation", dayPlan.plan.supplementation, true)}
    </View>
  );
}
