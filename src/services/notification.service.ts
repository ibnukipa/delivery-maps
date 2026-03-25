import { getCurrentUser } from "@/services/auth.service";
import {
  getMessaging, requestPermission, getToken, onTokenRefresh, AuthorizationStatus,
  registerDeviceForRemoteMessages
} from '@react-native-firebase/messaging';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';

export async function registerFCMToken() {
  const authStatus = await requestPermission(getMessaging());
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;
  
  if (!enabled) return;

  await registerDeviceForRemoteMessages(getMessaging())
  const token = await getToken(getMessaging());
  const uid = getCurrentUser()?.uid;
  if (!uid || !token) return;
  
  await setDoc(doc(getFirestore(), "driverTokens", uid), {
    fcmToken: token,
    updatedAt: serverTimestamp(),
  });
}

export async function unregisterFCMToken() {
  const uid = getCurrentUser()?.uid;
  if (!uid) return;
  
  await setDoc(doc(getFirestore(), 'driverTokens', uid), {
    fcmToken: null,
    updatedAt: serverTimestamp(),
  });
}

export function listenForTokenRefresh() {
  return onTokenRefresh(getMessaging(), async (token) => {
    const uid = getCurrentUser()?.uid;
    if (!uid) return;
    
    await setDoc(doc(getFirestore(), 'driverTokens', uid), {
      fcmToken: token,
      updatedAt: serverTimestamp(),
    });
  });
}
