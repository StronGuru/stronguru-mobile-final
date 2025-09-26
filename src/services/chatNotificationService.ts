import { supabase } from "@/lib/supabase/client";
import apiClient from "@/api/apiClient";
import { useUserDataStore } from "@/src/store/userDataStore";

export interface ChatNotificationPayload {
  roomId: number;
  senderId: string;
  senderName?: string;
  message: string;
  messageId: number;
  timestamp: string;
}

export interface NotificationTriggerData {
  pushToken: string;
  title: string;
  body: string;
  data: {
    type: 'chat';
    roomId: number;
    messageId: number;
    senderId: string;
  };
}

export class ChatNotificationService {
  /**
   * Invia notifica push per nuovo messaggio in chat
   */
  static async sendChatNotification(payload: ChatNotificationPayload): Promise<void> {
    try {
      console.log('📱 [ChatNotification] Inviando notifica per messaggio:', payload);

      // Ottieni i partecipanti della room (escluso il mittente)
      const participants = await this.getRoomParticipants(payload.roomId, payload.senderId);
      
      if (participants.length === 0) {
        console.log('📱 [ChatNotification] Nessun partecipante da notificare');
        return;
      }

      // Crea le notifiche per ogni partecipante
      const notifications = participants.map(participant => ({
        pushToken: participant.pushToken,
        title: `💬 ${payload.senderName || 'Nuovo messaggio'}`,
        body: payload.message.length > 100 
          ? payload.message.substring(0, 100) + '...' 
          : payload.message,
        data: {
          type: 'chat' as const,
          roomId: payload.roomId,
          messageId: payload.messageId,
          senderId: payload.senderId,
        }
      }));

      // Invia le notifiche al server
      const response = await apiClient.post('/notifications/send-chat', {
        notifications,
        metadata: {
          roomId: payload.roomId,
          timestamp: payload.timestamp
        }
      });

      console.log('✅ [ChatNotification] Notifiche inviate con successo:', response.data);
    } catch (error) {
      console.error('❌ [ChatNotification] Errore nell\'invio notifiche:', error);
    }
  }

  /**
   * Ottieni i partecipanti di una room con i loro push token
   */
  private static async getRoomParticipants(roomId: number, excludeSenderId: string): Promise<{
    userId: string;
    pushToken: string;
    name?: string;
  }[]> {
    try {
      // Query per ottenere i partecipanti della room con i loro push token
      const { data: participants, error } = await supabase
        .from('room_participants')
        .select(`
          user_id,
          users:user_id (
            id,
            first_name,
            last_name,
            push_token
          )
        `)
        .eq('room_id', roomId)
        .neq('user_id', excludeSenderId); // Escludi il mittente

      if (error) {
        console.error('❌ [ChatNotification] Errore nel recupero partecipanti:', error);
        return [];
      }

      // Filtra solo gli utenti con push token
      const validParticipants = participants
        ?.filter((p: any) => p.users?.push_token)
        .map((p: any) => ({
          userId: p.user_id,
          pushToken: p.users.push_token,
          name: p.users.first_name ? `${p.users.first_name} ${p.users.last_name || ''}`.trim() : undefined
        })) || [];

      console.log('📱 [ChatNotification] Partecipanti trovati:', validParticipants.length);
      return validParticipants;
    } catch (error) {
      console.error('❌ [ChatNotification] Errore nel recupero partecipanti:', error);
      return [];
    }
  }

  /**
   * Registra un trigger per le notifiche chat in Supabase
   * Questo deve essere chiamato quando l'utente attiva le notifiche
   */
  static async setupChatNotificationTrigger(): Promise<void> {
    try {
      console.log('📱 [ChatNotification] Configurando trigger notifiche chat...');

      const currentUser = useUserDataStore.getState().user;
      if (!currentUser?._id) {
        console.log('📱 [ChatNotification] Nessun utente corrente trovato');
        return;
      }

      // Registra la funzione trigger per questo utente
      const response = await apiClient.post('/notifications/setup-chat-trigger', {
        userId: currentUser._id
      });

      console.log('✅ [ChatNotification] Trigger configurato con successo:', response.data);
    } catch (error) {
      console.error('❌ [ChatNotification] Errore nella configurazione trigger:', error);
    }
  }

  /**
   * Disabilita le notifiche chat per l'utente corrente
   */
  static async disableChatNotifications(): Promise<void> {
    try {
      console.log('📱 [ChatNotification] Disabilitando notifiche chat...');

      const currentUser = useUserDataStore.getState().user;
      if (!currentUser?._id) {
        return;
      }

      const response = await apiClient.post('/notifications/disable-chat', {
        userId: currentUser._id
      });

      console.log('✅ [ChatNotification] Notifiche chat disabilitate:', response.data);
    } catch (error) {
      console.error('❌ [ChatNotification] Errore nella disabilitazione:', error);
    }
  }

  /**
   * Marca messaggi come letti (per evitare notifiche duplicate)
   */
  static async markMessagesAsRead(roomId: number, userId: string, messageIds: number[]): Promise<void> {
    try {
      console.log('📱 [ChatNotification] Marcando messaggi come letti:', { roomId, messageIds: messageIds.length });

      const response = await apiClient.post('/notifications/mark-read', {
        roomId,
        userId,
        messageIds
      });

      console.log('✅ [ChatNotification] Messaggi marcati come letti:', response.data);
    } catch (error) {
      console.error('❌ [ChatNotification] Errore nel marcare come letti:', error);
    }
  }
}