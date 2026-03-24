import React from "react";
import { StyleSheet } from 'react-native';

import { MapIconEntering } from '@/components/map-icon-entering';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.heroSection}>
        <MapIconEntering />
      </ThemedView>
      <ThemedView type="backgroundElement" style={styles.stepContainer}>
        <HintRow
          title="Try editing"
          hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
        />
        <HintRow
          title="Fresh start"
          hint={<ThemedText type="code">npm run reset-project</ThemedText>}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
