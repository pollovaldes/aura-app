import { Pressable, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ArrowLeft } from "lucide-react-native";
import { PrimaryFormProps } from "./Form";
import { PhoneFormProps } from "./PhoneForm";
import { FormButton } from "@/components/FormButtons/FormButton";
import FormTitle from "./FormTitle";

export default function PhoneEnter({
  togglePrimaryForm,
  togglePhoneForm,
  setPhoneNumber,
  phoneNumber,
}: PrimaryFormProps & PhoneFormProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <FormTitle
        title="Continuar con celular"
        showBackButton={true}
        onBackPress={togglePrimaryForm}
      />
      <TextInput
        placeholder="Número de celular"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        inputMode="tel"
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
      />
      <FormButton
        onPress={togglePhoneForm}
        text="Enviar código de verificación"
        isLoading={false}
        style={styles.button}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  button: {
    marginVertical: 12,
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
}));
