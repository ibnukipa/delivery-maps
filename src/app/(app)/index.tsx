import ThemedButton from "@/components/core/themed-button";
import { ThemedText } from "@/components/core/themed-text";
import Deliveries from "@/components/ui/domain/deliveries";
import { SettingsSheetRef } from "@/components/ui/sheets/SettingsSheet";
import { useColorTheme } from "@/hooks/use-color-theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/core/themed-view';
import { Spacing } from '@/constants/theme';
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const colors = useColorTheme()
  const router = useRouter()
  
  const handleToDeliveryRoute = () => {
    router.navigate('/delivery-route')
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <Animated.View style={styles.headerIconContainer} entering={FadeInLeft}>
          <Image style={styles.headerIcon} source={require('@/assets/images/splash-icon.png')} />
        </Animated.View>
        <ThemedText style={{ flex: 1 }} type={'h3'} themeColor={'primary'}>Delivery Maps</ThemedText>
        <Pressable onPress={SettingsSheetRef.current?.open}>
          <Ionicons name={'ellipsis-horizontal-circle-outline'} size={32} color={colors.primary} />
        </Pressable>
      </ThemedView>
      <Deliveries />
      <ThemedView style={[styles.footerContainer, { paddingBottom: insets.bottom + Spacing.three }]}>
        <ThemedButton size={'large'} label={'Deliver Now'} onPress={handleToDeliveryRoute} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two
  },
  headerIconContainer: {
    borderRadius: 12,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  headerIcon: {
    height: 24,
    width: 24,
  },
  container: {
    flex: 1,
  },
  footerContainer: {
    padding: Spacing.four,
    paddingTop: Spacing.three,
    borderTopEndRadius: Spacing.three,
    borderTopStartRadius: Spacing.three,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: -4,
        blurRadius: 8,
        spreadDistance: 0,
        color: 'rgba(0,0,0,0.05)',
      },
    ],
  }
});
