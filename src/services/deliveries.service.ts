import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
  serverTimestamp, FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import type { Delivery } from '@/types/delivery';

import DocumentData = FirebaseFirestoreTypes.DocumentData;
import QueryDocumentSnapshot = FirebaseFirestoreTypes.QueryDocumentSnapshot;

export const PAGE_SIZE = 5;

export function subscribeToPaginatedDeliveries(
  driverUid: string,
  onChange: (
    deliveries: Delivery[],
    lastDoc: QueryDocumentSnapshot<DocumentData> | null,
    hasMore: boolean
  ) => void,
  onError: (error: Error) => void
) {
  const q = query(
    collection(getFirestore(), 'deliveries'),
    where('driverUid', '==', driverUid),
    where('status', 'in', ['pending', 'delivered']),
    orderBy('createdAt', 'asc'),
    limit(PAGE_SIZE + 1)
  );
  
  return onSnapshot(
    q,
    (snapshot) => {
      const hasMore = snapshot.docs.length > PAGE_SIZE;
      const docs = hasMore ? snapshot.docs.slice(0, PAGE_SIZE) : snapshot.docs;
      
      const data = docs.map((d: DocumentData) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate(),
      })) as Delivery[];
      
      const lastDoc = docs[docs.length - 1] ?? null;
      onChange(data, lastDoc, hasMore);
    },
    onError
  );
}

export function subscribeToDeliveries(
  driverUid: string,
  onChange: (deliveries: Delivery[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    collection(getFirestore(), 'deliveries'),
    where('driverUid', '==', driverUid),
    where('status', 'in', ['pending', 'delivered']),
    orderBy('createdAt', 'asc'),
  );
  
  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs;
      
      const data = docs.map((d: DocumentData) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate(),
      })) as Delivery[];
      
      onChange(data);
    },
    onError
  );
}

export async function loadMoreDeliveries(
  driverUid: string,
  lastDoc: QueryDocumentSnapshot<DocumentData>
): Promise<{
  data: Delivery[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const q = query(
    collection(getFirestore(), 'deliveries'),
    where('driverUid', '==', driverUid),
    where('status', 'in', ['pending', 'delivered']),
    orderBy('createdAt', 'asc'),
    startAfter(lastDoc),
    limit(PAGE_SIZE + 1)
  );
  
  const snapshot = await getDocs(q);
  const hasMore = snapshot.docs.length > PAGE_SIZE;
  const docs = hasMore ? snapshot.docs.slice(0, PAGE_SIZE) : snapshot.docs;
  
  const data = docs.map((d: DocumentData) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  })) as Delivery[];
  
  return {
    data,
    lastDoc: docs[docs.length - 1] ?? null,
    hasMore,
  };
}

export async function updateDeliveryStatus(
  deliveryId: string,
  status: Delivery['status']
) {
  await updateDoc(doc(getFirestore(), 'deliveries', deliveryId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function generateDummyDeliveries(driverUid: string) {
  const db = getFirestore();
  const dummies = [];
  
  await Promise.all(
    dummies.map((d) =>
      addDoc(collection(db, 'deliveries'), {
        driverUid,
        customerName: d.customerName,
        customerAddress: d.customerAddress,
        customerAddressCoordinates: { lat: d.lat, lng: d.lng },
        status: 'pending',
        createdAt: Timestamp.now(),
      })
    )
  );
}
