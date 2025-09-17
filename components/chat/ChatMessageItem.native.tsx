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
      {showHeader ? <Text className="text-xs text-muted-foreground mb-1">{isOwn ? "Tu" : String(message.senderId ?? "")}</Text> : null}
      <View className={`${isOwn ? "bg-primary" : "bg-surface"} px-3 py-2 rounded-2xl max-w-[80%]`}>
        <Text className={`${isOwn ? "text-white" : "text-foreground"}`}>{message.content}</Text>
        {time ? <Text className={`text-[10px] mt-1 ${isOwn ? "text-white/80" : "text-muted-foreground"}`}>{time}</Text> : null}
      </View>
    </View>
  );
}
