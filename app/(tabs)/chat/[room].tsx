import { RealtimeChatNative } from "@/components/chat/RealtimeChat.native";
import { triggerUnreadMessagesUpdate } from "@/hooks/use-global-chat-realtime";
import { supabase } from "@/lib/supabase/client";
import { markMessagesAsRead } from "@/src/services/chatService.native";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

type Params = { 
  room: string;
  chatUser?: string; // JSON stringified chatUser data
};

type ChatUser = {
  id: string;
  name: string;
  avatar?: string;
};

export const screenOptions = ({ params }: any) => ({
  headerShown: false // Nascondi l'header della navigazione per usare quello personalizzato
});

export default function ChatRoomScreen() {
  const { room, chatUser: chatUserParam } = useLocalSearchParams<Params>();
  const { user } = useUserDataStore();

  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);

  // Parse chatUser from params if available
  useEffect(() => {
    if (chatUserParam) {
      try {
        const parsedChatUser = JSON.parse(chatUserParam);
        setChatUser(parsedChatUser);
        return; // Se abbiamo i dati dai params, non fare la query
      } catch (error) {
        console.warn('Failed to parse chatUser param:', error);
      }
    }
    
    // Fallback: carica da database se non abbiamo i dati
    const loadChatUserFromDatabase = async () => {
      if (!room || !user?._id) return;

      try {
        // Primo, ottieni i partecipanti della stanza
        const { data: participants } = await supabase
          .from("room_participants")
          .select("user_id")
          .eq("room_id", Number(room))
          .neq("user_id", String(user._id));

        if (participants && participants.length > 0) {
          const otherUserId = participants[0].user_id;
          
        // Poi ottieni i dati dell'utente
        const { data: userData } = await supabase
          .from("users")
          .select("id, first_name, last_name, avatar_url")
          .eq("id", otherUserId)
          .single();          if (userData) {
            setChatUser({
              id: userData.id,
              name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Utente',
              avatar: userData.avatar_url || undefined
            });
          }
        }
      } catch (error) {
        console.error('Error loading chat user:', error);
        // Fallback - usa l'ID della stanza come nome
        setChatUser({
          id: room,
          name: `Chat ${room}`,
        });
      }
    };

    loadChatUserFromDatabase();
  }, [room, chatUserParam, user?._id]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      async function loadAndMarkRead() {
        if (room && user?._id) {
          // Carica solo i messaggi non letti per l'utente loggato
          const res = await supabase
            .from("messages")
            .select("id, created_at, room_id, sender_id, content, read")
            .eq("room_id", Number(room))
            .or(`read.is.null,read.eq.false`)
            .neq("sender_id", String(user._id))
            .order("created_at", { ascending: true });
          if (active && res.data) setInitialMessages(res.data);
          // Marca come letti e aggiorna badge
          await markMessagesAsRead(Number(room), String(user._id));
          triggerUnreadMessagesUpdate();
        }
      }
      loadAndMarkRead();
      return () => { active = false; };
    }, [room, user?._id, setInitialMessages])
  );

  if (!room) return null;

  return (
    <View style={{ flex: 1 }}>
      <RealtimeChatNative
        roomName={room}
        username={user?.firstName ?? "Utente"}
        initialMessages={initialMessages}
        chatUser={chatUser || undefined}
        onMessage={() => {}}
      />
    </View>
  );
}
