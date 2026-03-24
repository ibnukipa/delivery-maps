import SplashOverlayEntering from "@/components/splash-overlay-entering";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router'
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
});

const RootNavigator = () => {
  const {authUser, authLoading} = useAuth()
  
  useEffect(() => {
    if (!authLoading) {
      SplashScreen.hide()
    }
  }, [authLoading]);
  
  return (
    <Stack>
      <Stack.Protected guard={!!authUser}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      
      <Stack.Protected guard={!authUser}>
        <Stack.Screen options={{ headerShown: false }} name="sign-in" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SplashOverlayEntering />
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
