import { getCurrentUser } from "@/services/auth.service";
import {
  getMessaging, requestPermission, getToken, onTokenRefresh, AuthorizationStatus,
  registerDeviceForRemoteMessages
} from '@react-native-firebase/messaging';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { PermissionsAndroid, Platform } from "react-native";

async function requestUserNotificationPermission() {
  let enabled = false;
  const firebasePermissionResult = await requestPermission(getMessaging());
  if (Platform.OS === "ios") {
    enabled =
      firebasePermissionResult === AuthorizationStatus.AUTHORIZED ||
      firebasePermissionResult === AuthorizationStatus.PROVISIONAL;
  } else if (Platform.OS === "android") {
    if (Platform.Version < 33) {
      return true;
    }
    const nativePermissionResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    enabled = nativePermissionResult === PermissionsAndroid.RESULTS.GRANTED;
  }
  return enabled;
}

export async function registerFCMToken() {
  await requestUserNotificationPermission()
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
