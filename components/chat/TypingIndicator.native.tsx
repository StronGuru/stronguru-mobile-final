import React from "react";
import { Text, View } from "react-native";

interface Props {
  typingUsers: string[];
  currentUserId: string;
}

export const TypingIndicatorNative = ({ typingUsers, currentUserId }: Props) => {
  // Filter out current user from typing users
  const otherTypingUsers = typingUsers.filter(userId => userId !== currentUserId);
  
  if (otherTypingUsers.length === 0) return null;

  const getTypingText = () => {
    if (otherTypingUsers.length === 1) {
      return "Sta scrivendo...";
    } else if (otherTypingUsers.length === 2) {
      return "Stanno scrivendo...";
    } else {
      return `${otherTypingUsers.length} persone stanno scrivendo...`;
    }
  };

  return (
    <View className="px-4 py-2">
      <Text className="text-sm text-muted-foreground italic">
        {getTypingText()}
      </Text>
    </View>
  );
};