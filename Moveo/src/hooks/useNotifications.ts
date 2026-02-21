import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useLastNotificationResponse } from 'expo-notifications';
import { registerForPushNotifications } from '../services/notificationService';

/**
 * Hook para gestionar notificaciones push
 * 
 * Maneja 3 escenarios según la teoría:
 * 1. App en foreground: captura notificaciones entrantes
 * 2. App en background/terminated: captura interacción del usuario
 * 3. App iniciada desde notificación: captura última respuesta
 */
export function useNotifications() {
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  
  // Hook para capturar cuando la app se abre desde una notificación (terminated → open)
  const lastResponse = useLastNotificationResponse();

  useEffect(() => {
    // Solo en dispositivos móviles
    if (Platform.OS === 'web') return;

    // Registrar dispositivo para recibir notificaciones push (con manejo de errores)
    registerForPushNotifications().catch((error) => {
      console.warn('Error registrando notificaciones (no crítico):', error);
    });

    // 1️⃣ FOREGROUND: Listener para notificaciones recibidas cuando la app está abierta
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const body = notification.request.content.body ?? 'Notificación recibida';
      console.log('📬 Notificación recibida en foreground:', body);
      setLastNotification(body);
    });

    // 2️⃣ BACKGROUND/TERMINATED: Listener para cuando el usuario interactúa con la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('👆 Usuario interactuó con la notificación:', data);
      
      // Aquí puedes implementar navegación según los datos
      // Ejemplo: router.push(`/cliente/${data.clientId}`);
    });

    // Cleanup al desmontar
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // 3️⃣ APP INICIADA DESDE NOTIFICACIÓN: Capturar última interacción tras arranque
  useEffect(() => {
    if (!lastResponse) return;

    const data = lastResponse.notification.request.content.data;
    console.log('🚀 App iniciada desde notificación:', data);
    
    // Aquí puedes implementar navegación diferida
    // Ejemplo: router.push(`/screen/${data.screen}`);
  }, [lastResponse]);

  return {
    lastNotification,
    expoPushToken: null, // Podrías guardarlo desde registerForPushNotifications si lo necesitas
  };
}
