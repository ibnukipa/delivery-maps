import { useState, useEffect, useCallback, useRef } from 'react';
import { optimiseRoute, RouteResult } from '@/services/map.service';
import { updateDeliveryStatus } from '@/services/deliveries.service';
import type { Delivery } from '@/types/delivery';
import * as Location from 'expo-location';

interface DriverLocation {
  latitude: number;
  longitude: number;
}

function useOptimisedRoute(deliveries: Delivery[]) {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [optimising, setOptimising] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const driverLocationRef = useRef<DriverLocation | null>(null);
  
  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      driverLocationRef.current = location.coords
      setDriverLocation(location.coords);
    }
    
    getCurrentLocation();
  }, []);
  
  useEffect(() => {
    const pending = deliveries.filter((d) => d.status === 'pending');
    if (!driverLocation || pending.length === 0) return;
    
    runOptimisation(driverLocation, pending);
  }, [deliveries, driverLocation]);
  
  const runOptimisation = useCallback(
    async (loc: DriverLocation, pending: Delivery[]) => {
      setOptimising(true);
      try {
        const result = await optimiseRoute({ lat: loc.latitude, lng: loc.longitude }, pending);
        setRoute(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setOptimising(false);
      }
    },
    []
  );
  
  const markDelivered = useCallback(async (deliveryId: string) => {
    await updateDeliveryStatus(deliveryId, 'delivered');
  }, []);
  
  return { route, driverLocation, optimising, error, markDelivered };
}

export default useOptimisedRoute;
