import type { ChatMessage } from "@/hooks/use-realtime-chat.native";
import React from "react";
import { Text, View } from "react-native";

export const ChatMessageItemNative = ({ message, isOwnMessage }: { message: ChatMessage; isOwnMessage: boolean }) => {
  return (
    <View className={`flex-row my-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <View className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}>
        <View className="flex-row items-center mb-1">
          <Text className=" text-foreground font-semibold mr-2 text-base">{message.user.name}</Text>
          <Text className="text-muted-foreground text-xs">{new Date(message.createdAt).toLocaleTimeString()}</Text>
        </View>
        <View className={`${isOwnMessage ? "bg-accent" : "bg-chart-1 dark:bg-secondary-foreground"} py-2 px-3 rounded-lg`}>
          <Text className={`${isOwnMessage ? "text-white" : "text-black"} text-lg`}>{message.content}</Text>
        </View>
      </View>
    </View>
  );
};
