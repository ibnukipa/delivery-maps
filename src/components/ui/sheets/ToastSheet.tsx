import ThemedButton from "@/components/core/themed-button";
import { ThemedText } from "@/components/core/themed-text";
import { ThemedView } from "@/components/core/themed-view";
import { Spacing } from "@/constants/theme";
import useSheetBackdrop from "@/hooks/components/use-sheet-backdrop";
import { useColorTheme } from "@/hooks/use-color-theme";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { BounceIn } from "react-native-reanimated";
import * as Haptics from 'expo-haptics'

type ToastSheetType = "success" | "error" | "info" | "warning";

export type ToastSheetHandle = {
  open: (params: {
    type: ToastSheetType;
    title?: string;
    message?: string;
  }) => void;
  close: () => void;
};

export const ToastSheetRef = createRef<ToastSheetHandle>();

/**
 * Usage
 * ToastSheetRef.current?.open({
 *    type: 'error',
 *    title: 'Auth Failed',
 *    message: 'Please enter valid credentials',
 *  })
 *  ToastSheetRef.current?.open({
 *    type: 'success',
 *    title: 'Auth Success',
 *  })
 *  ToastSheetRef.current?.open({
 *    type: 'info',
 *    message: 'Email sent successful',
 *  })
 *  ToastSheetRef.current?.open({
 *    type: 'warning',
 *    title: 'Breaking',
 *    message: 'Please enter your email address',
 *  })
 */

const ToastSheet = forwardRef<ToastSheetHandle>((_, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [type, setType] = useState<ToastSheetType>("info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const colors = useColorTheme()
  
  const { renderBackdrop } = useSheetBackdrop()
  
  useImperativeHandle(ref, () => ({
    open: ({ type, title, message }) => {
      setType(type);
      setTitle(title ?? "");
      setMessage(message ?? "");
      sheetRef.current?.present();
    },
    close: () => {
      sheetRef.current?.dismiss();
    },
  }));
  
  const [iconName, color] = useMemo(() => {
    switch (type) {
      default:
      case 'info':
        return ['information-circle-outline', colors.info]
      case "success":
        return ['checkmark-circle-outline', colors.success]
      case "error":
        return ['close-circle-outline', colors.error]
      case 'warning':
        return ['alert-circle-outline', colors.warning]
    }
  }, [type])
  
  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  }, []);
  
  return (
    <BottomSheetModal
      ref={sheetRef}
      detached
      backdropComponent={renderBackdrop}
      bottomInset={14}
      handleIndicatorStyle={[styles.handle, { backgroundColor: colors.backgroundSelected }]}
      backgroundStyle={styles.backgroundContainer}
      enablePanDownToClose={false}
      animationConfigs={{
        duration: 300
      }}
    >
      <BottomSheetView style={styles.container}>
        <ThemedView style={styles.contentContainer}>
          <Animated.View entering={BounceIn.delay(200)}>
            <Ionicons color={color} name={iconName} size={120} />
          </Animated.View>
          {title && <ThemedText themeColor={type} type={'h3'}>{title}</ThemedText>}
          {message && <ThemedText themeColor={'textSecondary'} style={{ textAlign: 'center' }}>{message}</ThemedText>}
        </ThemedView>
        <View>
          <ThemedButton type={'secondary'} label={'Done'} onPress={() => sheetRef.current?.dismiss()}/>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  backgroundContainer: {
    marginHorizontal: 10,
    borderRadius: 54
  },
  handle: {
    width: 38
  },
  container: {
    minHeight: 150,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.three,
    paddingBottom: 44,
    justifyContent: "space-between",
    gap: Spacing.four
  },
  contentContainer: {
    alignItems: 'center',
    gap: Spacing.two
  }
})

export default ToastSheet;
