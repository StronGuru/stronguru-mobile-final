import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
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
  // Dati per l'header
  chatUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const RealtimeChatNative = ({ roomName, roomId: roomIdProp, username, initialMessages = [], onMessage, chatUser }: Props) => {
    // const inputRef = useRef<TextInput>(null); // Removed duplicate declaration

  const { listRef, scrollToBottom } = useChatScrollNative<ChatMessage>();
  // prefer explicit roomId, else try to parse roomName
  const roomId = roomIdProp ? Number(roomIdProp) : roomName ? Number(roomName) : null;

  const currentUserId = useAuthStore((s: any) => s.userId ?? s.user?._id ?? s.user?.id ?? s.authData?.user?.id ?? null);

  const { messages: realtimeMessages, sendMessage, loading, typingUsers, sendTyping } = useRealtimeChatNative(roomId);
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef<boolean>(false);
  const keepAliveIntervalRef = useRef<number | null>(null);
  const inputRef = useRef<TextInput>(null);

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

  // Scroll automatico quando cambiano i messaggi o quando si apre la chat
  useEffect(() => {
    if (!allMessages.length) return;
    
    // Scroll immediato
    scrollToBottom();
    
    // Scroll ritardati per assicurarsi che la FlatList sia renderizzata
    const timeouts = [
      setTimeout(scrollToBottom, 100),
      setTimeout(scrollToBottom, 300),
      setTimeout(scrollToBottom, 500)
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [allMessages, scrollToBottom]);

  // Scroll automatico quando si entra nella chat
  useFocusEffect(
    React.useCallback(() => {
      // Scroll immediato
      scrollToBottom();
      
      // Scroll ritardati per gestire il caricamento dei messaggi iniziali
      const timeouts = [
        setTimeout(scrollToBottom, 150),
        setTimeout(scrollToBottom, 400),
        setTimeout(scrollToBottom, 800)
      ];
      
      return () => {
        timeouts.forEach(clearTimeout);
      };
    }, [scrollToBottom])
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
      inputRef.current?.clear();
      inputRef.current?.focus();
      setTimeout(() => scrollToBottom(), 50);
    },
    [text, isConnected, currentUserId, sendMessage, sendTyping, scrollToBottom]
  );

  const handleGoBack = () => {
    // Naviga indietro usando router
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/chat');
    }
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1 bg-background" style={{ paddingTop: Platform.OS === 'ios' ? 0 : 26 }}>
        {/* Header Chat */}
        <View className="flex-row items-center px-4 py-4 bg-surface border-b border-border" style={{ paddingTop: Platform.OS === 'ios' ? 12 : 28 }}>
          <TouchableOpacity onPress={handleGoBack} className="mr-3">
            <ArrowLeft size={24} color="currentColor" className="text-foreground" />
          </TouchableOpacity>
          
          <View className="flex-row items-center flex-1">
            {chatUser?.avatar ? (
              <Image 
                source={{ uri: chatUser.avatar }} 
                className="w-10 h-10 rounded-full mr-3"
                defaultSource={require('@/assets/images/icon.png')}
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-accent mr-3 items-center justify-center">
                <Text className="text-accent-foreground font-semibold">
                  {chatUser?.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
            
            <View className="flex-1">
              <Text className="text-foreground font-semibold text-base">
                {chatUser?.name || 'Utente'}
              </Text>
            </View>
          </View>
        </View>
        
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <FlatList
            ref={listRef}
            data={allMessages}
            keyExtractor={(i) => String(i.id)}
            renderItem={({ item }) => <ChatMessageItemNative message={item} currentUserId={String(currentUserId ?? "")} />}
            className="flex-1 p-3 bg-background"
            showsVerticalScrollIndicator={false}
            onLayout={() => scrollToBottom()}
          />

          {/* Typing indicator */}
          <TypingIndicatorNative typingUsers={typingUsers} currentUserId={String(currentUserId ?? "")} />

          <View className="flex-row items-center px-4 py-3 border-t border-border bg-background">
            <TextInput
              ref={inputRef}
              className="flex-1 border border-accent text-foreground rounded-lg px-3 py-3 mr-3"
              value={text}
              onChangeText={handleTextChange}
              placeholder="Scrivi un messaggio..."
              editable={isConnected}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline
              style={{ maxHeight: 100 }}
            />
            
            <TouchableOpacity 
              onPress={handleSend} 
              disabled={!isConnected || !text.trim()} 
              className="w-10 h-10 rounded-lg bg-primary items-center justify-center"
              style={{ opacity: isConnected && text.trim() ? 1 : 0.6 }}
            >
              <Send size={20} color={isConnected && text.trim() ? "#fff" : "#999"} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
