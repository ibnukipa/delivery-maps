import { ThemeColor } from "@/constants/theme";
import { useColorTheme } from "@/hooks/use-color-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export type ThemedTextInputProps = TextInputProps & {
  type?: "text" | "password";
  size?: "small" | "medium" | "large";
  themeColor?: ThemeColor;
  error?: string | null;
};

const SIZE_MAP = {
  small:  { height: 36, fontSize: 13, paddingHorizontal: 10, iconSize: 16 },
  medium: { height: 44, fontSize: 15, paddingHorizontal: 14, iconSize: 18 },
  large:  { height: 52, fontSize: 17, paddingHorizontal: 16, iconSize: 20 },
};

const ThemedTextInput = ({
  type = "text",
  size = "large",
  themeColor,
  error,
  style,
  ...rest
}: ThemedTextInputProps) => {
  const colors = useColorTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === "password";
  const hasError = !!error;
  const dims = SIZE_MAP[size];
  
  const borderColor = hasError
    ? colors.error
    : focused
      ? (themeColor ? colors[themeColor] : colors.primaryMuted)
      : "transparent";
  
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.wrapper,
          {
            height: dims.height,
            paddingHorizontal: dims.paddingHorizontal,
            backgroundColor: colors.backgroundElement,
            borderColor,
            borderWidth: 1,
            borderRadius: 10,
          },
        ]}
      >
        <TextInput
          {...rest}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={colors.textSecondary}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              fontSize: dims.fontSize,
              color: colors.text,
            },
            style,
          ]}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={dims.iconSize}
              color={hasError ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && (
        <Animated.Text
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.errorText, { color: colors.error }]}
          numberOfLines={1}
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingBottom: 18,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  errorText: {
    position: "absolute",
    bottom: 2,
    left: 2,
    fontSize: 11,
    lineHeight: 16,
  },
});

export default ThemedTextInput;
