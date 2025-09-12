import { supabase } from "@/lib/supabase/client";
import type { ChatMessage, MessageRow } from "@/src/types/chatTypes";
import { mapMessageRowToChatMessage } from "@/src/types/chatTypes";
import { useEffect, useMemo, useRef, useState } from "react";

type UseRealtimeChatResult = {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (content: string, senderId: string) => Promise<void>;
  clear: () => void;
};

export const EVENT_MESSAGE_TYPE = "message";

export default function useRealtimeChat(roomId: number | null): UseRealtimeChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const channelRef = useRef<any>(null);

  // fetch initial messages
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!roomId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await supabase
        .from("messages")
        .select("id, created_at, room_id, sender_id, content")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (res.error) {
        console.error("Error fetching messages", res.error);
        if (mounted) {
          setMessages([]);
          setLoading(false);
        }
        return;
      }

      const rows = (res.data as MessageRow[]) || [];
      const mapped = rows.map(mapMessageRowToChatMessage);
      if (mounted) {
        setMessages(mapped);
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [roomId]);

  // subscribe to realtime broadcasts for the room
  useEffect(() => {
    if (!roomId) return;

    const channelName = `room:${roomId}`;
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    // broadcast handler (custom broadcast from other clients)
    channel.on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload: any) => {
      try {
        const row: MessageRow = (payload && (payload.payload ?? payload.new ?? payload)) as MessageRow;
        if (!row) return;
        const mapped = mapMessageRowToChatMessage(row);
        setMessages((prev) => {
          if (prev.some((m) => m.id === mapped.id)) return prev;
          const merged = [...prev, mapped];
          merged.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
          return merged;
        });
      } catch (err) {
        console.error("Error handling broadcast message payload", err);
      }
    });

    // postgres_changes handler: catches INSERTs directly on messages table (robust vs different clients)
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${roomId}`
      },
      (payload: any) => {
        try {
          // payload.new is the inserted row
          const rowFromDb: MessageRow = (payload && (payload.new ?? payload.record ?? payload)) as MessageRow;
          if (!rowFromDb) return;
          const mapped = mapMessageRowToChatMessage(rowFromDb);
          setMessages((prev) => {
            if (prev.some((m) => m.id === mapped.id)) return prev;
            const merged = [...prev, mapped];
            merged.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
            return merged;
          });
        } catch (err) {
          console.error("Error handling postgres_changes payload", err);
        }
      }
    );

    // subscribe and log status for debugging
    channel.subscribe((status: any) => {
      console.log(`[supabase] channel ${channelName} status:`, status);
    });

    return () => {
      try {
        channel.unsubscribe();
      } catch (e) {
        // ignore
      }
      channelRef.current = null;
    };
  }, [roomId]);

  const sendMessage = useMemo(
    () => async (content: string, senderId: string) => {
      if (!roomId) return;
      try {
        const insertRes = await supabase
          .from("messages")
          .insert({
            room_id: roomId,
            sender_id: senderId,
            content
          })
          .select()
          .single();

        if (insertRes.error) {
          console.error("Error inserting message", insertRes.error);
          return;
        }

        const insertedRow = insertRes.data as MessageRow;

        // broadcast through channel if available
        const channel = channelRef.current;
        const payload = insertedRow;

        if (channel) {
          try {
            await channel.send({
              type: "broadcast",
              event: EVENT_MESSAGE_TYPE,
              payload
            });
            // append locally immediately to show message without waiting for broadcast.
            // broadcast handler is resilient to duplicates (it checks id), so this is safe.
            setMessages((prev) => {
              const mapped = mapMessageRowToChatMessage(insertedRow);
              if (prev.some((m) => m.id === mapped.id)) return prev;
              return [...prev, mapped].sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
            });
          } catch (err) {
            console.error("Error broadcasting message", err);
          }
        } else {
          // if no channel, append locally (avoids waiting for broadcast)
          setMessages((prev) => [...prev, mapMessageRowToChatMessage(insertedRow)]);
        }
      } catch (err) {
        console.error("sendMessage unexpected error", err);
      }
    },
    [roomId]
  );

  const clear = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    sendMessage,
    clear
  };
}
