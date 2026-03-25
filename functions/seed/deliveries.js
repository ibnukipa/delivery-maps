const admin = require('firebase-admin');
const serviceAccount = require('../../secrets/service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const deliveries = [
  { customerName: 'Plaza Indonesia', customerAddressCoordinates: { lat: -6.1934, lng: 106.8218 }, customerAddress: 'Jl. M.H. Thamrin No.28-30, Menteng, Jakarta Pusat' },
  // { customerName: 'Grand Indonesia', customerAddressCoordinates: { lat: -6.1975, lng: 106.8190 }, customerAddress: 'Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat' },
  // { customerName: 'Mal Taman Anggrek',customerAddressCoordinates: { lat: -6.1781, lng: 106.7901 }, customerAddress: 'Jl. Letjen S. Parman, Tanjung Duren, Jakarta Barat' },
  // { customerName: 'Central Park Mall', customerAddressCoordinates: { lat: -6.1769, lng: 106.7904 }, customerAddress: 'Jl. Letjen S. Parman No.28, Tanjung Duren, Jakarta Barat' },
  // { customerName: 'Senayan City', customerAddressCoordinates: { lat: -6.2273, lng: 106.7986 }, customerAddress: 'Jl. Asia Afrika No.19, Gelora, Jakarta Pusat' },
  // { customerName: 'Plaza Senayan', customerAddressCoordinates: { lat: -6.2254, lng: 106.7986 }, customerAddress: 'Jl. Asia Afrika No.8, Gelora, Jakarta Pusat' },
  // { customerName: 'Pacific Place', customerAddressCoordinates: { lat: -6.2241, lng: 106.8082 }, customerAddress: 'Jl. Jend. Sudirman Kav. 52-53, SCBD, Jakarta Selatan' },
  // { customerName: 'Gandaria City', customerAddressCoordinates: { lat: -6.2441, lng: 106.7806 }, customerAddress: 'Jl. Sultan Iskandar Muda, Kebayoran Lama, Jakarta Selatan' },
  // { customerName: 'Pondok Indah Mall', customerAddressCoordinates: { lat: -6.2664, lng: 106.7840 }, customerAddress: 'Jl. Metro Pondok Indah, Pondok Indah, Jakarta Selatan' },
  // { customerName: 'Lippo Mall Kemang', customerAddressCoordinates: { lat: -6.2605, lng: 106.8139 }, customerAddress: 'Jl. Kemang Raya No.3, Kemang, Jakarta Selatan' },
  // { customerName: 'Kota Kasablanka', customerAddressCoordinates: { lat: -6.2249, lng: 106.8430 }, customerAddress: 'Jl. Casablanca Raya Kav.88, Tebet, Jakarta Selatan' },
  // { customerName: 'Mal Ambassador', customerAddressCoordinates: { lat: -6.2243, lng: 106.8327 }, customerAddress: 'Jl. Prof. Dr. Satrio, Kuningan, Jakarta Selatan' },
  // { customerName: 'Kuningan City', customerAddressCoordinates: { lat: -6.2275, lng: 106.8301 }, customerAddress: 'Jl. Prof. Dr. Satrio Kav.18, Kuningan, Jakarta Selatan' },
  // { customerName: 'Puri Indah Mall', customerAddressCoordinates: { lat: -6.1899, lng: 106.7315 }, customerAddress: 'Jl. Puri Agung, Kembangan, Jakarta Barat' },
  // { customerName: 'Lippo Mall Puri', customerAddressCoordinates: { lat: -6.1873, lng: 106.7279 }, customerAddress: 'Jl. Puri Indah Raya, Kembangan, Jakarta Barat' },
  // { customerName: 'Mall of Indonesia', customerAddressCoordinates: { lat: -6.1423, lng: 106.9021 }, customerAddress: 'Jl. Yos Sudarso, Kelapa Gading, Jakarta Utara' },
  // { customerName: 'Kelapa Gading Mall', customerAddressCoordinates: { lat: -6.1594, lng: 106.9014 }, customerAddress: 'Jl. Boulevar Barat Raya, Kelapa Gading, Jakarta Utara' },
  // { customerName: 'Summarecon Mall Kelapa Gading', customerAddressCoordinates: { lat: -6.1568, lng: 106.9017 }, customerAddress: 'Jl. Bulevar Kelapa Gading, Kelapa Gading, Jakarta Utara' },
  // { customerName: 'Emporium Pluit Mall', customerAddressCoordinates: { lat: -6.1208, lng: 106.7897 }, customerAddress: 'Jl. Pluit Selatan Raya, Penjaringan, Jakarta Utara' },
  // { customerName: 'Artha Gading Mall', customerAddressCoordinates: { lat: -6.1477, lng: 106.9003 }, customerAddress: 'Jl. Artha Gading Selatan, Kelapa Gading, Jakarta Utara' },
];

// ← your Firebase Auth UID
const DRIVER_UID = 'your-uuid-here';

async function seed() {
  for (const d of deliveries) {
    const ref = await db.collection('deliveries').add({
      ...d,
      driverUid: DRIVER_UID,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ Created delivery: ${ref.id} — ${d.customerName}`);
  }

  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
