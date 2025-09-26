import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '@/src/store/authStore';
import { useNotificationAuth } from '@/hooks/use-notification-auth.native';
import { NotificationService } from '@/src/services/notificationService';
import { sendPushNotification } from '@/hooks/use-push-notifications.native';

export const NotificationTestPanel = () => {
  const { isAuthenticated, pushToken } = useAuthStore();
  const { isReady, error } = useNotificationAuth();

  const handleTestNotification = async () => {
    if (!pushToken) {
      Alert.alert('Errore', 'Push token non disponibile');
      return;
    }

    // Se è un token di debug (emulatore), non inviare notifica reale
    if (pushToken.includes('DEBUG-')) {
      console.log('🛠️ [NotificationTest] Token DEBUG rilevato - simulando invio notifica...');
      Alert.alert(
        'Debug Mode 🛠️', 
        'Token di debug rilevato!\n\nLa notifica non può essere inviata realmente su emulatore, ma il sistema di registrazione funziona correttamente.\n\nPer testare notifiche reali usa un dispositivo fisico.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    try {
      await sendPushNotification(
        pushToken,
        'Test Notifica 🔔',
        'Questa è una notifica di test da Stronguru!',
        { screen: 'home', action: 'test' }
      );
      Alert.alert('Successo', 'Notifica di test inviata!');
    } catch (error) {
      Alert.alert('Errore', 'Impossibile inviare la notifica di test');
      console.error('Errore invio notifica test:', error);
    }
  };

  const handleClearBadge = async () => {
    try {
      await NotificationService.setBadgeCount(0);
      Alert.alert('Successo', 'Badge rimosso!');
    } catch (error) {
      Alert.alert('Errore', 'Impossibile rimuovere il badge');
      console.error('Errore rimozione badge:', error);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await NotificationService.clearAllNotifications();
      Alert.alert('Successo', 'Tutte le notifiche sono state rimosse!');
    } catch (error) {
      Alert.alert('Errore', 'Impossibile rimuovere le notifiche');
      console.error('Errore rimozione notifiche:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <View className="p-4 bg-yellow-100 rounded">
        <Text className="text-yellow-800">Login richiesto per le notifiche push</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-white rounded shadow">
      <Text className="text-lg font-bold mb-4">🔔 Stato Notifiche Push (Debug)</Text>
      
      <View className="mb-4">
        <Text className="font-semibold">Stato: {isReady ? '✅ Pronto' : '⏳ In attesa...'}</Text>
        <Text className="text-sm text-gray-600 mt-1">Auth: {isAuthenticated ? '✅ Loggato' : '❌ Non loggato'}</Text>
        {error && <Text className="text-red-600 mt-1">❌ Errore: {error.message}</Text>}
        {pushToken && (
          <View className="mt-2">
            <Text className="text-sm font-medium text-gray-800">Push Token (Store):</Text>
            <Text className="text-xs text-gray-600 mt-1 font-mono">
              {pushToken.substring(0, 40)}...
            </Text>
          </View>
        )}
        
        <View className="mt-3 p-2 bg-gray-100 rounded">
          <Text className="text-xs text-gray-700 font-semibold">Debug Info:</Text>
          <Text className="text-xs text-gray-600">• Apri React Native Debugger/Metro per vedere i log completi</Text>
          <Text className="text-xs text-gray-600">• I log iniziano con 🔔 [PushNotifications] e 📱 [NotificationService]</Text>
          {pushToken?.includes('DEBUG-') ? (
            <Text className="text-xs text-orange-600 font-medium">🛠️ MODALITÀ DEBUG: Token fittizio per emulatore</Text>
          ) : (
            <Text className="text-xs text-green-600 font-medium">✅ Token reale da dispositivo fisico</Text>
          )}
          <Text className="text-xs text-red-600 font-medium">• IMPORTANTE: Notifiche funzionano solo su device fisici!</Text>
        </View>
      </View>

      {isReady && (
        <View className="space-y-2">
          <TouchableOpacity 
            onPress={handleTestNotification}
            className="bg-blue-500 p-3 rounded"
          >
            <Text className="text-white text-center font-semibold">
              {pushToken?.includes('DEBUG-') ? 'Test Debug Mode 🛠️' : 'Invia Notifica Test'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleClearBadge}
            className="bg-green-500 p-3 rounded"
          >
            <Text className="text-white text-center font-semibold">Rimuovi Badge</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleClearNotifications}
            className="bg-orange-500 p-3 rounded"
          >
            <Text className="text-white text-center font-semibold">Cancella Tutte le Notifiche</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};