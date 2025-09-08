import { supabase } from "@/lib/supabase/client";

/**
 * Recupera le stanze (rooms) raggruppando per room e prendendo l'ultimo messaggio.
 * Adatta i campi a RoomPreview del web.
 */
export async function fetchRoomsForUser(userId: string) {
  // query: prendi tutti i messaggi dove room contiene l'userId (o usa una relazione con users)
  // qui semplifico: prendi ultimi 100 messaggi e raggruppa lato client

  const { data, error } = await supabase.from("messages").select("*").like("room", `%_${userId}`).order("created_at", { ascending: false }).limit(200);
  if (error || !data) return [];

  // group by room, pick last msg per room
  const map = new Map<string, any>();
  for (const m of data as any[]) {
    if (!map.has(m.room)) map.set(m.room, m);
  }
  const rooms = Array.from(map.values()).map((m) => {
    const otherId = m.room.split("_").find((id: string) => id !== userId) ?? "";
    return {
      room: m.room,
      lastMessage: m.content,
      lastMessageAt: m.created_at,
      otherUserName: m.username === m.username ? m.username : "Utente", // se hai user table leggi nome reale
      otherUserId: otherId
    };
  });
  return rooms;
}
