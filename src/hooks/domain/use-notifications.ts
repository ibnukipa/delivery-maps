import { useEffect } from 'react';
import { getMessaging, onMessage, onNotificationOpenedApp, getInitialNotification } from '@react-native-firebase/messaging';
import { useRouter } from 'expo-router';
import {
  registerFCMToken,
  listenForTokenRefresh,
} from '@/services/notification.service';

function useNotifications() {
  const router = useRouter();
  
  useEffect(() => {
    // register token on mount
    registerFCMToken();
    
    // listen for token refresh
    const unsubscribeRefresh = listenForTokenRefresh();
    
    // foreground — Firebase does NOT auto-show heads-up in foreground
    const unsubscribeForeground = onMessage(getMessaging(), async (remoteMessage) => {
      console.log('Foreground notification:', remoteMessage);
    });
    
    // background tap — app was in background, user tapped notification
    const unsubscribeBackground = onNotificationOpenedApp(
      getMessaging(),
      (remoteMessage) => {
        // if (remoteMessage.data?.screen === 'deliveries') {
        //   router.push('/');
        // }
      }
    );
    
    // killed app tap — app was closed, user tapped notification
    getInitialNotification(getMessaging())
      .then((remoteMessage) => {
        // if (remoteMessage?.data?.screen === 'deliveries') {
        //   router.push('/');
        // }
      });
    
    return () => {
      unsubscribeRefresh();
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);
}

export default useNotifications
