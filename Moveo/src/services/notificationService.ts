import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Configuración del comportamiento de las notificaciones
 * cuando la app está en primer plano (foreground)
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Solicita permisos para mostrar notificaciones
 */
export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Si no tiene permisos, solicitarlos
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permisos de notificación no concedidos');
    return false;
  }

  return true;
}

/**
 * Registra el dispositivo para recibir notificaciones push
 * y obtiene el Expo Push Token
 */
export async function registerForPushNotifications() {
  // Verificar que estamos en un dispositivo físico
  if (!Device.isDevice) {
    console.warn('Las notificaciones push solo funcionan en dispositivos físicos');
    return null;
  }

  try {
    // Solicitar permisos
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // En Android, configurar el canal de notificación
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Obtener el Expo Push Token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    
    if (!projectId) {
      console.warn('No se encontró projectId. Asegúrate de tener EAS configurado.');
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    console.log('✅ Expo Push Token:', tokenData.data);
    return tokenData.data;
  } catch (error) {
    console.error('❌ Error al registrar notificaciones:', error);
    return null;
  }
}

/**
 * Muestra una notificación local
 */
export async function showLocalNotification(title: string, body: string, data?: any) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // null = mostrar inmediatamente
  });
}

/**
 * Cancela todas las notificaciones programadas
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
