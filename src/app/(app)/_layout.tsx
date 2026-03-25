import useNotifications from "@/hooks/domain/use-notifications";
import { Stack } from 'expo-router';
import { Platform } from "react-native";

const statusBarStyleOptions = Platform.select({ ios: {}, android: {
    statusBarStyle: 'dark'
  } })

export default function AppLayout() {
  useNotifications();
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'index'} options={statusBarStyleOptions}/>
      <Stack.Screen name={'delivery-route'} options={{
        ...statusBarStyleOptions,
        presentation: Platform.select({ ios: 'formSheet', android: undefined }),
        animation: Platform.select({ ios: undefined, android: 'slide_from_bottom' }),
        gestureEnabled: false
      }}/>
    </Stack>
  )
}
