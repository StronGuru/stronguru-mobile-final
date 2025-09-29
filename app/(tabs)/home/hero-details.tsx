import AppText from "@/components/ui/AppText";
import Card from "@/components/ui/Card";
import { HeroType } from "@/src/types/heroTypes";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { ExternalLink } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export default function HeroDetailsPage() {
  const { heroData } = useLocalSearchParams<{ heroData: string }>();
  const [hero, setHero] = useState<HeroType | null>(null);

  useEffect(() => {
    if (heroData) {
      try {
        const parsedHero = JSON.parse(heroData) as HeroType;
        console.log("✅ Hero details loaded:", parsedHero.detailTitle);
        setHero(parsedHero);
      } catch (error) {
        console.error("❌ Error parsing hero data:", error);
      }
    }
  }, [heroData]);

  const handleExternalLink = async () => {
    if (hero?.detailUrl) {
      try {
        const supported = await Linking.canOpenURL(hero.detailUrl);
        if (supported) {
          await Linking.openURL(hero.detailUrl);
        } else {
          console.error("Cannot open URL:", hero.detailUrl);
        }
      } catch (error) {
        console.error("Error opening URL:", error);
      }
    }
  };

  if (!hero) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <AppText className="text-red-500 text-center text-lg mb-4">Dettagli non disponibili</AppText>
        <TouchableOpacity className="bg-emerald-500 px-6 py-3 rounded-lg" onPress={() => router.back()}>
          <AppText className="text-white font-semibold">Torna indietro</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <View className=" rounded-3xl overflow-hidden shadow-sm my-4">
        <Image source={{ uri: hero.detailImage }} className="w-full h-80" resizeMode="cover" />
      </View>

      {hero.detailUrl && (
        <TouchableOpacity
          className="bg-primary rounded-full py-4 px-6 self-center flex-row items-center justify-center gap-3 shadow-sm mb-4"
          onPress={handleExternalLink}
        >
          <AppText w="semi" className="text-white text-xl">
            Info
          </AppText>
          <ExternalLink size={20} color="white" />
        </TouchableOpacity>
      )}

      <Card className="p-6 mb-5">
        <AppText w="semi" className="text-3xl mb-3">
          {hero.detailTitle}
        </AppText>

        <AppText className="text-lg">{hero.detailSubtitle}</AppText>
      </Card>
    </ScrollView>
  );
}
