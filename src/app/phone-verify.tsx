import OtpInput, { OtpInputHandle } from "@/components/core/otp-input";
import PhoneInput, { PhoneInputHandle } from "@/components/core/phone-input";
import ThemedButton from "@/components/core/themed-button";
import { ThemedText } from "@/components/core/themed-text";
import { ThemedView } from "@/components/core/themed-view";
import { ToastSheetRef } from "@/components/ui/sheets/ToastSheet";
import { Spacing } from "@/constants/theme";
import { handlePhoneNumberVerify } from "@/services/auth.service";
import { FirebaseAuthTypes, getAuth, linkWithCredential } from "@react-native-firebase/auth";
import React, { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { PhoneAuthProvider } from '@react-native-firebase/auth'

import PhoneAuthSnapshot = FirebaseAuthTypes.PhoneAuthSnapshot;

const PhoneVerify = () => {
  const phoneRef = useRef<PhoneInputHandle>(null);
  const otpRef = useRef<OtpInputHandle>(null);
  const [loading, setLoading] = useState(false);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [phoneAuthSnapshot, setPhoneAuthSnapshot] = useState<PhoneAuthSnapshot>();
  const [isCodeError, setIsCodeError] = useState(false);
  
  const handlePhoneNumberSubmit = () => {
    const isValid = phoneRef.current?.validate();
    if (!isValid) return;
    
    const phone = phoneRef.current?.getRawValue();
    if (!phone) return;
    
    setLoading(true)
    handlePhoneNumberVerify(`+${phone}`).then((snapshot) => {
      if (!snapshot) {
        ToastSheetRef.current?.open({
          type: 'error',
          title: 'Error',
          message: 'Something went wrong! Please try again',
        })
      } else {
        setPhoneAuthSnapshot(snapshot);
        ToastSheetRef.current?.open({
          type: 'info',
          title: 'Code Sent',
          message: `We've sent the code to +${phone}`,
        })
      }
    }).finally(() => setLoading(false))
  }
  
  const handleConfirmCode = async (code: string) => {
    try {
      setIsCodeLoading(true);
      const currentUser = getAuth().currentUser
      if (currentUser) {
        await linkWithCredential(currentUser, PhoneAuthProvider.credential(phoneAuthSnapshot?.verificationId, code))
      }
    } catch (error) {
      setIsCodeError(true);
      if (error.code == 'auth/invalid-verification-code') {
        ToastSheetRef.current?.open({
          type: 'error',
          title: 'Error',
          message: 'Invalid verification code',
        })
      } else {
        ToastSheetRef.current?.open({
          type: 'error',
          title: 'Error',
          message: 'Account linking error. Please contact support.',
        })
      }
      otpRef.current?.clear();
      otpRef.current?.focus();
    } finally {
      setIsCodeLoading(false)
      Keyboard.dismiss()
    }
  }
  
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={'height'} style={{ flex: 1 }}>
        {phoneAuthSnapshot ? (
          <Animated.View key={'otp-input'} entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
            <ThemedView type={'background'} style={styles.container}>
              <View style={{ alignSelf: 'center' }}>
                <ThemedText type={'display'}>Verification Code</ThemedText>
              </View>
              <ThemedView style={styles.contentContainer}>
                <OtpInput
                  ref={otpRef}
                  length={6}
                  masked={false}
                  onComplete={handleConfirmCode}
                  error={isCodeError}
                  onChange={() => setIsCodeError(false)}
                />
                <ThemedView>
                  <ThemedButton
                    loading={isCodeLoading}
                    size={'large'} label={'Verify'}
                    onPress={() => otpRef.current?.submit()}/>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </Animated.View>
        ) : (
          <Animated.View key={'phone-input'} entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
            <ThemedView type={'background'} style={styles.container}>
              <View style={{ alignSelf: 'center' }}>
                <ThemedText type={'display'}>Phone Number</ThemedText>
              </View>
              <ThemedView style={styles.contentContainer}>
                <PhoneInput
                  ref={phoneRef}
                  placeholder="+62 812 3456 7890"
                />
                <ThemedView>
                  <ThemedButton
                    loading={loading}
                    size={'large'} label={'Send Code'}
                    onPress={handlePhoneNumberSubmit}/>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.six,
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
  }
})

export default PhoneVerify
