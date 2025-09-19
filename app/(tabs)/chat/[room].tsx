import { RealtimeChatNative } from "@/components/chat/RealtimeChat.native";
import { fetchRoomsForUser, markMessagesAsRead } from "@/src/services/chatService.native";
import { useChatBadgeStore } from "@/src/store/chatBadgeStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

type Params = { room: string };

export const screenOptions = ({ params }: any) => ({
  title: params?.name ?? "Chat"
});

export default function ChatRoomScreen() {
  const { room } = useLocalSearchParams<Params>();
  const { user } = useUserDataStore();

  const setMaxUnread = useChatBadgeStore((s) => s.setMaxUnread);
  useEffect(() => {
    if (room && user?._id) {
      markMessagesAsRead(Number(room), String(user._id)).then(async () => {
        // Aggiorna subito il badge dopo aver segnato come letti
        const updatedRooms = await fetchRoomsForUser(String(user._id));
        const maxUnread = Math.max(...updatedRooms.map((r) => r.unreadCount || 0));
        setMaxUnread(maxUnread);
      });
    }
  }, [room, user?._id, setMaxUnread]);

  if (!room) return null;

  return (
    <View style={{ flex: 1 }}>
      <RealtimeChatNative roomName={room} username={user?.firstName ?? "Utente"} initialMessages={[]} onMessage={() => {}} />
    </View>
  );
}
