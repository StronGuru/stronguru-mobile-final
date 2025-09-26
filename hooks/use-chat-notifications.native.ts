import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { useUserDataStore } from '@/src/store/userDataStore';
import { ChatNotificationService } from '@/src/services/chatNotificationService';
import * as Notifications from 'expo-notifications';

/**
 * Hook per gestire le notifiche push per la chat
 * Si integra con il sistema di notifiche esistente
 */
export const useChatNotifications = () => {
  const { isAuthenticated, pushToken } = useAuthStore();
  const { user } = useUserDataStore();

  // Setup delle notifiche chat quando l'utente è autenticato e ha un push token
  useEffect(() => {
    if (isAuthenticated && pushToken && user?._id) {
      console.log('📱 [UseChatNotifications] Configurando notifiche chat per utente:', user._id);
      ChatNotificationService.setupChatNotificationTrigger();
    }
  }, [isAuthenticated, pushToken, user?._id]);

  const handleChatNotificationReceived = useCallback((data: any) => {
    // Logica per gestire notifica chat ricevuta
    // Ad esempio: incrementare badge, riprodurre suono personalizzato, etc.
    console.log('📱 [UseChatNotifications] Gestendo notifica chat ricevuta');
    
    // Esempio: impostare un badge specifico per le chat
    // setBadgeCount(currentCount + 1);
  }, []);

  const handleChatNotificationTap = useCallback((data: any) => {
    // Logica per navigare alla chat quando si tappa la notifica
    console.log('📱 [UseChatNotifications] Navigando alla chat room:', data.roomId);
    
    // Esempio di navigazione (da implementare secondo la tua struttura di routing)
    // navigation.navigate('Chat', { 
    //   screen: 'ChatRoom', 
    //   params: { roomId: data.roomId } 
    // });
    
    // Marca il messaggio come letto
    if (data.messageId && user?._id) {
      ChatNotificationService.markMessagesAsRead(
        data.roomId, 
        user._id, 
        [data.messageId]
      );
    }
  }, [user?._id]);

  const enableChatNotifications = useCallback(async () => {
    try {
      await ChatNotificationService.setupChatNotificationTrigger();
      console.log('✅ [UseChatNotifications] Notifiche chat abilitate');
    } catch (error) {
      console.error('❌ [UseChatNotifications] Errore nell\'abilitazione:', error);
    }
  }, []);

  const disableChatNotifications = useCallback(async () => {
    try {
      await ChatNotificationService.disableChatNotifications();
      console.log('✅ [UseChatNotifications] Notifiche chat disabilitate');
    } catch (error) {
      console.error('❌ [UseChatNotifications] Errore nella disabilitazione:', error);
    }
  }, []);

  const markRoomAsRead = useCallback(async (roomId: number, messageIds: number[]) => {
    if (!user?._id) return;
    
    try {
      await ChatNotificationService.markMessagesAsRead(roomId, user._id, messageIds);
      console.log('✅ [UseChatNotifications] Room marcata come letta');
    } catch (error) {
      console.error('❌ [UseChatNotifications] Errore nel marcare come letta:', error);
    }
  }, [user?._id]);

  return {
    enableChatNotifications,
    disableChatNotifications,
    markRoomAsRead,
    isReady: isAuthenticated && !!pushToken && !!user?._id
  };
};