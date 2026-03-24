import React from 'react'
import { useColorTheme } from "@/hooks/use-color-theme";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

type ThemedButtonProps = TouchableOpacityProps & {
  type?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
  label: string;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const SIZE_MAP: Record<NonNullable<ThemedButtonProps["size"]>,
  { height: number; fontSize: number; paddingHorizontal: number; gap: number }
> = {
  small: { height: 34, fontSize: 13, paddingHorizontal: 12, gap: 5 },
  medium: { height: 44, fontSize: 15, paddingHorizontal: 18, gap: 7 },
  large: { height: 52, fontSize: 17, paddingHorizontal: 22, gap: 8 },
};

const ThemedButton = ({
  type = "primary",
  size = "medium",
  label,
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  style,
  ...rest
}: ThemedButtonProps) => {
  const colors = useColorTheme();
  const dims = SIZE_MAP[size];
  const isDisabled = disabled || loading;
  
  const containerStyle: ViewStyle = {
    height: dims.height,
    paddingHorizontal: dims.paddingHorizontal,
    borderRadius: 999,
    opacity: isDisabled ? 0.48 : 1,
    ...(type === "primary" && {
      backgroundColor: colors.primary,
    }),
    ...(type === "secondary" && {
      backgroundColor: colors.backgroundElement,
    }),
    ...(type === "ghost" && {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.primary,
    }),
  };
  
  const labelStyle: TextStyle = {
    fontSize: dims.fontSize,
    fontWeight: "500",
    ...(type === "primary" && { color: colors.onPrimary }),
    ...(type === "secondary" && { color: colors.text }),
    ...(type === "ghost" && { color: colors.primary }),
  };
  
  const spinnerColor =
    type === "primary" ? colors.onPrimary : colors.primary;
  
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[styles.base, containerStyle, style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor}/>
      ) : (
        <>
          {iconLeft && (
            <View style={{ marginRight: dims.gap - 2 }}>{iconLeft}</View>
          )}
          <Text style={labelStyle} numberOfLines={1}>
            {label}
          </Text>
          {iconRight && (
            <View style={{ marginLeft: dims.gap - 2 }}>{iconRight}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default ThemedButton;
