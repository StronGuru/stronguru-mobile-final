import { useUserDataStore } from "@/src/store/userDataStore";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function NutritionSelector() {
  const { user } = useUserDataStore();

  const nutritionProfiles = useMemo(() => user?.profiles?.filter((p) => p.nutrition) || [], [user?.profiles]);

  const handleProfileSelect = (profileId: string) => {
    router.push(`/team/nutrition?profileId=${profileId}`);
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-foreground text-xl mb-8 mt-4">Hai più nutrizionisti. Di quale vuoi vedere i dati?</Text>

      <FlatList
        data={nutritionProfiles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleProfileSelect(item._id)}
            className="flex items-center bg-muted dark:bg-primary p-4 rounded-2xl mb-3 border border-secondary "
          >
            <Text className="text-lg font-semibold text-primary dark:text-card">
              {item.createdBy?.firstName} {item.createdBy?.lastName}
            </Text>

            {/* {item.createdBy?.specializations && <Text className="text-sm text-foreground mt-1">{item.createdBy.specializations.join(", ")}</Text>} */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
