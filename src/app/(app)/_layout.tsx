import useNotifications from "@/hooks/domain/use-notifications";
import { withoutHeaderOpts, slideFromBottomOpts, statusBarDarkStyleOpts } from "@/utils/navigation.utils";
import { Stack } from 'expo-router';

export default function AppLayout() {
  useNotifications();
  
  return (
    <Stack screenOptions={withoutHeaderOpts}>
      <Stack.Screen name={'index'} options={statusBarDarkStyleOpts}/>
      <Stack.Screen name={'delivery-route'} options={{
        ...statusBarDarkStyleOpts,
        ...slideFromBottomOpts
      }}/>
    </Stack>
  )
}
