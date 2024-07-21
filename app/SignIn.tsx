import { FormButton } from "@/components/FormButtons/FormButton";
import { Pressable, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function SignIn() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <TextInput
        placeholder="Correo electrónico"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="email"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="text"
        enterKeyHint="done"
      />
      <FormButton title="Continuar" onPress={() => {}} style={styles.button} />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  textInput: {
    height: 45,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 12,
    fontSize: 18,
  },
  button: {
    marginTop: 5,
    marginBottom: 26,
  },
}));
