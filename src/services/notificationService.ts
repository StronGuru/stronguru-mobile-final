import * as Notifications from 'expo-notifications';
import apiClient from '@/api/apiClient';

export interface PushTokenData {
  pushToken: string;
  deviceType: 'mobile';
  deviceModel?: string;
  deviceOS?: string;
}

export class NotificationService {
  /**
   * Registra il push token sul server
   */
  static async registerPushToken(tokenData: PushTokenData): Promise<void> {
    try {
      console.log('📱 [NotificationService] Registrando push token sul server...');
      console.log('📱 [NotificationService] Token data:', {
        ...tokenData,
        pushToken: tokenData.pushToken.substring(0, 30) + '...'
      });
      
      // Controlla se è un token di debug (simulatore/emulatore)
      if (tokenData.pushToken.includes('DEBUG-')) {
        console.log('🛠️ [NotificationService] Token DEBUG rilevato - SIMULANDO chiamata API...');
        console.log('🛠️ [NotificationService] In produzione questo sarebbe inviato al server');
        
        // Simula una risposta di successo dopo un piccolo delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('✅ [NotificationService] Registrazione DEBUG completata (simulata)');
        console.log('⚠️ [NotificationService] RICORDA: Su device fisico verrà fatta chiamata API reale');
        return;
      }
      
      const response = await apiClient.post('/notifications/register-token', tokenData);
      
      console.log('✅ [NotificationService] Push token registrato con successo:', response.data);
      console.log('📱 [NotificationService] Response status:', response.status);
    } catch (error: any) {
      console.error('❌ [NotificationService] Errore nella registrazione del push token:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  /**
   * Rimuove il push token dal server (da chiamare al logout)
   */
  static async unregisterPushToken(pushToken: string): Promise<void> {
    try {
      console.log('📱 [NotificationService] Rimuovendo push token dal server...');
      console.log('📱 [NotificationService] Token:', pushToken.substring(0, 30) + '...');
      
      // Controlla se è un token di debug (simulatore/emulatore)
      if (pushToken.includes('DEBUG-')) {
        console.log('🛠️ [NotificationService] Token DEBUG rilevato - SIMULANDO rimozione...');
        console.log('🛠️ [NotificationService] In produzione questo sarebbe rimosso dal server');
        
        // Simula una risposta di successo dopo un piccolo delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('✅ [NotificationService] Rimozione DEBUG completata (simulata)');
        return;
      }
      
      const response = await apiClient.delete('/notifications/unregister-token', {
        data: { pushToken }
      });
      
      console.log('✅ [NotificationService] Push token rimosso con successo:', response.data);
      console.log('📱 [NotificationService] Response status:', response.status);
    } catch (error: any) {
      console.error('❌ [NotificationService] Errore nella rimozione del push token:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      // Non facciamo throw dell'errore per non bloccare il logout
    }
  }

  /**
   * Aggiorna le preferenze per le notifiche
   */
  static async updateNotificationPreferences(preferences: {
    chat: boolean;
    events: boolean;
    reminders: boolean;
  }): Promise<void> {
    try {
      console.log('Aggiornando preferenze notifiche:', preferences);
      
      const response = await apiClient.put('/notifications/preferences', preferences);
      
      console.log('Preferenze notifiche aggiornate:', response.data);
    } catch (error) {
      console.error('Errore nell\'aggiornamento delle preferenze:', error);
      throw error;
    }
  }

  /**
   * Cancella tutte le notifiche locali
   */
  static async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('Tutte le notifiche locali sono state cancellate');
    } catch (error) {
      console.error('Errore nella cancellazione delle notifiche:', error);
    }
  }

  /**
   * Cancella una notifica specifica
   */
  static async dismissNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.dismissNotificationAsync(notificationId);
      console.log('Notifica cancellata:', notificationId);
    } catch (error) {
      console.error('Errore nella cancellazione della notifica:', error);
    }
  }

  /**
   * Ottiene il numero di notifiche non lette
   */
  static async getBadgeCount(): Promise<number> {
    try {
      const badgeCount = await Notifications.getBadgeCountAsync();
      return badgeCount;
    } catch (error) {
      console.error('Errore nel recupero del badge count:', error);
      return 0;
    }
  }

  /**
   * Imposta il numero di notifiche non lette
   */
  static async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log('Badge count impostato a:', count);
    } catch (error) {
      console.error('Errore nell\'impostazione del badge count:', error);
    }
  }
}