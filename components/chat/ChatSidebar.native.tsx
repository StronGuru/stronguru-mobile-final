import { useAuthStore } from "@/src/store/authStore";
import type { ChatRoomPreview } from "@/src/types/chatTypes";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type ChatRoomPreviewWithUnread = ChatRoomPreview & { unreadCount?: number };


type Props = {
  rooms: ChatRoomPreviewWithUnread[];
};


function formatTimestamp(ts?: string | null) {
  if (!ts) return "";
  const d = new Date(ts);
  // breve e leggibile: 02 Apr • 14:30
  return d.toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function ChatSidebarNative({ rooms }: Props) {
  const router = useRouter();
  // selector sicuro: supporta più formati del user id nello store
  const currentUserId = useAuthStore((s: any) => s.user?._id ?? s.user?.id ?? s.userId ?? s.authData?.user?.id ?? "");

  const data = useMemo(() => rooms || [], [rooms]);

  const renderItem = useCallback(
    ({ item }: { item: ChatRoomPreviewWithUnread }) => {
      console.log(`[ChatSidebar] roomId=${item.roomId} participants=`, item.participants);
      // mostra solo gli altri partecipanti (esclude current user se presente)
      const otherParticipants = item.participants.filter((p) => String(p.userId) !== String(currentUserId));
      const names =
        otherParticipants.length > 0
          ? otherParticipants.map((p) => p.name ?? p.userId).join(", ")
          : item.participants.map((p) => p.name ?? p.userId).join(", ");
      const lastText = item.lastMessage?.content ?? "Nessun messaggio";
      const lastAt = item.lastMessage?.createdAt ?? null;

      return (
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/chat/${item.roomId}`)}
          accessibilityRole="button"
          className="px-4 py-3 border-b border-border bg-background"
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-semibold text-foreground" numberOfLines={1}>
                {names}
              </Text>
              <Text className="text-sm text-muted-foreground truncate mt-1" numberOfLines={1}>
                {lastText}
              </Text>
            </View>
            <View className="ml-3 items-end flex-row items-center">
              {item.unreadCount && item.unreadCount > 0 ? (
                <Text style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginRight: 8,
                  paddingHorizontal: 4,
                  paddingTop: 1,
                  overflow: 'hidden',
                  includeFontPadding: false
                }}>{item.unreadCount}</Text>
              ) : null}
              <Text className="text-xs text-muted-foreground">{formatTimestamp(lastAt)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [router, currentUserId]
  );

  if (!data.length) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Text className="text-sm text-muted-foreground text-center">Nessuna conversazione ancora. Inizia a chattare!</Text>
      </View>
    );
  }

  return <FlatList data={data} keyExtractor={(r) => String(r.roomId)} renderItem={renderItem} />;
}
