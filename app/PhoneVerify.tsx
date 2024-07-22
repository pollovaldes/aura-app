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
      </View>
      <View style={styles.group}>
        <TextInput
          style={styles.textInput}
          placeholder="000-000"
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          inputMode="numeric"
          maxLength={6}
          enterKeyHint="done"
          onChangeText={(text) => {
            setCode(text);
          }}
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
    textAlign: "center",
    fontSize: 40,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
  buttonVerify: {
    backgroundColor: theme.components.formComponent.buttonSkyBG,
  },
  buttonResend: {
    backgroundColor: theme.components.formComponent.buttonNeutralBG,
  },
}));
