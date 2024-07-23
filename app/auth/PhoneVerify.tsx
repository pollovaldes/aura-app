import { Text, TextInput, View } from "react-native";
import { PhoneFormProps } from "./PhoneForm";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";
import FormTitle from "./FormTitle";
import { useState } from "react";

export default function ({ togglePhoneForm, phoneNumber }: PhoneFormProps) {
  const { styles } = useStyles(stylesheet);

  const [code, setCode] = useState("");

  return (
    <>
      <View style={styles.group}>
        <FormTitle
          title="Verificar teléfono"
          onBackPress={togglePhoneForm}
          showBackButton={true}
        />
        <Text>
          <Text style={styles.subtitle}>
            Se envió un código de un solo uso a{" "}
          </Text>
          <Text style={styles.numberSubtitle}>{phoneNumber}</Text>
        </Text>
      </View>
      <View style={styles.group}>
        <TextInput
          style={styles.textInput}
          placeholder="000-000"
          inputMode="numeric"
          enterKeyHint="done"
          textAlign="center"
          autoComplete="one-time-code"
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          maxLength={6}
          onChangeText={(text) => {
            setCode(text);
          }}
        />
        <FormButton
          title="Verificar"
          onPress={() => {}}
          style={styles.buttonVerify}
          isLoading={true}
        />
        <FormButton
          title="Reenviar código"
          onPress={() => {}}
          style={styles.buttonResend}
        />
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  group: {
    gap: theme.marginsComponents.group,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
  },
  numberSubtitle: {
    color: theme.ui.colors.primary,
    fontWeight: "bold",
  },
  textInput: {
    height: 70,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 40,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
  buttonVerify: {
    backgroundColor: theme.components.formComponent.buttonMainBG,
  },
  buttonResend: {
    backgroundColor: theme.components.formComponent.buttonSecondaryBG,
  },
}));
