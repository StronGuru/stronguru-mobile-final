import { DietType } from "@/lib/zod/userSchemas";
import { router } from "expo-router";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface DietElementCardProps {
  diet: DietType;
  profileId: string;
  variant?: "latest" | "list";
}

export default function DietElementCard({ diet, profileId, variant = "list" }: DietElementCardProps) {
  const handlePress = () => {
    router.push(`/team/nutrition/diet/${diet._id}?profileId=${profileId}`);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const sameYear = start.getFullYear() === end.getFullYear();

    const startOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: sameYear ? undefined : "numeric"
    };

    const endOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric"
    };

    return `${start.toLocaleDateString("it-IT", startOptions)} - ${end.toLocaleDateString("it-IT", endOptions)}`;
  };

  const getDietStatus = (endDate: string, status: boolean) => {
    const end = new Date(endDate);
    const now = new Date();

    if (!status)
      return {
        text: "Sospesa",
        color: "text-orange-600",
        Icon: AlertCircle,
        iconColor: "#ea580c"
      };
    if (end < now)
      return {
        text: "Scaduta",
        color: "text-red-600",
        Icon: XCircle,
        iconColor: "#dc2626"
      };
    return {
      text: "Attiva",
      color: "text-green-600",
      Icon: CheckCircle,
      iconColor: "#16a34a"
    };
  };

  const statusInfo = getDietStatus(diet.endDate, diet.status);
  const isLatest = variant === "latest";

  return (
    <View className={`bg-muted p-4 shadow-sm rounded-lg border border-secondary `}>
      {/* Header con titolo e status */}
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-1 mr-3">
          <Text className={`font-semibold ${isLatest ? "text-lg" : "text-base"} text-foreground`}>{diet.name}</Text>
          <View className="flex-row items-center">
            <statusInfo.Icon size={16} color={statusInfo.iconColor} />
            <Text className={`text-sm ${statusInfo.color} font-medium ms-1`}>{statusInfo.text}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handlePress} className="bg-primary px-4 py-2 rounded-lg">
          <Text className="text-primary-foreground font-medium text-sm">Vedi Dieta</Text>
        </TouchableOpacity>
      </View>

      {/* Info secondarie */}
      <View className="mt-2 gap-1">
        <Text className="text-sm text-foreground text-wrap italic">{formatDateRange(diet.startDate, diet.endDate)}</Text>
        <Text className="text-sm font-semibold text-foreground">
          {diet.goal} • {diet.type}
        </Text>
        <Text className="text-sm text-primary font-semibold">{diet.duration} settimane</Text>
      </View>
    </View>
  );
}
