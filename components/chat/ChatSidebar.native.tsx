import { FlatList, Text, TouchableOpacity, View } from "react-native";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 168) {
    // 7 days
    return date.toLocaleDateString("it-IT", { weekday: "short" });
  } else {
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
  }
};

export function ChatSidebarNative({ rooms, selectedRoom, onRoomSelect }: { rooms: any[]; selectedRoom: any | null; onRoomSelect: (r: any) => void }) {
  const sortedRooms = [...rooms]
    .map((r) => {
      const tsString = r.lastMessageTimestamp ?? r.lastMessageAt ?? r.createdAt ?? r.created_at ?? r.last_message_at; // varianti possibili
      const ts = isNaN(Date.parse(tsString)) ? 0 : Date.parse(tsString);
      return { ...r, __ts: ts };
    })
    .sort((a, b) => b.__ts - a.__ts);

  return (
    <View className=" bg-background flex-1">
      <FlatList
        data={sortedRooms}
        keyExtractor={(i) => i.room}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const timestamp = item.__ts ? new Date(item.__ts).toISOString() : (item.createdAt ?? item.created_at ?? new Date().toISOString());
          const isSelected = selectedRoom?.room === item.room;

          return (
            <TouchableOpacity
              onPress={() => onRoomSelect(item)}
              className={`flex-row items-center p-4 border-b border-border ${isSelected ? "bg-surface-secondary" : "bg-background"}`}
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-3">
                <Text className="text-primary-foreground font-semibold text-lg">{getInitials(item.otherUserName)}</Text>
              </View>

              <View className="flex-1 mr-2">
                <Text className="font-semibold text-foreground text-lg mb-1" numberOfLines={1}>
                  {item.otherUserName}
                </Text>
                <Text numberOfLines={1} className="text-muted-foreground text-md">
                  {item.lastMessage}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-muted-foreground text-md">{formatTimestamp(timestamp)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
