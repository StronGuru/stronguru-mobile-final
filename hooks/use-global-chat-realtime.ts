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

    // Helper to (re)subscribe to all rooms
    const subscribeToRooms = (rooms: any[]) => {
      channelsRef.current.forEach((ch) => ch.unsubscribe && ch.unsubscribe());
      channelsRef.current = [];
      channelsRef.current = rooms.map((room: any) => {
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
    };

    // Always fetch unread count for the current user, even if no rooms
    fetchRoomsForUser(userId).then((rooms) => {
      if (!active) return;
      const totalUnread = rooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);
      setMaxUnread(totalUnread);
      subscribeToRooms(rooms);
    });

    // GLOBAL subscription to all INSERTs on messages (no room_id filter)
    const globalChannel = supabase.channel('global-messages-insert');
    globalChannel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages"
        // no filter: catch all new messages
      },
      async (payload) => {
        // payload.new is the inserted message row
  const message = payload?.new || payload;
        if (!message || !message.room_id) return;
        // Check if the current user is a participant in this room
        const participantRes = await supabase
          .from("room_partecipants")
          .select("user_id")
          .eq("room_id", message.room_id)
          .eq("user_id", userId)
          .maybeSingle();
        if (!participantRes?.data || participantRes.error) return;
        // Only update if the user is a participant
        const updatedRooms = await fetchRoomsForUser(userId);
        const totalUnread = updatedRooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);
        setMaxUnread(totalUnread);
        subscribeToRooms(updatedRooms);
        triggerRefresh();
      }
    );
    globalChannel.subscribe();
    channelsRef.current.push(globalChannel);

    return () => {
      active = false;
      channelsRef.current.forEach((ch) => ch.unsubscribe && ch.unsubscribe());
      channelsRef.current = [];
    };
  }, [userId, setMaxUnread, triggerRefresh]);
}
