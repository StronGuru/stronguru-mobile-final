import { BiaEntryType, MeasurementEntryType } from "@/lib/zod/userSchemas";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useMemo } from "react";
import { Text, View } from "react-native";

const formatDate = (d?: string) => {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString("it-IT");
};

const getLatest = <T, K extends keyof T>(arr?: T[], dateKey?: K) => {
  if (!arr?.length || !dateKey) return null;
  return (
    arr.filter(Boolean).sort((a, b) => {
      const da = new Date(String(a[dateKey])).getTime() || 0;
      const db = new Date(String(b[dateKey])).getTime() || 0;
      return db - da;
    })[0] || null
  );
};

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="w-[48%] mb-3">
      <Text className="text-md text-primary font-semibold">{label}</Text>
      <Text className="text-foreground text-lg font-semibold mt-1">{value ?? "—"}</Text>
    </View>
  );
}

interface LatestMeasuresCardProps {
  profileId?: string;
}

export default function LatestMeasuresCard({ profileId }: LatestMeasuresCardProps) {
  const { user } = useUserDataStore();

  const profileWithNutrition = useMemo(() => {
    if (!user?.profiles) return null;

    if (profileId) {
      // Usa il profileId specifico
      return user.profiles.find((p) => p._id === profileId && p.nutrition) || null;
    } else {
      // Fallback: primo con nutrition
      return user.profiles.find((p) => p.nutrition) || null;
    }
  }, [user?.profiles, profileId]);

  if (!profileWithNutrition?.nutrition) {
    return (
      <View className="bg-card p-4 rounded-lg my-6 mx-4 border border-secondary">
        <Text className="text-xl font-semibold text-foreground">Ultime misurazioni</Text>
        <Text className="text-sm text-foreground/70 mt-1">Nessun dato disponibile.</Text>
      </View>
    );
  }

  const { nutrition } = profileWithNutrition;
  const latestMeasurement = getLatest<MeasurementEntryType, "date">(nutrition.measurements, "date");
  const latestBia = getLatest<BiaEntryType, "examDate">(nutrition.bia, "examDate");

  return (
    <View className="bg-card p-4 rounded-lg my-6 shadow-sm border border-secondary">
      <Text className="text-2xl font-semibold text-primary">Ultime misurazioni</Text>
      <Text className="text-lg text-foreground mt-1">Qui trovi i valori principali delle ultime misurazioni rilevate dal tuo nutrizionista.</Text>

      <View className="mt-3 mb-3">
        <Text className="text-sm text-muted-foreground italic">
          Ultima misurazione: {formatDate(latestMeasurement?.date)} • Ultima BIA: {formatDate(latestBia?.examDate)}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <StatItem label="Peso" value={latestMeasurement?.weightKg ? `${latestMeasurement.weightKg} kg` : "—"} />
        <StatItem label="BMI" value={latestMeasurement?.bmi ?? "—"} />
        <StatItem label="Vita" value={latestMeasurement?.waistCm ? `${latestMeasurement.waistCm} cm` : "—"} />
        <StatItem label="Massa grassa" value={latestBia?.fatMassKg ? `${latestBia.fatMassKg} kg` : "—"} />
        <StatItem label="Massa magra" value={latestBia?.leanMassKg ? `${latestBia.leanMassKg} kg` : "—"} />
        <StatItem label="Metabolismo basale" value={latestBia?.basalMetabolismKg ? `${latestBia.basalMetabolismKg} kcal` : "—"} />
      </View>
    </View>
  );
}
