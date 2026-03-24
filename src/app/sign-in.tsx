import { MapIconEntering } from "@/components/map-icon-entering";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { StyleSheet } from "react-native";

const SignIn = () => {
  return (
    <ThemedView style={styles.container}>
      <MapIconEntering />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default SignIn
