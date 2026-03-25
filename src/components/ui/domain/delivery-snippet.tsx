import { ThemedText } from "@/components/core/themed-text";
import { ThemedView } from "@/components/core/themed-view";
import { Spacing } from "@/constants/theme";
import { Delivery } from "@/types/delivery";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const DeliverySnippet = ({ deliver }: { deliver: Delivery }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <ThemedView type={'primaryContainer'} style={styles.container}>
        <View style={styles.headerContainer}>
          <ThemedText numberOfLines={1} style={{ flex: 1 }}>#{deliver.id}asdf</ThemedText>
          <ThemedView type={'secondaryYellowContainer'} style={styles.statusContainer}>
            <ThemedText
              type={'smallBold'}
              themeColor={'onSecondaryYellowContainer'}
              style={styles.status}>{deliver.status}</ThemedText>
          </ThemedView>
        </View>
        <View style={styles.contentContainer}>
          <ThemedText themeColor={'primary'} type={'h3'}>{deliver.customerName}</ThemedText>
          <ThemedText themeColor={'textSecondary'} numberOfLines={2}>{deliver.customerAddress}</ThemedText>
        </View>
      </ThemedView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.three
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  statusContainer: {
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center'
  },
  status: {
    textTransform: 'uppercase'
  },
  contentContainer: {
    gap: Spacing.one
  }
})

export default DeliverySnippet
