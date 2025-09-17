import { fetchRoomsForUser } from "@/src/services/chatService.native";
import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
/* import { useUserDataStore } from "@/src/store/userDataStore"; */
import ChatSidebarNative from "@/components/chat/ChatSidebar.native";
import { useFocusEffect } from "@react-navigation/native";

export default function ChatIndex() {
  const router = useRouter();
  const userId = useAuthStore((s: any) => s.user?._id ?? s.user?.id ?? s.userId ?? s.authData?.user?.id ?? "");
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

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <ChatSidebarNative rooms={rooms} />
    </View>
  );
}
