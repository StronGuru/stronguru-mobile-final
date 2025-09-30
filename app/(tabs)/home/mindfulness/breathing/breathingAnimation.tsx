import AppText from "@/components/ui/AppText";
import { useLocalSearchParams } from "expo-router";

import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";

export default function BreathingAnimationPreview() {
  const params = useLocalSearchParams();
  const configJson = params.config as string | undefined;

  const config = useMemo(() => {
    if (!configJson) return null;
    try {
      return JSON.parse(configJson);
    } catch {
      return null;
    }
  }, [configJson]);

  return (
    <ScrollView className="flex-1 px-4 py-6 bg-background" showsVerticalScrollIndicator={false}>
      <View className="p-4 bg-card rounded-lg">
        <AppText w="semi" className="text-xl mb-3">
          Preview Breathing Config
        </AppText>

        {config ? (
          <AppText className="text-sm" style={{ fontFamily: "monospace" }}>
            {JSON.stringify(config, null, 2)}
          </AppText>
        ) : (
          <AppText className="text-sm">Nessuna config ricevuta o formato non valido.</AppText>
        )}
      </View>
    </ScrollView>
  );
}
