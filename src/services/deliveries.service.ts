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

export function subscribeToDeliveries(
  driverUid: string,
  onChange: (
    deliveries: Delivery[],
    lastDoc: QueryDocumentSnapshot<DocumentData> | null,
    hasMore: boolean
  ) => void,
  onError: (error: Error) => void
) {
  const db = getFirestore();
  const q = query(
    collection(db, 'deliveries'),
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

export async function loadMoreDeliveries(
  driverUid: string,
  lastDoc: QueryDocumentSnapshot<DocumentData>
): Promise<{
  data: Delivery[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const db = getFirestore();
  const q = query(
    collection(db, 'deliveries'),
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
  const db = getFirestore();
  await updateDoc(doc(db, 'deliveries', deliveryId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function generateDummyDeliveries(driverUid: string) {
  const db = getFirestore();
  const dummies = [
    { customerName: 'Plaza Indonesia', lat: -6.1934, lng: 106.8218, customerAddress: 'Jl. M.H. Thamrin No.28-30, Menteng, Jakarta Pusat' },
    { customerName: 'Grand Indonesia', lat: -6.1975, lng: 106.8190, customerAddress: 'Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat' },
    { customerName: 'Mal Taman Anggrek', lat: -6.1781, lng: 106.7901, customerAddress: 'Jl. Letjen S. Parman, Tanjung Duren, Jakarta Barat' },
    { customerName: 'Central Park Mall', lat: -6.1769, lng: 106.7904, customerAddress: 'Jl. Letjen S. Parman No.28, Tanjung Duren, Jakarta Barat' },
    { customerName: 'Senayan City', lat: -6.2273, lng: 106.7986, customerAddress: 'Jl. Asia Afrika No.19, Gelora, Jakarta Pusat' },
    { customerName: 'Plaza Senayan', lat: -6.2254, lng: 106.7986, customerAddress: 'Jl. Asia Afrika No.8, Gelora, Jakarta Pusat' },
    { customerName: 'Pacific Place', lat: -6.2241, lng: 106.8082, customerAddress: 'Jl. Jend. Sudirman Kav. 52-53, SCBD, Jakarta Selatan' },
    { customerName: 'Gandaria City', lat: -6.2441, lng: 106.7806, customerAddress: 'Jl. Sultan Iskandar Muda, Kebayoran Lama, Jakarta Selatan' },
    { customerName: 'Pondok Indah Mall', lat: -6.2664, lng: 106.7840, customerAddress: 'Jl. Metro Pondok Indah, Pondok Indah, Jakarta Selatan' },
    { customerName: 'Lippo Mall Kemang', lat: -6.2605, lng: 106.8139, customerAddress: 'Jl. Kemang Raya No.3, Kemang, Jakarta Selatan' },
    { customerName: 'Kota Kasablanka', lat: -6.2249, lng: 106.8430, customerAddress: 'Jl. Casablanca Raya Kav.88, Tebet, Jakarta Selatan' },
    { customerName: 'Mal Ambassador', lat: -6.2243, lng: 106.8327, customerAddress: 'Jl. Prof. Dr. Satrio, Kuningan, Jakarta Selatan' },
    { customerName: 'Kuningan City', lat: -6.2275, lng: 106.8301, customerAddress: 'Jl. Prof. Dr. Satrio Kav.18, Kuningan, Jakarta Selatan' },
    { customerName: 'Puri Indah Mall', lat: -6.1899, lng: 106.7315, customerAddress: 'Jl. Puri Agung, Kembangan, Jakarta Barat' },
    { customerName: 'Lippo Mall Puri', lat: -6.1873, lng: 106.7279, customerAddress: 'Jl. Puri Indah Raya, Kembangan, Jakarta Barat' },
    { customerName: 'Mall of Indonesia', lat: -6.1423, lng: 106.9021, customerAddress: 'Jl. Yos Sudarso, Kelapa Gading, Jakarta Utara' },
    { customerName: 'Kelapa Gading Mall', lat: -6.1594, lng: 106.9014, customerAddress: 'Jl. Boulevar Barat Raya, Kelapa Gading, Jakarta Utara' },
    { customerName: 'Summarecon Mall Kelapa Gading', lat: -6.1568, lng: 106.9017, customerAddress: 'Jl. Bulevar Kelapa Gading, Kelapa Gading, Jakarta Utara' },
    { customerName: 'Emporium Pluit Mall', lat: -6.1208, lng: 106.7897, customerAddress: 'Jl. Pluit Selatan Raya, Penjaringan, Jakarta Utara' },
    { customerName: 'Artha Gading Mall', lat: -6.1477, lng: 106.9003, customerAddress: 'Jl. Artha Gading Selatan, Kelapa Gading, Jakarta Utara' },
  ];
  
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
