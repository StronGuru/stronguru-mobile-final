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
      color: "text-primary",
      Icon: CheckCircle,
      iconColor: "#10b981"
    };
  };

  const statusInfo = getDietStatus(diet.endDate, diet.status);

  return (
    <View className={`bg-muted p-4 shadow-sm rounded-lg border border-card dark:border-secondary`}>
      {/* Header con titolo e status */}
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-1 mr-3">
          <Text className={`font-semibold text-xl text-foreground`}>{diet.name}</Text>
          <View className="flex-row items-center">
            <statusInfo.Icon size={16} color={statusInfo.iconColor} />
            <Text className={`text-sm ${statusInfo.color} font-medium text-xl ms-1`}>{statusInfo.text}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handlePress} className="bg-primary px-5 py-3 rounded-lg">
          <Text className="text-primary-foreground font-medium text-md">Mostra</Text>
        </TouchableOpacity>
      </View>

      {/* Info secondarie */}
      <View className="mt-2 gap-1">
        <Text className="text-md text-primary font-semibold">{diet.duration} settimane</Text>
        <Text className="text-md text-foreground text-wrap italic">{formatDateRange(diet.startDate, diet.endDate)}</Text>
        <Text className="text-md font-semibold text-foreground">
          {diet.goal} • {diet.type}
        </Text>
      </View>
    </View>
  );
}
