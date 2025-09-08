import { supabase } from "@/lib/supabase/client";
import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: { name: string };
  createdAt: string;
}

type MessageRow = { id: string; room: string; content: string; username: string; created_at: string };

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChatNative({ roomName, username }: UseRealtimeChatProps) {
  const supabaseRef = useRef<SupabaseClient | null>(null);
  if (!supabaseRef.current) supabaseRef.current = supabase;
  const client = supabaseRef.current!;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await client.from("messages").select("*").eq("room", roomName).order("created_at", { ascending: true });
      if (!error && mounted && data) {
        setMessages((data as MessageRow[]).map((m) => ({ id: m.id, content: m.content, user: { name: m.username }, createdAt: m.created_at })));
      }
    })();
    return () => {
      mounted = false;
    };
  }, [roomName, client]);

  useEffect(() => {
    if (!client) return;
    const ch = client.channel(roomName);
    ch.on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
      setMessages((prev) => [...prev, payload.payload as ChatMessage]);
    }).subscribe((status) => {
      if (status === "SUBSCRIBED") setIsConnected(true);
    });
    setChannel(ch);
    return () => {
      client.removeChannel(ch);
    };
  }, [roomName, username, client]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return;
      const { data, error } = await client
        .from("messages")
        .insert([{ room: roomName, content, username }])
        .select()
        .single();
      if (error || !data) return;
      const message: ChatMessage = { id: data.id, content: data.content, user: { name: data.username }, createdAt: data.created_at };
      setMessages((prev) => [...prev, message]);
      await channel.send({ type: "broadcast", event: EVENT_MESSAGE_TYPE, payload: message });
    },
    [channel, isConnected, username, roomName, client]
  );

  return { messages, sendMessage, isConnected };
}
