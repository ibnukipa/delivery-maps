export interface Delivery {
  id: string;
  driverUid: string;
  customerName: string;
  customerAddress: string;
  customerAddressCoordinates: { lat: number; lng: number };
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  createdAt: Date;
}
