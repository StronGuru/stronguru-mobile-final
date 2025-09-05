import { fetchRoomsForUser } from "@/src/services/chatService.native";
import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
/* import { useUserDataStore } from "@/src/store/userDataStore"; */
import { ChatSidebarNative } from "@/components/chat/ChatSidebar.native";
import { useFocusEffect } from "@react-navigation/native";

export default function ChatIndex() {
  const router = useRouter();
  const { userId } = useAuthStore();
  /*   const { user } = useUserDataStore(); */
  const [rooms, setRooms] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      if (!userId) return () => {};

      (async () => {
        try {
          const result = await fetchRoomsForUser(userId);
          if (active) setRooms(result);
        } catch (e) {
          console.warn("Failed to fetch rooms:", e);
        }
      })();

      return () => {
        active = false;
      };
    }, [userId])
  );

  const handleSelect = (room: any) => {
    const encodedRoom = encodeURIComponent(room.room);
    const encodedName = encodeURIComponent(room.otherUserName ?? "");
    // usa pathname + query per evitare problemi di typing/params
    router.push(`/chat/${encodedRoom}?name=${encodedName}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <ChatSidebarNative rooms={rooms} selectedRoom={null} onRoomSelect={handleSelect} />
    </View>
  );
}
