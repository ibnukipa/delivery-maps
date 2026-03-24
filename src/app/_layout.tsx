import SplashOverlayEntering from "@/components/animations/splash-overlay-entering";
import SettingsSheet, { SettingsSheetRef } from "@/components/ui/sheets/SettingsSheet";
import ToastSheet, { ToastSheetRef } from "@/components/ui/sheets/ToastSheet";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router'
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
});

const RootNavigator = () => {
  const { authUser, authLoading } = useAuth()
  
  useEffect(() => {
    if (!authLoading) {
      SplashScreen.hide()
    }
  }, [authLoading]);
  
  return (
    <Stack>
      <Stack.Protected guard={!authUser?.phoneNumber && !!authUser}>
        <Stack.Screen options={{ headerShown: false }} name={'phone-verify'} />
      </Stack.Protected>

      <Stack.Protected guard={!!authUser}>
        <Stack.Screen options={{ headerShown: false }} name="(app)"/>
      </Stack.Protected>
      
      <Stack.Protected guard={!authUser}>
        <Stack.Screen options={{ headerShown: false }} name="sign-in"/>
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <KeyboardProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <BottomSheetModalProvider>
              <SplashOverlayEntering/>
              <RootNavigator/>
              <ToastSheet ref={ToastSheetRef}/>
              <SettingsSheet ref={SettingsSheetRef}/>
            </BottomSheetModalProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
