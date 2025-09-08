import { RealtimeChatNative } from "@/components/chat/RealtimeChat.native";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

type Params = { room: string };

export const screenOptions = ({ params }: any) => ({
  title: params?.name ?? "Chat"
});

export default function ChatRoomScreen() {
  const { room } = useLocalSearchParams<Params>();
  const { user } = useUserDataStore();

  if (!room) return null;

  return (
    <View style={{ flex: 1 }}>
      <RealtimeChatNative roomName={room} username={user?.firstName ?? "Utente"} initialMessages={[]} onMessage={() => {}} />
    </View>
  );
}
