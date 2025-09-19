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
    if (!userId) return;

    // 1. Recupera tutte le room dell'utente
    fetchRoomsForUser(userId).then((rooms) => {
      if (!active) return;
      // 2. Sottoscrivi ogni room per INSERT su messages
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
            // Quando arriva un nuovo messaggio, ricalcola il badge e notifica la chat list
            const updatedRooms = await fetchRoomsForUser(userId);
            const maxUnread = Math.max(...updatedRooms.map((r) => r.unreadCount || 0));
            setMaxUnread(maxUnread);
            triggerRefresh();
          }
        );
        channel.subscribe();
        return channel;
      });
    });

    return () => {
      active = false;
      // Unsubscribe da tutti i canali
      channelsRef.current.forEach((ch) => ch.unsubscribe && ch.unsubscribe());
      channelsRef.current = [];
    };
  }, [userId, setMaxUnread]);
}
