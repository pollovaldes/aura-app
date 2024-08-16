import { FormButton } from "@/components/Form/FormButton";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function SignIn() {
  const { styles } = useStyles(stylesheet);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.replace("/trucks");
    }
    setLoading(false);
  }

  return (
    <>
      <TextInput
        placeholder="Email"
        inputMode="email"
        autoComplete="username"
        autoCapitalize="none"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        autoCorrect={false}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        enterKeyHint="done"
        autoComplete="current-password"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <FormButton
        title="Continuar"
        onPress={() => signInWithEmail()}
        isLoading={loading}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
}));
