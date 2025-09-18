import { useFocusEffect } from "@react-navigation/native";
import { Send } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, TextInput, TouchableOpacity, View } from "react-native";
import { TypingIndicatorNative } from "./TypingIndicator.native";

import ChatMessageItemNative from "@/components/chat/ChatMessageItem.native";
import { useChatScrollNative } from "@/hooks/use-chat-scroll.native";
import useRealtimeChatNative from "@/hooks/use-realtime-chat.native";
import { useAuthStore } from "@/src/store/authStore";
import type { ChatMessage, MessageRow } from "@/src/types/chatTypes";
import { mapMessageRowToChatMessage } from "@/src/types/chatTypes";

interface Props {
  roomName?: string; // legacy
  roomId?: number | string | null; // prefer numeric id
  username?: string;
  initialMessages?: any[];
  onMessage?: (m: ChatMessage[]) => void;
}

export const RealtimeChatNative = ({ roomName, roomId: roomIdProp, username, initialMessages = [], onMessage }: Props) => {
  const { listRef, scrollToBottom } = useChatScrollNative<ChatMessage>();
  // prefer explicit roomId, else try to parse roomName
  const roomId = roomIdProp ? Number(roomIdProp) : roomName ? Number(roomName) : null;

  const currentUserId = useAuthStore((s: any) => s.userId ?? s.user?._id ?? s.user?.id ?? s.authData?.user?.id ?? null);

  const { messages: realtimeMessages, sendMessage, loading, typingUsers, sendTyping } = useRealtimeChatNative(roomId);
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef<boolean>(false);
  const keepAliveIntervalRef = useRef<number | null>(null);

  // normalize any incoming message shape to ChatMessage
  const normalize = useCallback(
    (m: any): ChatMessage => {
      if (!m) {
        return {
          id: -Math.floor(Math.random() * 1000000),
          createdAt: new Date().toISOString(),
          roomId: roomId ?? -1,
          senderId: "",
          content: ""
        };
      }
      // Already ChatMessage
      if (m.roomId !== undefined || m.senderId !== undefined || m.createdAt !== undefined) {
        return m as ChatMessage;
      }
      // Row shape from supabase: MessageRow
      if (m.created_at !== undefined || m.sender_id !== undefined) {
        return mapMessageRowToChatMessage(m as MessageRow);
      }
      // legacy UI shape (has user.name and text/content)
      return {
        id: Number(m.id ?? m._id ?? Math.random()),
        createdAt: String(m.createdAt ?? m.created_at ?? new Date().toISOString()),
        roomId: Number(m.roomId ?? roomId ?? -1),
        senderId: String(m.sender_id ?? m.senderId ?? m.user?.id ?? ""),
        content: String(m.content ?? m.text ?? "")
      };
    },
    [roomId]
  );

  const allMessages = useMemo(() => {
    const normInitial = (initialMessages || []).map(normalize);
    const normRealtime = (realtimeMessages || []).map(normalize);
    const merged = [...normInitial, ...normRealtime];
    const unique = merged.filter((m, i, arr) => i === arr.findIndex((x) => x.id === m.id));
    return unique.sort((a, b) => new Date(a.createdAt ?? "").getTime() - new Date(b.createdAt ?? "").getTime());
  }, [initialMessages, realtimeMessages, normalize]);

  useEffect(() => {
    onMessage?.(allMessages);
  }, [allMessages, onMessage]);

  useEffect(() => {
    scrollToBottom();
    const t1 = setTimeout(scrollToBottom, 50);
    const t2 = setTimeout(scrollToBottom, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [allMessages, scrollToBottom]);

  useFocusEffect(
    React.useCallback(() => {
      scrollToBottom();
      const t = setTimeout(scrollToBottom, 80);
      return () => clearTimeout(t);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, scrollToBottom])
  );

  const isConnected = !!roomId && !loading;

  // Handle typing events
  const handleTextChange = useCallback(
    (newText: string) => {
      setText(newText);
      
      if (!currentUserId) return;

      // If text exists and user wasn't typing before
      if (newText.length > 0) {
        if (!isTypingRef.current) {
          // Start typing
          isTypingRef.current = true;
          sendTyping(String(currentUserId), true);
          
          // Set up keep-alive interval to maintain typing status
          keepAliveIntervalRef.current = setInterval(() => {
            if (isTypingRef.current) {
              sendTyping(String(currentUserId), true);
            }
          }, 3000); // Send keep-alive every 3 seconds
        }
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set timeout to stop typing after inactivity
        typingTimeoutRef.current = setTimeout(() => {
          isTypingRef.current = false;
          sendTyping(String(currentUserId), false);
          
          // Clear keep-alive interval
          if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
          }
        }, 3000); // Stop after 3 seconds of inactivity
      } else {
        // Text is empty, stop typing immediately
        isTypingRef.current = false;
        sendTyping(String(currentUserId), false);
        
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
          keepAliveIntervalRef.current = null;
        }
      }
    },
    [currentUserId, sendTyping]
  );  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
    };
  }, []);

  // scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
    const t1 = setTimeout(scrollToBottom, 50);
    const t2 = setTimeout(scrollToBottom, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [allMessages, scrollToBottom]);

  useFocusEffect(
    React.useCallback(() => {
      scrollToBottom();
      const t = setTimeout(scrollToBottom, 80);
      return () => clearTimeout(t);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, scrollToBottom])
  );

  const handleSend = useCallback(
    async () => {
      if (!text.trim() || !isConnected) return;
      if (!currentUserId) {
        console.error("Missing currentUserId");
        return;
      }

      // Stop typing indicator before sending
      isTypingRef.current = false;
      sendTyping(String(currentUserId), false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }

      try {
        if (typeof sendMessage === "function") {
          await sendMessage(text.trim(), String(currentUserId));
        } else {
          console.error("sendMessage not available from realtime hook");
        }
      } catch (err) {
        console.error("Error sending message", err);
      }
      setText("");
    },
    [text, isConnected, currentUserId, sendMessage, sendTyping]
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 98 : 0} className="flex-1">
      <SafeAreaView className="flex-1 bg-background">
        <FlatList
          ref={listRef}
          data={allMessages}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <ChatMessageItemNative message={item} currentUserId={String(currentUserId ?? "")} />}
          className="flex-1 p-3"
          showsVerticalScrollIndicator={false}
          onLayout={() => scrollToBottom()}
        />

        {/* Typing indicator */}
        <TypingIndicatorNative typingUsers={typingUsers} currentUserId={String(currentUserId ?? "")} />

        <View className="flex-row items-center px-4 py-3 border-t border-border bg-background">
          <TextInput
            className="flex-1 border border-accent text-foreground rounded-lg px-3 py-3"
            value={text}
            onChangeText={handleTextChange}
            placeholder="Scrivi un messaggio..."
            editable={isConnected}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} disabled={!isConnected || !text.trim()} className="ml-2 flex-row items-center justify-center">
            <Send size={24} color={isConnected && text.trim() ? "#fff" : "#999"} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
