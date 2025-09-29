import AppText from "@/components/ui/AppText";
import { useUserDataStore } from "@/src/store/userDataStore";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

export default function NutritionSelector() {
  const { user } = useUserDataStore();

  const nutritionProfiles = useMemo(() => user?.profiles?.filter((p) => p.nutrition) || [], [user?.profiles]);

  const handleProfileSelect = (profileId: string) => {
    router.push(`/team/nutrition?profileId=${profileId}`);
  };

  return (
    <View className="flex-1 bg-background p-4 justify-center items-center">
      <View className="w-full max-w-sm">
        <AppText w="semi" className="text-primary  text-2xl text-center mb-1 ">
          Hai più nutrizionisti nel tuo team.
        </AppText>
        <AppText className="text-xl text-center mb-8">I dati di quale nutrizionista vuoi vedere?</AppText>

        <FlatList
          data={nutritionProfiles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="shadow-sm px-1">
              <TouchableOpacity
                onPress={() => handleProfileSelect(item._id)}
                className="flex items-center bg-muted dark:bg-primary p-4 rounded-2xl mb-3 border border-secondary "
              >
                <AppText className="text-lg text-primary dark:text-card">
                  {item.createdBy?.firstName} {item.createdBy?.lastName}
                </AppText>

                {/* {item.createdBy?.specializations && <Text className="text-sm text-foreground mt-1">{item.createdBy.specializations.join(", ")}</Text>} */}
              </TouchableOpacity>
            </View>
          )}
          className="w-full"
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}
