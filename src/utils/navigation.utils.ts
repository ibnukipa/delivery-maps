import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Platform } from "react-native";

type NavigationOptions = Partial<NativeStackNavigationOptions>

export const withoutHeaderOpts: NavigationOptions = {
  headerShown: false,
}

export const statusBarDarkStyleOpts: NavigationOptions = Platform.select({
  ios: {},
  android: { statusBarStyle: 'dark' }
}) || {}

export const slideFromBottomOpts: NavigationOptions = {
  presentation: Platform.select({ ios: 'formSheet', android: undefined }),
  animation: Platform.select({ ios: undefined, android: 'slide_from_bottom' }),
  gestureEnabled: false
}
