import { supabase } from "@/lib/supabase/client";
import { fetchRoomsForUser } from "@/src/services/chatService.native";
import { useAuthStore } from "@/src/store/authStore";
import { useChatBadgeStore } from "@/src/store/chatBadgeStore";
import { useChatRoomsRefreshStore } from "@/src/store/chatRoomsRefreshStore";
import { useEffect, useRef } from "react";

/**
 * Hook globale che sottoscrive tutte le room dell'utente per ricevere nuovi messaggi in tempo reale,
 * aggiornando il badge dei non letti ovunque nell'app.
 */
export function useGlobalChatRealtime() {
  const userId = useAuthStore((s) => s.userId || "");
  const setMaxUnread = useChatBadgeStore((s) => s.setMaxUnread);
  const channelsRef = useRef<any[]>([]);
  const triggerRefresh = useChatRoomsRefreshStore((s) => s.triggerRefresh);

  useEffect(() => {
    let active = true;
    // Always cleanup previous subscriptions
    channelsRef.current.forEach((ch) => ch.unsubscribe && ch.unsubscribe());
    channelsRef.current = [];

    // If no user, reset badge and exit
    if (!userId) {
      setMaxUnread(0);
      return;
    }

    // Always fetch unread count for the current user, even if no rooms
    fetchRoomsForUser(userId).then((rooms) => {
      if (!active) return;
      const totalUnread = rooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);
      setMaxUnread(totalUnread);

      // Subscribe to each room for realtime updates
      channelsRef.current = rooms.map((room) => {
        const channel = supabase.channel(`room:${room.roomId}`);
        channel.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${room.roomId}`
          },
          async () => {
            // On new message, recalculate badge and notify chat list
            const updatedRooms = await fetchRoomsForUser(userId);
            const totalUnread = updatedRooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);
            setMaxUnread(totalUnread);
            triggerRefresh();
          }
        );
        channel.subscribe();
        return channel;
      });
    });

    return () => {
      active = false;
      channelsRef.current.forEach((ch) => ch.unsubscribe && ch.unsubscribe());
      channelsRef.current = [];
    };
  }, [userId, setMaxUnread, triggerRefresh]);
}
