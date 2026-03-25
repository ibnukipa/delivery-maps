import { getCurrentUser } from "@/services/auth.service";
import { subscribeToDeliveries } from "@/services/deliveries.service";
import type { Delivery } from "@/types/delivery";
import { useEffect, useRef, useState } from "react";

const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  
  const uidRef = useRef<string | null>(getCurrentUser()?.uid ?? null);
  
  useEffect(() => {
    const uid = uidRef.current;
    if (!uid) return;
    
    const unsubscribe = subscribeToDeliveries(
      uid,
      (data) => {
        setDeliveries(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  return { deliveries, loading, error };
}

export default useDeliveries
