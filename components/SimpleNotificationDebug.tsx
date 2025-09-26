import React from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '@/src/store/authStore';

export const SimpleNotificationDebug = () => {
  const { isAuthenticated, pushToken } = useAuthStore();

  return (
    <View className="p-4 bg-white rounded shadow">
      <Text className="text-lg font-bold mb-4">🔔 Debug Notifiche (Semplificato)</Text>
      
      <View className="mb-4">
        <Text className="font-semibold">Auth: {isAuthenticated ? '✅ Loggato' : '❌ Non loggato'}</Text>
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
          <Text className="text-xs text-gray-600">• Componente semplificato per debug</Text>
          <Text className="text-xs text-gray-600">• Nessun hook che potrebbe causare crash</Text>
          <Text className="text-xs text-red-600 font-medium">• Se questo funziona, il problema è nell&apos;hook useNotificationAuth</Text>
        </View>
      </View>
    </View>
  );
};