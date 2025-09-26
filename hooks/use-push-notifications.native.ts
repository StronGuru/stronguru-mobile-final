import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  error?: Error;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const [error, setError] = useState<Error | undefined>();

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  async function registerForPushNotificationsAsync() {
    let token;
    
    console.log('🔔 [PushNotifications] Inizializzazione...', { 
      platform: Platform.OS, 
      isDevice: Device.isDevice 
    });

    if (Platform.OS === 'android') {
      console.log('🔔 [PushNotifications] Configurando canale Android...');
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      console.log('🔔 [PushNotifications] Canale Android configurato');
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.error('🔔 [PushNotifications] Permessi NON concessi:', finalStatus);
        throw new Error('Permessi per le notifiche push non concessi!');
      }
      
      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        console.log('🔔 [PushNotifications] Project ID:', projectId);
        console.log('🔔 [PushNotifications] Constants.expoConfig:', Constants?.expoConfig?.name);
        console.log('🔔 [PushNotifications] Constants.easConfig:', Constants?.easConfig);
        
        if (!projectId) {
          console.error('🔔 [PushNotifications] Project ID non trovato!');
          console.log('🔔 [PushNotifications] Tentativo con slug...');
          const slug = Constants?.expoConfig?.slug;
          console.log('🔔 [PushNotifications] Slug trovato:', slug);
          
          if (slug) {
            token = await Notifications.getExpoPushTokenAsync();
            console.log('🔔 [PushNotifications] Token generato con slug:', token);
          } else {
            throw new Error('Project ID e Slug non trovati - necessari per Expo Push Notifications');
          }
        } else {
          token = await Notifications.getExpoPushTokenAsync({
            projectId,
          });
          console.log('🔔 [PushNotifications] Token generato con projectId:', token);
        }
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Errore sconosciuto nella generazione del token';
        console.error('Errore nel generare il push token:', errorMessage);
        throw new Error(`Errore nel generare il push token: ${errorMessage}`);
      }
    } else {
      console.warn('🔔 [PushNotifications] ATTENZIONE: Simulatore/Emulatore rilevato!');
      console.warn('🔔 [PushNotifications] Le notifiche push NON funzionano su simulatori.');
      console.warn('🔔 [PushNotifications] 🛠️ DEBUG MODE: Generando token fittizio per test...');
      
      // Genera un token fittizio FISSO per debug su emulatore
      const mockToken = `ExponentPushToken[DEBUG-${Platform.OS}-FIXED]`;
      token = {
        data: mockToken,
        type: 'expo' as const,
      };

      
      console.log('🔔 [PushNotifications] 🛠️ Token DEBUG generato:', token);
      console.log('🔔 [PushNotifications] ⚠️ RICORDA: Questo è solo per debug! Su device fisico usa token reale.');
    }

    return token;
  }

  useEffect(() => {
    // Configurazione di come gestire le notifiche quando l'app è in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    registerForPushNotificationsAsync()
      .then(token => {
        setExpoPushToken(token);
        console.log('Push token registrato con successo:', token);
      })
      .catch((error: Error) => {
        console.error('Errore nella registrazione del push token:', error);
        setError(error);
      });

    // Listener per notifiche ricevute quando l'app è in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notifica ricevuta:', notification);
      setNotification(notification);
    });

    // Listener per quando l'utente interagisce con una notifica
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Risposta alla notifica:', response);
      // Qui puoi gestire la navigazione o altre azioni basate sulla notifica
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
    error,
  };
};

// Funzione helper per inviare notifiche (utile per test)
export async function sendPushNotification(expoPushToken: string, title: string, body: string, data?: object) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}