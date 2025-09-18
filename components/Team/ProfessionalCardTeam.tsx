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
        router.push(`/team/${professional._id}` as any);
      }}
    >
      <View className=" items-center mb-4 ">
        {/* Avatar */}
        <View className="w-28 h-28 rounded-full items-center justify-center mt-4 mb-2 bg-secondary overflow-hidden">
          {professional.profileImg ? (
            <Image source={{ uri: professional.profileImg }} className="w-28 h-28 rounded-full" resizeMode="cover" />
          ) : (
            <Text className="text-3xl font-bold text-primary dark:text-white ">{getInitials(professional.firstName, professional.lastName)}</Text>
          )}
        </View>

        <View className="items-center  ">
          {/* Name */}
          <Text className="text-lg font-medium text-foreground mb-2 text-center text-wrap">
            {professional.firstName} {professional.lastName}
          </Text>

          {/* Badges */}
          <View className="flex-row gap-2 mb-3">
            {badges.map((badge: BadgeType, index: number) => (
              <View key={`${professional._id}-${badge}-${index}`} className="w-8 h-8 bg-accent rounded-full items-center justify-center">
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
