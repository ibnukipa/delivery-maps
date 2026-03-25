import { Delivery } from "@/types/delivery";
import { decode } from "@mapbox/polyline";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!;
const ROUTES_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

export interface OptimisedStop {
  delivery: Delivery;
  sequence: number;
  eta: string;
  color: string;
}

export interface LegPolyline {
  coordinates: { latitude: number; longitude: number }[];
  color: string;
}

export interface RouteResult {
  stops: OptimisedStop[];
  totalDuration: string;
  totalDistance: string;
  polyline: string;
  legPolylines: LegPolyline[];
}

const LEG_COLORS = [
  '#2563EB',
  '#16A34A',
  '#DC2626',
  '#D97706',
  '#7C3AED',
  '#0891B2',
  '#DB2777',
  '#65A30D',
  '#EA580C',
  '#0F766E',
];

export async function optimiseRoute(
  driverLocation: { lat: number; lng: number },
  deliveries: Delivery[]
): Promise<RouteResult> {
  if (deliveries.length === 0) {
    return { stops: [], totalDuration: '0 min', totalDistance: '0 km', polyline: '', legPolylines: [] };
  }
  
  return await fetchOptimisedRoute(driverLocation, deliveries);
}

async function fetchOptimisedRoute(
  driverLocation: { lat: number; lng: number },
  deliveries: Delivery[]
): Promise<RouteResult> {
  const body = buildRequestBody(driverLocation, deliveries);
  
  const res = await fetch(ROUTES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': [
        'routes.duration',
        'routes.distanceMeters',
        'routes.polyline.encodedPolyline',
        'routes.legs.duration',
        'routes.legs.distanceMeters',
        'routes.legs.polyline.encodedPolyline',
        'routes.optimizedIntermediateWaypointIndex',
      ].join(','),
    },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  
  if (!data.routes || data.routes.length === 0) {
    throw new Error(`Routes API error: ${JSON.stringify(data.error ?? data)}`);
  }
  
  return parseRouteResult(data, deliveries);
}

function buildRequestBody(
  driverLocation: { lat: number; lng: number },
  deliveries: Delivery[]
) {
  const last = deliveries[deliveries.length - 1];
  
  const intermediates = deliveries.length > 1
    ? deliveries.slice(0, -1).map((d) => ({
      location: {
        latLng: {
          latitude: d.customerAddressCoordinates.lat,
          longitude: d.customerAddressCoordinates.lng,
        },
      },
    }))
    : [];
  
  return {
    origin: {
      location: {
        latLng: {
          latitude: driverLocation.lat,
          longitude: driverLocation.lng,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: last.customerAddressCoordinates.lat,
          longitude: last.customerAddressCoordinates.lng,
        },
      },
    },
    ...(intermediates.length > 0 && { intermediates }),
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
    optimizeWaypointOrder: true,
    polylineEncoding: 'ENCODED_POLYLINE',
    languageCode: 'id',
  };
}

function parseRouteResult(data: any, deliveries: Delivery[]): RouteResult {
  const route = data.routes[0];
  const legs = route.legs as any[];
  
  const waypointOrder: number[] = route.optimizedIntermediateWaypointIndex ?? [];
  const orderedDeliveries = buildOrderedDeliveries(deliveries, waypointOrder);
  
  const parseDuration = (d: string | undefined) =>
    d ? parseInt(d.replace('s', ''), 10) : 0;
  
  const totalRouteSeconds = parseDuration(route.duration);
  let cumulativeSeconds = 0;
  
  const stops: OptimisedStop[] = orderedDeliveries.map((delivery, i) => {
    cumulativeSeconds += parseDuration(legs[i]?.duration);
    return {
      delivery,
      sequence: i + 1,
      eta: formatDuration(cumulativeSeconds),
      color: LEG_COLORS[i % LEG_COLORS.length],
    };
  });
  
  const legPolylines: LegPolyline[] = legs.map((leg, i) => ({
    coordinates: decode(leg.polyline?.encodedPolyline ?? '').map(([lat, lng]) => ({
      latitude: lat,
      longitude: lng,
    })),
    color: LEG_COLORS[i % LEG_COLORS.length],
  }));
  
  return {
    stops,
    totalDuration: formatDuration(totalRouteSeconds),
    totalDistance: formatDistance(route.distanceMeters ?? 0),
    polyline: route.polyline?.encodedPolyline ?? '',
    legPolylines,
  };
}

function buildOrderedDeliveries(
  deliveries: Delivery[],
  waypointOrder: number[]
): Delivery[] {
  if (deliveries.length === 1) return deliveries;
  
  const last = deliveries[deliveries.length - 1];
  const middle = deliveries.slice(0, -1);
  
  const validOrder = waypointOrder.filter((i) => i >= 0);
  
  const orderedMiddle = validOrder.length > 0
    ? validOrder.map((i) => middle[i])
    : middle;
  
  return [...orderedMiddle, last];
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
}
