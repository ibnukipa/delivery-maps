import { ToastSheetRef } from "@/components/ui/sheets/ToastSheet";
import {
  createUserWithEmailAndPassword, getAuth, signOut, verifyPhoneNumber, signInWithEmailAndPassword,
  FirebaseAuthTypes
} from "@react-native-firebase/auth";
import PhoneAuthSnapshot = FirebaseAuthTypes.PhoneAuthSnapshot;

// lib/auth-error-codes.ts
export const AuthErrorCodes = {
  // Email / password
  EMAIL_EXISTS:          'auth/email-already-in-use',
  INVALID_EMAIL:         'auth/invalid-email',
  INVALID_PASSWORD:      'auth/wrong-password',
  WEAK_PASSWORD:         'auth/weak-password',
  USER_NOT_FOUND:        'auth/user-not-found',
  USER_DISABLED:         'auth/user-disabled',
  
  // Credentials
  INVALID_CREDENTIAL:    'auth/invalid-credential',
  CREDENTIAL_IN_USE:     'auth/credential-already-in-use',
  PROVIDER_ALREADY_LINKED: 'auth/provider-already-linked',
  
  // Session
  TOKEN_EXPIRED:         'auth/user-token-expired',
  INVALID_USER_TOKEN:    'auth/invalid-user-token',
  REQUIRES_RECENT_LOGIN: 'auth/requires-recent-login',
  
  // Network
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  
  // Too many requests
  TOO_MANY_REQUESTS:     'auth/too-many-requests',
  
  // Operation
  OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
  POPUP_CLOSED:          'auth/popup-closed-by-user',
} as const;

export type AuthErrorCode = typeof AuthErrorCodes[keyof typeof AuthErrorCodes];

export const AuthErrorMessages = {
  [AuthErrorCodes.EMAIL_EXISTS]: 'Email address already exists',
  [AuthErrorCodes.INVALID_EMAIL]: 'Invalid email address',
  [AuthErrorCodes.INVALID_PASSWORD]: 'Invalid password',
  [AuthErrorCodes.WEAK_PASSWORD]: 'Weak password',
  [AuthErrorCodes.USER_NOT_FOUND]: 'User not found',
  [AuthErrorCodes.USER_DISABLED]: 'User disabled',
  [AuthErrorCodes.INVALID_CREDENTIAL]: 'Invalid credential',
  [AuthErrorCodes.CREDENTIAL_IN_USE]: 'Credential already in use',
  [AuthErrorCodes.PROVIDER_ALREADY_LINKED]: 'Provided link already linked',
  [AuthErrorCodes.TOKEN_EXPIRED]: 'Token expired',
  [AuthErrorCodes.INVALID_USER_TOKEN]: 'Invalid token',
  [AuthErrorCodes.REQUIRES_RECENT_LOGIN]: 'Request recent login',
  [AuthErrorCodes.NETWORK_REQUEST_FAILED]: 'Network connection error',
  [AuthErrorCodes.TOO_MANY_REQUESTS]: 'Too many requests',
  [AuthErrorCodes.OPERATION_NOT_ALLOWED]: 'No request available',
  [AuthErrorCodes.POPUP_CLOSED]: 'Popup CLOSED'
}

const handleEmailPasswordSignIn = (email: string, password: string) => {
  return createUserWithEmailAndPassword(getAuth(), email, password).catch(err => {
    const errorCode = err.code as AuthErrorCode
    if (errorCode === AuthErrorCodes.EMAIL_EXISTS) {
      return signInWithEmailAndPassword(getAuth(), email, password).catch(err => {
        const errorCode = err.code as AuthErrorCode
        ToastSheetRef.current?.open({
          type: 'error',
          title: 'Auth Error',
          message: AuthErrorMessages[errorCode]
        })
      })
    } else {
      ToastSheetRef.current?.open({
        type: 'error',
        title: 'Auth Error',
        message: AuthErrorMessages[errorCode]
      })
    }
  });
}

const handleSignOut = () => {
  return signOut(getAuth())
}

const handlePhoneNumberVerify = (phoneNumber: string): Promise<PhoneAuthSnapshot> => {
  return verifyPhoneNumber(getAuth(), phoneNumber, true)
    .catch((error) => {
      ToastSheetRef.current?.open({
        type: 'error',
        title: 'Verification Failed',
        message: error.message
      })
    })
}

const getCurrentUser = () => {
  return getAuth().currentUser;
}

export {
  getCurrentUser,
  handleEmailPasswordSignIn,
  handlePhoneNumberVerify,
  handleSignOut
}
