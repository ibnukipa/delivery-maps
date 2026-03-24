import { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import {
  BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React, { useCallback } from "react";

const useSheetBackdrop = (defaultProps: BottomSheetDefaultBackdropProps | undefined = {}) => {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={'close'}
        {...defaultProps}
        opacity={0.5}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => {
          defaultProps.onPress?.();
        }}
      />
    ),
    []
  );
  
  return { renderBackdrop };
}

export default useSheetBackdrop;
