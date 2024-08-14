import { FormButton } from "@/components/form/FormButton";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function SignUp() {
  const { styles } = useStyles(stylesheet);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) alert(error);
    if (!session) alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <>
      <TextInput
        placeholder="Nombre"
        autoComplete="name"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
      />
      <TextInput
        placeholder="Correo electrónico"
        inputMode="email"
        autoComplete="username"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        autoComplete="new-password"
        secureTextEntry={true}
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Repite la contraseña"
        autoComplete="new-password"
        enterKeyHint="done"
        secureTextEntry={true}
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
      />
      <FormButton
        title="Crear cuenta"
        onPress={() => {
          signUpWithEmail();
        }}
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
