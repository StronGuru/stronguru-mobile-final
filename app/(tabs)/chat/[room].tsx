import { RealtimeChatNative } from "@/components/chat/RealtimeChat.native";
import { supabase } from "@/lib/supabase/client";
import { fetchRoomsForUser, markMessagesAsRead } from "@/src/services/chatService.native";
import { useChatBadgeStore } from "@/src/store/chatBadgeStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

type Params = { room: string };

export const screenOptions = ({ params }: any) => ({
  title: params?.name ?? "Chat"
});

export default function ChatRoomScreen() {
  const { room } = useLocalSearchParams<Params>();
  const { user } = useUserDataStore();

  const setMaxUnread = useChatBadgeStore((s) => s.setMaxUnread);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
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
          const updatedRooms = await fetchRoomsForUser(String(user._id));
          const maxUnread = Math.max(...updatedRooms.map((r) => r.unreadCount || 0));
          setMaxUnread(maxUnread);
        }
      }
      loadAndMarkRead();
      return () => { active = false; };
    }, [room, user?._id, setMaxUnread])
  );

  if (!room) return null;

  return (
    <View style={{ flex: 1 }}>
      <RealtimeChatNative
        roomName={room}
        username={user?.firstName ?? "Utente"}
        initialMessages={initialMessages}
        onMessage={() => {}}
      />
    </View>
  );
}
