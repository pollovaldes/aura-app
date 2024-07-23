import { TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { PrimaryFormProps } from "./Form";
import { PhoneFormProps } from "./PhoneForm";
import { FormButton } from "@/components/Form/FormButton";
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
        title="Continuar con número de celular"
        showBackButton={true}
        onBackPress={togglePrimaryForm}
      />
      <View style={styles.group}>
        <TextInput
          placeholder="Número de celular"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="done"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
        />
        <FormButton
          onPress={togglePhoneForm}
          title="Siguiente"
          isLoading={false}
        />
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  textInput: {
    height: 45,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
    borderRadius: 5,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
}));
