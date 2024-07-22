import { FormButton } from "@/components/Form/FormButton";
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
      <FormButton title="Continuar" onPress={() => {}} />
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
