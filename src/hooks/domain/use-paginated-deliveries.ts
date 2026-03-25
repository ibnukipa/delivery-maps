import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentUser } from '@/services/auth.service';
import {
  subscribeToPaginatedDeliveries,
  loadMoreDeliveries,
} from '@/services/deliveries.service';
import type { Delivery } from '@/types/delivery';

import QueryDocumentSnapshot = FirebaseFirestoreTypes.QueryDocumentSnapshot;
import DocumentData = FirebaseFirestoreTypes.DocumentData;

function usePaginatedDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const uidRef = useRef<string | null>(getCurrentUser()?.uid ?? null);
  const loadingMoreRef = useRef(false);
  
  useEffect(() => {
    const uid = uidRef.current;
    if (!uid) return;
    
    const unsubscribe = subscribeToPaginatedDeliveries(
      uid,
      (data, lastDoc, hasMore) => {
        setDeliveries(data);
        lastDocRef.current = lastDoc;
        setHasMore(hasMore);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  const loadMore = useCallback(async () => {
    const uid = uidRef.current;
    const lastDoc = lastDocRef.current;
    
    if (!uid || !lastDoc || loadingMoreRef.current || !hasMore) return;
    
    loadingMoreRef.current = true;
    setLoadingMore(true);
    
    try {
      const {
        data,
        lastDoc: newLastDoc,
        hasMore: more,
      } = await loadMoreDeliveries(uid, lastDoc);
      
      setDeliveries((prev) => [...prev, ...data]);
      lastDocRef.current = newLastDoc;
      setHasMore(more);
    } catch (err: any) {
      setError(err.message);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore]);
  
  return { deliveries, loading, loadingMore, hasMore, error, loadMore };
}

export default usePaginatedDeliveries;
