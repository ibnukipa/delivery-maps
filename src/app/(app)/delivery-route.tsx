import ThemedButton from "@/components/core/themed-button";
import { ThemedView } from "@/components/core/themed-view";
import { Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const DeliveryRoute = () => {
  const router = useRouter()
  return (
    <ThemedView style={styles.container}>
      <ThemedButton type={'ghost'} size={'large'} label={'Back'} onPress={router.back} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'center'
  }
})

export default DeliveryRoute
