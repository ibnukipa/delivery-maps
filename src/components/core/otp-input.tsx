import { useColorTheme } from "@/hooks/use-color-theme";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type OtpInputHandle = {
  clear: () => void;
  shake: () => void;
  focus: () => void;
  submit: () => void;
};

type OtpInputProps = {
  length?: number;
  masked?: boolean;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
  error?: boolean;
};

const BlinkingCursor = ({ color }: { color: string }) => {
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500, easing: Easing.linear }),
        withTiming(1, { duration: 500, easing: Easing.linear })
      ),
      -1
    );
    return () => cancelAnimation(opacity);
  }, []);
  
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  
  return <Animated.View style={[styles.cursor, { backgroundColor: color }, style]} />;
};

const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(
  ({ length = 6, masked = false, onComplete, onChange, error = false }, ref) => {
    const colors = useColorTheme();
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    
    const translateX = useSharedValue(0);
    
    const shakeStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));
    
    const shake = () => {
      translateX.value = withSequence(
        withTiming( 8,  { duration: 50, easing: Easing.linear }),
        withTiming(-8,  { duration: 50, easing: Easing.linear }),
        withTiming( 6,  { duration: 50, easing: Easing.linear }),
        withTiming(-6,  { duration: 50, easing: Easing.linear }),
        withTiming( 4,  { duration: 50, easing: Easing.linear }),
        withTiming( 0,  { duration: 50, easing: Easing.linear })
      );
    };
    
    useImperativeHandle(ref, () => ({
      clear: () => setOtp(Array(length).fill("")),
      shake,
      focus: () => inputRef.current?.focus(),
      submit: () => {
        onComplete?.(otp.join(""));
      }
    }));
    
    useEffect(() => {
      if (error) shake();
    }, [error]);
    
    const filledCount = otp.join("").length;
    const rawValue = otp.join("");
    
    const handleChange = (text: string) => {
      const digits = text.replace(/\D/g, "").slice(0, length).split("");
      const next = Array(length).fill("");
      digits.forEach((d, i) => (next[i] = d));
      setOtp(next);
      onChange?.(digits.join(""));
      if (digits.length === length) {
        onComplete?.(digits.join(""));
        inputRef.current?.blur();
      }
    };
    
    return (
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <Animated.View style={[styles.row, shakeStyle]}>
          
          <TextInput
            ref={inputRef}
            value={rawValue}
            onChangeText={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            maxLength={length}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            style={styles.hiddenInput}
            caretHidden
          />
          
          {Array(length)
            .fill(null)
            .map((_, i) => {
              const isFocusedBox =
                focused &&
                (i === filledCount ||
                  (filledCount === length && i === length - 1));
              const hasValue = !!otp[i];
              
              const borderColor = error
                ? colors.error
                : isFocusedBox
                  ? colors.primary
                  : hasValue
                    ? colors.primaryMuted
                    : "transparent";
              
              return (
                <View
                  key={i}
                  style={[
                    styles.box,
                    {
                      backgroundColor: colors.backgroundElement,
                      borderColor,
                      borderWidth: 1.5,
                    },
                  ]}
                >
                  {hasValue ? (
                    masked ? (
                      <View style={[styles.dot, { backgroundColor: colors.text }]} />
                    ) : (
                      <TextInput
                        autoFocus={i === 0}
                        value={otp[i]}
                        editable={false}
                        style={[styles.digitText, { color: colors.text }]}
                      />
                    )
                  ) : isFocusedBox ? (
                    <BlinkingCursor color={colors.primary} />
                  ) : null}
                </View>
              );
            })}
        
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
    paddingBottom: 18,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  digitText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    padding: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cursor: {
    width: 2,
    height: 24,
    borderRadius: 1,
  },
});

export default OtpInput;
