import ThemedButton from "@/components/core/themed-button";
import { ThemedText } from "@/components/core/themed-text";
import { ThemedView } from "@/components/core/themed-view";
import { Spacing } from "@/constants/theme";
import useDeliveries from "@/hooks/domain/use-deliveries";
import useOptimisedRoute from "@/hooks/domain/use-optimised-route";
import { useColorTheme } from "@/hooks/use-color-theme";
import { OptimisedStop } from "@/services/map.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const DeliveryRoute = () => {
  const insets = useSafeAreaInsets();
  const colors = useColorTheme()
  const router = useRouter()
  const mapRef = useRef<MapView>(null);
  
  const { deliveries } = useDeliveries()
  const { driverLocation, route, optimising, markDelivered } = useOptimisedRoute(deliveries)
  
  const hasData = !optimising && (route?.stops.length ?? 0) > 0
  
  const renderDeliveryCard = useCallback(({item}: {item: OptimisedStop}) => {
    return (
      <Animated.View layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
        <ThemedView style={[styles.deliveryContainer, { borderColor: `${item.color}50`, borderWidth: 0.5, gap: Spacing.two }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
            <ThemedText numberOfLines={1} style={{ color: item.color, flex: 1 }} type={'h3'} themeColor={'text'}>{item.sequence}. {item.delivery.customerName}</ThemedText>
            <ThemedText themeColor={'textSecondary'}>{item.eta}</ThemedText>
          </View>
          <View>
            <ThemedText numberOfLines={2} themeColor={'textSecondary'}>{item.delivery.customerAddress}</ThemedText>
          </View>
          <ThemedButton onPress={() => markDelivered(item.delivery.id)} size={'small'} label={'Mark as delivered'} iconRight={<Ionicons color={colors.onPrimary} name={'checkmark-circle'} size={20} />} />
        </ThemedView>
      </Animated.View>
    )
  }, [markDelivered])
  
  useEffect(() => {
    if (driverLocation?.latitude && driverLocation?.longitude) {
      mapRef.current?.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 0)
    }
  }, [driverLocation]);
  
  return (
    <ThemedView style={styles.container} collapsable={false}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={true}
        mapPadding={{
          bottom: insets.bottom + Spacing.four + (hasData ? 150 + Spacing.three : 0),
          top: Spacing.four,
          right: Spacing.three,
          left: Spacing.four,
        }}
      >
        {route?.legPolylines.map((leg, i) => (
          <Polyline
            key={i}
            coordinates={leg.coordinates}
            strokeColor={leg.color}
            strokeWidth={4}
          />
        ))}
        {route?.stops.map((stop) => (
          <Marker
            key={stop.delivery.id}
            coordinate={{
              latitude: stop.delivery.customerAddressCoordinates.lat,
              longitude: stop.delivery.customerAddressCoordinates.lng,
            }}
            title={`${stop.sequence}. ${stop.delivery.customerName}`}
            description={stop.delivery.customerAddress}
          />
        ))}
      </MapView>
      <View style={styles.headerContainer} collapsable={false}>
        <ThemedView style={styles.headerSummaryContainer}>
          {optimising ? (
            <Animated.View style={styles.headerOptimisingContainer} entering={FadeIn} exiting={FadeOut}>
              <ActivityIndicator size={'small'} />
              <ThemedText themeColor={'textSecondary'}>
                Optimising...
              </ThemedText>
            </Animated.View>
          ) : hasData ? (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <ThemedText type={'h4'}>
                <ThemedText type={'h4'} themeColor={'primary'}>{route?.stops.length} stops</ThemedText>{' · '}
                <ThemedText type={'h4'} themeColor={'textSecondary'}>{route?.totalDistance}</ThemedText>{' · '}
                <ThemedText type={'h4'} themeColor={'success'}>{route?.totalDuration}</ThemedText>
              </ThemedText>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <ThemedText themeColor={'textSecondary'}>
                No Data
              </ThemedText>
            </Animated.View>
          )}
        </ThemedView>
        <Pressable onPress={router.back}>
          <ThemedView style={styles.headerIconClose}>
            <Ionicons color={colors.textSecondary} name={'close-circle-outline'} size={48}/>
          </ThemedView>
        </Pressable>
      </View>
      {hasData ? (
        <View style={[styles.contentContainer, { paddingBottom: insets.bottom + Spacing.four }]}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{ paddingHorizontal: Spacing.four, gap: Spacing.two }}
            data={route?.stops ?? []}
            keyExtractor={(item) => item.delivery.id}
            renderItem={renderDeliveryCard}
          />
        </View>
      ) : null}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
    padding: Spacing.four,
    flexDirection: 'row',
    gap: Spacing.two
  },
  headerSummaryContainer: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerOptimisingContainer: {
    flexDirection: 'row',
    gap: Spacing.two
  },
  headerIconClose: {
    borderRadius: 999
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  deliveryContainer: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    width: width * 0.7,
    height: 150,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.08)',
      },
      {
        offsetX: 0,
        offsetY: 8,
        blurRadius: 20,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.12)',
      },
    ],
  }
})

export default DeliveryRoute
