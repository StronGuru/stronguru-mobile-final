import { useEffect, useCallback, useRef } from 'react';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { usePushNotifications } from './use-push-notifications.native';
import { useAuthStore } from '@/src/store/authStore';
import { NotificationService } from '@/src/services/notificationService';

/**
 * Hook che integra le notifiche push con l'auth store
 * Gestisce automaticamente la registrazione del token dopo il login
 */
export const useNotificationAuth = () => {
  const { expoPushToken, error } = usePushNotifications();
  const { isAuthenticated, setPushToken, pushToken } = useAuthStore();
  const lastRegisteredToken = useRef<string | null>(null);

  const registerTokenOnServer = useCallback(async (token: string) => {
    try {
      console.log('🔔 [NotificationAuth] Registrando token sul server...');
      const deviceInfo = {
        pushToken: token,
        deviceType: 'mobile' as const,
        deviceModel: Device.modelName || undefined,
        deviceOS: Platform.OS === 'ios' ? `iOS ${Device.osVersion}` : `Android ${Device.osVersion}`,
      };
      
      await NotificationService.registerPushToken(deviceInfo);
      console.log('✅ [NotificationAuth] Push token registrato con successo sul server');
    } catch (error) {
      console.error('❌ [NotificationAuth] Errore nella registrazione del push token:', error);
    }
  }, []);

  const unregisterTokenFromServer = useCallback(async (token: string) => {
    try {
      console.log('🔔 [NotificationAuth] Rimuovendo token dal server:', token.substring(0, 30) + '...');
      await NotificationService.unregisterPushToken(token);
      console.log('✅ [NotificationAuth] Push token rimosso con successo dal server');
    } catch (error) {
      console.error('❌ [NotificationAuth] Errore nella rimozione del push token:', error);
    }
  }, []);

  // Effetto per aggiornare il token quando viene ricevuto
  useEffect(() => {    
    if (expoPushToken?.data && isAuthenticated) {
      const tokenString = expoPushToken.data;
      
      // Aggiorna il token nello store se è diverso da quello corrente
      if (pushToken !== tokenString) {
        console.log('🔔 [NotificationAuth] Aggiornando token nello store');
        setPushToken(tokenString);
      }
      
      // Registra sul server solo se è diverso dall'ultimo registrato
      if (lastRegisteredToken.current !== tokenString) {
        console.log('🔔 [NotificationAuth] Registrando nuovo token sul server');
        lastRegisteredToken.current = tokenString;
        registerTokenOnServer(tokenString);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expoPushToken?.data, isAuthenticated, pushToken]);

  // Effetto per pulire il token al logout
  useEffect(() => {
    if (!isAuthenticated && pushToken) {
      console.log('🔔 [NotificationAuth] Utente disconnesso, rimuovendo push token dal server');
      unregisterTokenFromServer(pushToken);
      setPushToken(null);
      lastRegisteredToken.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, pushToken]);

  return {
    pushToken: expoPushToken?.data || null,
    isReady: !!expoPushToken && !error,
    error,
  };
};