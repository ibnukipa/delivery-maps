import { ThemedText } from "@/components/core/themed-text";
import DeliverySnippet from "@/components/ui/domain/delivery-snippet";
import { Spacing } from "@/constants/theme";
import usePaginatedDeliveries from "@/hooks/domain/use-paginated-deliveries";
import { Delivery } from "@/types/delivery";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const Deliveries = () => {
  const { deliveries, loading, loadMore, hasMore } = usePaginatedDeliveries()

  const renderItem = useCallback(({ item }: { item: Delivery }) => {
    return <DeliverySnippet deliver={item}/>
  }, [])
  
  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.emptyContainer}>
          <ActivityIndicator size={'large'}/>
        </Animated.View>
      )
    }
    
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.emptyContainer}>
        <ThemedText type={'h4'} themeColor={'textSecondary'}>No Deliveries</ThemedText>
      </Animated.View>
    )
  }, [loading])
  
  const renderFooter = useCallback(() => {
    if (hasMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator />
        </View>
      )
    }
    
    return (
      <View style={styles.footerContainer}>
        <ThemedText themeColor={'textSecondary'}>All deliveries loaded</ThemedText>
      </View>
    )
  }, [hasMore])
  
  return (
    <FlatList
      data={deliveries}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: Spacing.four }]}
      onEndReached={hasMore ? loadMore : undefined}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
    />
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: Spacing.four,
    gap: Spacing.two,
    flexGrow: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: Spacing.two
  }
})

export default Deliveries
