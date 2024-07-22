import { FormButton } from "@/components/Form/FormButton";
import { TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function SignUp() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <TextInput
        placeholder="Nombre completo"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="text"
        enterKeyHint="next"
      />
      <TextInput
        placeholder="Correo electrónico"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="email"
        enterKeyHint="next"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="text"
        enterKeyHint="next"
      />
      <TextInput
        placeholder="Repite la contraseña"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="text"
        enterKeyHint="done"
      />
      <FormButton title="Crear cuenta" onPress={() => {}} />
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
