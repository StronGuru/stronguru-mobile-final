import type { ChatMessage } from "@/src/types/chatTypes";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  message: ChatMessage;
  currentUserId?: string;
  showHeader?: boolean;
};

export default function ChatMessageItemNative({ message, currentUserId, showHeader }: Props) {
  const isOwn = currentUserId ? String(message.senderId) === String(currentUserId) : false;
  const time = message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <View className={`${isOwn ? "items-end" : "items-start"} my-2`}>
      {showHeader && !isOwn ? (
        <Text className="text-xs text-muted-foreground mb-1">{String(message.senderId ?? "")}</Text>
      ) : null}
      
      <View className={`${isOwn ? "bg-primary" : "bg-surface"} px-3 py-2 rounded-2xl max-w-[80%]`}>
        <Text className={`${isOwn ? "text-primary-foreground" : "text-foreground"} leading-relaxed`}>
          {message.content}
        </Text>
        
        <View className="flex-row justify-end items-center mt-1">
          {time ? (
            <Text className={`text-[11px] ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {time}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
