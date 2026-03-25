# Delivery Maps

A React Native (Expo) delivery driver app with real-time route optimisation, Firebase Firestore, and FCM push notifications.

---

## Tech Stack

- **Expo** (bare workflow) + **Expo Router**
- **React Native Firebase** (`@react-native-firebase/*`)
- **Google Maps** via `react-native-maps`
- **Google Routes API** for traffic-aware route optimisation
- **Firebase Firestore** for real-time delivery data
- **Firebase Cloud Functions** for push notification triggers
- **FCM** for push notifications (iOS + Android)

---

## Prerequisites

- Node.js 18+
- Xcode (for iOS)
- Android Studio (for Android)
- Firebase CLI: `npm install -g firebase-tools`
- Google Cloud account with billing enabled

---

## Setup

### 1. Clone and install

```bash
git clonegit@github.com:ibnukipa/delivery-maps.git
cd delivery-maps
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Add Firebase config files

Place these files in the `secrets/` folder — obtain them from Firebase Console → Project Settings → Your Apps:

```
secrets/
├── google-services.json         # Android
└── GoogleService-Info.plist     # iOS
└── service-account.json         # Admin
```

### 4. Enable Google Cloud APIs

Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Library and enable:

- Maps SDK for Android
- Maps SDK for iOS
- Routes API

### 5. Prebuild and run

```bash
yarn prebuild

# iOS
npx expo run:ios
 
# Android
npx expo run:android
```
 
---

## Firebase Cloud Functions Setup

### 1. Install dependencies

```bash
cd functions
npm install
```

### 2. Deploy

```bash
firebase login
firebase deploy --only functions
```

### 3. View logs

```bash
# stream live logs
firebase functions:log --follow
 
# filter by function
firebase functions:log --only onDeliveryCreatedNotifications
```

Or visit Firebase Console → Functions → Logs.
 
---

## Firestore Data Structure

```
deliveries/{deliveryId}
  driverUid:                    string    # Firebase Auth UID
  customerName:                 string
  customerAddress:              string
  customerAddressCoordinates:   map
    lat:                        number
    lng:                        number
  status:                       string    # "pending" | "delivered"
  createdAt:                    timestamp
 
driverTokens/{uid}
  fcmToken:                     string    # FCM device token
  updatedAt:                    timestamp
```
 
---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /deliveries/{deliveryId} {
      allow read, write: if request.auth != null;
    }
    match /driverTokens/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```
 
---

## How to Trigger a Test Push Notification

### Step 1 — Get your driver UID

Firebase Console → Authentication → Users → copy your UID.

### Step 2 — Make sure your FCM token is registered

Log in to the app — `registerFCMToken()` runs automatically after login and saves your token to `driverTokens/{uid}` in Firestore.

Verify it exists: Firebase Console → Firestore → `driverTokens` → find your UID document → confirm `fcmToken` is not null.

### Step 3 — Seed delivery data via CLI script

The project includes a seed script at `functions/seed/deliveries.js` that writes delivery documents directly to Firestore using the Firebase Admin SDK. Each document added triggers `onDeliveryCreatedNotifications` and sends a push notification.

#### Set your driver UID

Open `functions/seed/deliveries.js` and replace `DRIVER_UID` with your Firebase Auth UID from Step 1:

```javascript
const DRIVER_UID = 'your-uid-here';
```

#### Uncomment deliveries to seed

By default only one delivery is active. Open the script and uncomment as many as you want:

```javascript
const deliveries = [
  { customerName: 'Plaza Indonesia', ... },           // ← active
  // { customerName: 'Grand Indonesia', ... },        // ← uncomment to include
  // { customerName: 'Mal Taman Anggrek', ... },
  // ...
];
```

#### Run the script

```bash
cd functions
node seed/deliveries.js
```

You should see:

```
✅ Created delivery: abc123 — Plaza Indonesia
✅ Created delivery: def456 — Grand Indonesia
Done!
```
