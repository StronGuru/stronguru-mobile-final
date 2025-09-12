import { ProfessionalType } from "@/lib/zod/userSchemas";
import { useRouter } from "expo-router";
import { Brain, Dumbbell, Salad } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
type BadgeType = "salad" | "dumbbell" | "brain";

const ProfessionalCardTeam = ({ professional }: { professional: ProfessionalType }) => {
  const router = useRouter();

  const getInitials = (firstName?: string, lastName?: string) => {
    return ((firstName?.charAt(0) ?? "") + (lastName?.charAt(0) ?? "")).toUpperCase();
  };
  if (!professional || !professional.specializations) {
    return null;
  }

  const getBadgesFromSpecializations = (specializations: string[]): BadgeType[] => {
    const badges: BadgeType[] = [];

    if (specializations.includes("trainer")) {
      badges.push("dumbbell");
    }
    if (specializations.includes("psychologist")) {
      badges.push("brain");
    }
    if (specializations.includes("nutritionist")) {
      badges.push("salad");
    }

    return badges;
  };

  const renderBadgeIcon = (badge: BadgeType) => {
    switch (badge) {
      case "dumbbell":
        return <Dumbbell size={16} color="white" />;
      case "brain":
        return <Brain size={16} color="white" />;
      case "salad":
        return <Salad size={16} color="white" />;
      default:
        return null;
    }
  };

  const badges = getBadgesFromSpecializations(professional.specializations);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/search/${professional._id}` as any);
      }}
    >
      <View className="bg-card rounded-xl  mb-4 shadow-sm  relative">
        <View className="bg-secondary p-4 items-center rounded-t-xl">
          {/* Avatar */}
          <View className="w-20 h-20 rounded-full items-center justify-center my-2 bg-green-200">
            {professional.profileImg ? (
              <Image source={{ uri: professional.profileImg }} className="w-20 h-20 rounded-full" resizeMode="cover" />
            ) : (
              <Text className="text-2xl font-bold text-white">{getInitials(professional.firstName, professional.lastName)}</Text>
            )}
          </View>
        </View>
        <View className="items-center mt-4 ">
          {/* Name */}
          <Text className="text-lg font-semibold text-card-foreground mb-2 text-center">
            {professional.firstName} {professional.lastName}
          </Text>

          {/* Badges */}
          <View className="flex-row gap-2 mb-3">
            {badges.map((badge: BadgeType, index: number) => (
              <View key={`${professional._id}-${badge}-${index}`} className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                {renderBadgeIcon(badge)}
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfessionalCardTeam;
