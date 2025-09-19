import { useUserDataStore } from "@/src/store/userDataStore";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function TrainingSelector() {
  const { user } = useUserDataStore();

  const trainingProfiles = useMemo(() => user?.profiles?.filter((p) => p.training) || [], [user?.profiles]);

  const handleProfileSelect = (profileId: string) => {
    router.push(`/team/training?profileId=${profileId}`);
  };

  return (
    <View className="flex-1 bg-background p-4 justify-center items-center">
      <View className="w-full max-w-sm">
        <Text className="text-primary font-semibold text-2xl text-center mb-1 ">Hai più allenatori nel tuo team.</Text>
        <Text className="text-foreground text-xl text-center mb-8">I dati di quale allenatore vuoi vedere?</Text>

        <FlatList
          data={trainingProfiles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="shadow-sm px-1">
              <TouchableOpacity
                onPress={() => handleProfileSelect(item._id)}
                className="flex items-center bg-muted dark:bg-primary p-4 rounded-2xl mb-3 border border-secondary "
              >
                <Text className="text-lg font-semibold text-primary dark:text-card">
                  {item.createdBy?.firstName} {item.createdBy?.lastName}
                </Text>
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
