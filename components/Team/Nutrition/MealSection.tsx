import { FoodItemType, MealType, SupplementationType } from "@/lib/zod/userSchemas";
import { Text, View } from "react-native";

interface MealSectionProps {
  meal: MealType | SupplementationType;
  isSupplementation?: boolean;
}

export default function MealSection({ meal, isSupplementation = false }: MealSectionProps) {
  const renderFoodItem = (item: FoodItemType, index: number) => (
    <View key={`${item._id}-${index}`} className="flex-row justify-between py-2 border-b border-secondary/50 last:border-b-0">
      <Text className="text-foreground font-medium flex-1 mr-2">{item.name}</Text>
      <Text className="text-foreground/70">
        {item.quantity} {item.unit}
      </Text>
    </View>
  );

  const renderSection = (title: string, items: FoodItemType[], emptyText: string) => {
    if (items.length === 0) return null;

    return (
      <View className="mb-4">
        <Text className="text-base font-semibold text-foreground mb-2">{title}</Text>
        <View className="bg-muted/30 rounded-lg p-3">{items.map((item, index) => renderFoodItem(item, index))}</View>
      </View>
    );
  };

  if (isSupplementation) {
    const suppMeal = meal as SupplementationType;
    return (
      <View>
        {renderSection("Integratori", suppMeal.supplements, "Nessun integratore")}
        {renderSection("Alternative", suppMeal.substitutes, "Nessuna alternativa")}
      </View>
    );
  }

  const regularMeal = meal as MealType;
  return (
    <View>
      {renderSection("Alimenti Principali", regularMeal.foods, "Nessun alimento")}
      {renderSection("Alternative", regularMeal.substitutes, "Nessuna alternativa")}
    </View>
  );
}
