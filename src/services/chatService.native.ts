import { supabase } from "../../lib/supabase/client";
import type { ChatRoomPreview, MessageRow, RoomParticipantRow, RoomRow } from "../types/chatTypes";
import { buildRoomPreview } from "../types/chatTypes";

/**
 * Recupera le stanze (preview) per un determinato utente.
 * - Legge room_partecipants per ottenere le room a cui partecipa l'utente
 * - Recupera in batch rooms, participants e messaggi (prendendo l'ultimo per room)
 * - Restituisce array di ChatRoomPreview
 */
export const fetchRoomsForUser = async (userId: string): Promise<ChatRoomPreview[]> => {
  try {
    // 1) trova room_ids dove l'utente partecipa
    const participantResult = await supabase.from("room_partecipants").select("room_id").eq("user_id", userId);

    const participantRows = participantResult.data as Pick<RoomParticipantRow, "room_id">[] | null;
    const participantError = participantResult.error;

    if (participantError) {
      console.error("Error fetching user room_partecipants", participantError);
      return [];
    }

    const roomIds = Array.from(new Set((participantRows || []).map((r) => r.room_id)));
    if (roomIds.length === 0) return [];

    // 2) fetch rooms, participants and messages in batch
    const [roomsResRaw, participantsResRaw, messagesResRaw] = await Promise.all([
      supabase.from("rooms").select("id, created_at").in("id", roomIds),
      supabase.from("room_partecipants").select("room_id, user_id, name, created_at").in("room_id", roomIds),
      // fetch messages for these rooms ordered desc so we can pick the latest per room
      supabase.from("messages").select("id, created_at, room_id, sender_id, content").in("room_id", roomIds).order("created_at", { ascending: false })
    ]);

    const roomsRes = roomsResRaw;
    const participantsRes = participantsResRaw;
    const messagesRes = messagesResRaw;

    if (roomsRes.error) {
      console.error("Error fetching rooms", roomsRes.error);
      return [];
    }
    if (participantsRes.error) {
      console.error("Error fetching room_partecipants", participantsRes.error);
      return [];
    }
    if (messagesRes.error) {
      console.error("Error fetching messages", messagesRes.error);
      return [];
    }

    const rooms = (roomsRes.data as RoomRow[]) || [];
    const participants = (participantsRes.data as RoomParticipantRow[]) || [];
    const messages = (messagesRes.data as MessageRow[]) || [];

    // 3) build map of last message per room (messages already ordered desc)
    const lastMessageByRoom = new Map<number, MessageRow>();
    for (const m of messages) {
      if (!lastMessageByRoom.has(m.room_id)) {
        lastMessageByRoom.set(m.room_id, m);
      }
    }

    // 4) group participants by room
    const participantsByRoom = new Map<number, RoomParticipantRow[]>();
    for (const p of participants) {
      const arr = participantsByRoom.get(p.room_id) || [];
      arr.push(p);
      participantsByRoom.set(p.room_id, arr);
    }

    // 5) build previews
    const previews: ChatRoomPreview[] = rooms.map((r) => buildRoomPreview(r, participantsByRoom.get(r.id) || [], lastMessageByRoom.get(r.id) || null));

    // 6) sort: by lastMessage.createdAt desc, fallback to room.created_at
    previews.sort((a, b) => {
      const aTs = a.lastMessage?.createdAt ?? null;
      const bTs = b.lastMessage?.createdAt ?? null;
      if (aTs && bTs) return new Date(bTs).getTime() - new Date(aTs).getTime();
      if (aTs && !bTs) return -1;
      if (!aTs && bTs) return 1;
      // fallback: no last messages -> keep original order (or sort by roomId)
      return 0;
    });

    return previews;
  } catch (err) {
    console.error("fetchRoomsForUser unexpected error", err);
    return [];
  }
};
