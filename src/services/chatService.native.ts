import apiClient from "@/api/apiClient";
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

// Helper per ottenere il nome completo di un utente (simile al web)
const getUserDisplayName = async (userId: string, otherUserId?: string): Promise<string> => {
  try {
    // Prima prova a cercare nei professionisti
    try {
      const professionalResp = await apiClient.get(`/professionals/${userId}`);
      if (professionalResp.status >= 200 && professionalResp.status < 300 && professionalResp.data) {
        const professional = professionalResp.data;
        const fullName = `${professional.firstName || ''} ${professional.lastName || ''}`.trim();
        return fullName || 'Professional';
      }
    } catch {
      // Non è un professionista
    }

    // Se non è un professionista, potrebbe essere un client
    if (otherUserId) {
      try {
        const clientResp = await apiClient.get(`/clientUsers/${userId}`);
        if (clientResp.status >= 200 && clientResp.status < 300 && clientResp.data) {
          const client = clientResp.data;
          const fullName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
          return fullName || 'Client';
        }
      } catch {
        // Non è un client
      }
    }

    // Fallback
    console.warn(`Nome non trovato per userId: ${userId}, usando fallback`);
    return 'Utente Sconosciuto';
  } catch (error) {
    console.error('Errore nel recupero del nome utente:', error);
    return 'Utente';
  }
};

/**
 * Crea o recupera una room 1:1 tra due utenti.
 * Se esiste già una room con entrambi i partecipanti, la restituisce.
 * Altrimenti crea la room e aggiunge i partecipanti con i nomi reali.
 */
export const getOrCreateRoom = async (otherUserId: string, userId: string): Promise<RoomRow> => {
  // 1. Cerca una room esistente dove entrambi sono partecipanti
  const { data: existingRoom } = await supabase
    .from("room_partecipants")
    .select(`room_id, rooms!inner(id, created_at)`)
    .in("user_id", [userId, otherUserId]);

  if (existingRoom && existingRoom.length >= 2) {
    const roomIds = existingRoom.map((r: any) => r.room_id);
    const duplicateRoomId = roomIds.find((id: any) => roomIds.filter((rid: any) => rid === id).length >= 2);
    if (duplicateRoomId) {
      const { data: room } = await supabase.from("rooms").select("*").eq("id", duplicateRoomId).single();
      if (room) return room as RoomRow;
    }
  }

  // 2. Crea una nuova room
  const { data: newRoom, error: roomError } = await supabase.from("rooms").insert([{}]).select().single();
  if (roomError || !newRoom) {
    console.error("Errore nella creazione della room:", roomError);
    throw new Error("Errore nella creazione della room");
  }

  // 3. Ottieni i nomi reali degli utenti
  const [currentUserName, otherUserName] = await Promise.all([
    getUserDisplayName(userId, otherUserId),
    getUserDisplayName(otherUserId, userId)
  ]);

  // 4. Aggiungi i partecipanti con i nomi reali
  const participantsToInsert = [
    {
      room_id: newRoom.id,
      user_id: userId.toString(),
      name: currentUserName
    },
    {
      room_id: newRoom.id,
      user_id: otherUserId.toString(),
      name: otherUserName
    }
  ];
  const { error: participantsError } = await supabase.from("room_partecipants").insert(participantsToInsert).select();
  if (participantsError) {
    console.error("Errore nell'aggiunta dei partecipanti:", participantsError);
    throw new Error(`Errore nell'aggiunta dei partecipanti: ${participantsError.message}`);
  }
  return newRoom as RoomRow;
};
