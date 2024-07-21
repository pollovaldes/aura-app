import { Pressable, Text, TextInput, View } from "react-native";
import { PhoneFormProps } from "./PhoneForm";
import { ArrowLeft } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/FormButtons/FormButton";
import Form from "./Form";
import FormTitle from "./FormTitle";

export default function ({ togglePhoneForm, phoneNumber }: PhoneFormProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <FormTitle
        title="Verificar código"
        onBackPress={togglePhoneForm}
        showBackButton={true}
      />
      <Text>
        <Text style={styles.subtitle}>
          Hemos enviado un código de verificación de 6 dígitos a{" "}
        </Text>
        <Text style={styles.numberSubtitle}>{phoneNumber}</Text>
      </Text>
      <TextInput
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="numeric"
        maxLength={6}
        enterKeyHint="done"
      />
      <FormButton
        title="Verificar e iniciar sesión"
        onPress={() => {}}
        style={styles.buttonVerify}
      />
      <FormButton
        title="Reenviar código"
        onPress={() => {}}
        style={styles.buttonResend}
        disabled={true}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  subtitle: {
    color: theme.textPresets.subtitle,
  },
  numberSubtitle: {
    color: theme.ui.colors.primary,
    fontWeight: "bold",
  },
  textInput: {
    height: 60,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 40,
    textAlignVertical: "center",
  },
  buttonVerify: {
    marginVertical: 12,
    backgroundColor: theme.components.formComponent.buttonSkyBG,
  },
  buttonResend: {
    backgroundColor: theme.components.formComponent.buttonNeutralBG,
  },
}));
