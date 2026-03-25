import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

const onDeliveryCreatedNotifications = onDocumentCreated(
  {
    document: "deliveries/{deliveryId}",
    region: "asia-southeast2",
  },
  async (event) => {
    const delivery = event.data?.data();
    if (!delivery) return;

    const {driverUid, customerName, customerAddress} = delivery;

    const tokenDoc = await admin.firestore()
      .collection("driverTokens")
      .doc(driverUid)
      .get();

    const fcmToken = tokenDoc.data()?.fcmToken;
    if (!fcmToken) {
      console.log(`No FCM token for driver ${driverUid}`);
      return;
    }

    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: "New Delivery Assigned 🚚",
        body: `${customerName} · ${customerAddress}`,
      },
      data: {
        screen: "deliveries",
        deliveryId: event.params.deliveryId,
      },
      android: {
        notification: {
          channelId: "deliveries",
          priority: "high",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    });
  }
);

export default onDeliveryCreatedNotifications;
