import ThemedButton from "@/components/core/themed-button";
import { Spacing } from "@/constants/theme";
import useSheetBackdrop from "@/hooks/components/use-sheet-backdrop";
import { useColorTheme } from "@/hooks/use-color-theme";
import { getCurrentUser, handleSignOut } from "@/services/auth.service";
import { generateDummyDeliveries } from "@/services/deliveries.service";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { StyleSheet } from "react-native";

export type SettingsSheetHandle = {
  open: () => void;
  close: () => void;
};

export const SettingsSheetRef = createRef<SettingsSheetHandle>();

const SettingsSheet = forwardRef<SettingsSheetHandle>((_, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const colors = useColorTheme()
  
  const { renderBackdrop } = useSheetBackdrop()
  
  useImperativeHandle(ref, () => ({
    open: () => {
      sheetRef.current?.present();
    },
    close: () => {
      sheetRef.current?.dismiss();
    },
  }));
  
  const handleDummyDeliveries = () => {
    const driverUid = getCurrentUser()?.uid
    if (driverUid) {
      generateDummyDeliveries(driverUid)
    }
  }
  
  const handleSignOutAndClose = () => {
    handleSignOut()
    sheetRef.current?.dismiss()
  }
  
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
        <ThemedButton size={'large'} label={'Generate Dummy Deliveries'} onPress={handleDummyDeliveries} />
        <ThemedButton size={'large'} label={'Sign Out'} type={'secondary'} onPress={handleSignOutAndClose} />
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
    gap: Spacing.two
  }
})

export default SettingsSheet;
