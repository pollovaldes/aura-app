import { TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
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
        enterKeyHint="done"
      />
      <FormButton
        onPress={togglePhoneForm}
        title="Enviar código de verificación"
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
    height: 45,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
    borderRadius: 5,
    marginVertical: 5,
  },
}));
