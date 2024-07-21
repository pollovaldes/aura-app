import { Pressable, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function SignIn() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <TextInput placeholder="Correo electrónico" style={styles.textInput} />
      <TextInput placeholder="Contraseña" style={styles.textInput} />
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  textInput: {
    height: 42,
    color: "#6e6e6e",
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    marginVertical: 5,
    padding: 12,
  },
  button: {
    height: 42,
    marginTop: 24,
    marginBottom: 12,
    backgroundColor: "#6a6a6a",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.text.mainInverted,
    userSelect: "none",
  },
}));
