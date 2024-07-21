import { Pressable, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ArrowLeft } from "lucide-react-native";
import { PrimaryFormProps } from "./Form";

export default function SignInSignUpForm({
  togglePrimaryForm,
}: PrimaryFormProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable onPress={togglePrimaryForm}>
          <ArrowLeft size={30} color={styles.backIcon.color} />
        </Pressable>
        <Text style={styles.title}>Continuar con celular</Text>
        <ArrowLeft size={28} style={{ opacity: 0 }} />
        {/* Used for perfect spacing in the row */}
      </View>
      <TextInput
        placeholder="Número de celular"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="tel"
      />
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Enviar código de verificación</Text>
      </Pressable>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: theme.textPresets.main,
    fontWeight: "bold",
  },
  backIcon: {
    color: theme.colors.inverted,
  },
  textInput: {
    height: 42,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
    borderRadius: 5,
    marginVertical: 5,
    padding: 12,
  },
  button: {
    height: 42,
    marginTop: 24,
    marginBottom: 12,
    backgroundColor: theme.components.formComponent.buttonBG,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: theme.textPresets.inverted,
    userSelect: "none",
  },
}));
