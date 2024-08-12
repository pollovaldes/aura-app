import { FormButton } from "@/components/Form/FormButton";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert, TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function SignUp() {
  const { styles } = useStyles(stylesheet);

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
      />
      <TextInput
        placeholder="Apellido paterno"
        autoComplete="name"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
      />
      <TextInput
        placeholder="Apellido materno"
        autoComplete="name"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
      />
      <FormButton
        title="Crear cuenta"
        onPress={() => {
          Alert.alert("Crear cuenta");
        }}
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
