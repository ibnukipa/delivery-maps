import { MapIconEntering } from "@/components/animations/map-icon-entering";
import ThemedButton from "@/components/core/themed-button";
import ThemedTextInput from "@/components/core/themed-text-input";
import { ThemedView } from "@/components/core/themed-view";
import { Spacing } from "@/constants/theme";
import { handleEmailPasswordSignIn } from "@/services/auth.service";
import { validateEmail } from "@/utils/email.utils";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = () => {
    setLoading(true);
    handleEmailPasswordSignIn(email, password).finally(() => setLoading(false));
  }
  
  const handleEmailBlur = () => {
    setEmailError(validateEmail(email))
  }
  
  return (
    <KeyboardAvoidingView behavior={'height'} style={{ flex: 1 }}>
      <ThemedView type={'background'} style={styles.container}>
        <View style={{ alignSelf: 'center' }}>
          <MapIconEntering/>
        </View>
        <ThemedView style={styles.contentContainer}>
          <ThemedTextInput
            placeholder={'your-email-address@email.com'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            inputMode="email"
            returnKeyType="next"
            onChangeText={setEmail}
            onBlur={handleEmailBlur}
            error={emailError}
          />
          <ThemedTextInput
            placeholder={'--------'}
            type={'password'}
            onChangeText={setPassword}
          />
          <ThemedView>
            <ThemedButton
              loading={loading}
              disabled={!email || !password || !!emailError}
              size={'large'} label={'Sign In'}
              onPress={handleSubmit}/>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.six,
  },
  contentContainer: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  }
})

export default SignIn
