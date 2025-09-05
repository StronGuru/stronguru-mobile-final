import { ChatMessageItemNative } from "@/components/chat/ChatMessageItem.native";
import { useChatScrollNative } from "@/hooks/use-chat-scroll.native";
import { useRealtimeChatNative } from "@/hooks/use-realtime-chat.native";
import { Send } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  roomName: string;
  username: string;
  initialMessages?: any[];
  onMessage?: (m: any[]) => void;
}

export const RealtimeChatNative = ({ roomName, username, initialMessages = [], onMessage }: Props) => {
  const { listRef, scrollToBottom } = useChatScrollNative<any>();
  const { messages: realtimeMessages, sendMessage, isConnected } = useRealtimeChatNative({ roomName, username });
  const [text, setText] = useState("");

  const allMessages = useMemo(() => {
    const merged = [...initialMessages, ...realtimeMessages];
    const unique = merged.filter((m, i, arr) => i === arr.findIndex((x) => x.id === m.id));
    return unique.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [initialMessages, realtimeMessages]);

  useEffect(() => {
    onMessage?.(allMessages);
  }, [allMessages, onMessage]);
  useEffect(() => {
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  const handleSend = useCallback(async () => {
    if (!text.trim() || !isConnected) return;
    await sendMessage(text.trim());
    setText("");
  }, [text, isConnected, sendMessage]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 98 : 0} className="flex-1">
      <SafeAreaView className="flex-1 bg-background">
        <FlatList
          ref={listRef}
          data={allMessages}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <ChatMessageItemNative message={item} isOwnMessage={item.user.name === username} />}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
        />
        <View className="flex-row items-center px-4 py-3 border-t  border-border">
          <TextInput
            className="flex-1 border border-accent text-foreground rounded-lg px-3 py-3"
            value={text}
            onChangeText={setText}
            placeholder="Scrivi un messaggio..."
            editable={isConnected}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} disabled={!isConnected || !text.trim()} className="ml-2 flex-row items-center justify-center">
            <Text className={`${!isConnected || !text.trim() ? "hidden" : "bg-primary rounded-3xl px-4 py-2 "}`}>
              <Send size={24} color={isConnected && text.trim() ? "#fff" : "#999"} />
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
