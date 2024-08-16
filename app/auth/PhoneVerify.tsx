import { Text, TextInput, View } from "react-native";
import { PhoneFormProps } from "./PhoneForm";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";
import FormTitle from "./FormTitle";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ({ togglePhoneForm, phoneNumber }: PhoneFormProps) {
  const { styles } = useStyles(stylesheet);

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    const { data: verifyData, error: verifyError } =
      await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: code,
        type: "sms",
      });

    if (verifyError) {
      setError(verifyError.message);
      console.error(verifyError.message);
      setIsLoading(false);
    } else {
      console.log("OTP verified successfully", verifyData);

      // Update the user's phone number in Supabase
      const { data: updateData, error: updateError } =
        await supabase.auth.updateUser({
          phone: phoneNumber,
        });

      setIsLoading(false);

      if (updateError) {
        setError(updateError.message);
        console.error(updateError.message);
      } else {
        console.log("User phone number updated successfully", updateData);
        togglePhoneForm();
      }
    }
  };

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
          placeholderTextColor={styles.textInput.placeholderTextColor}
          maxLength={6}
          onChangeText={(text) => {
            setCode(text);
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <FormButton
          title="Verificar"
          onPress={handleOtpSubmit}
          style={styles.buttonVerify}
          isLoading={isLoading}
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
    textAlign: "center",
    height: 70,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 40,
    color: theme.textPresets.main,
    placeholderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
  buttonVerify: {
    backgroundColor: theme.components.formComponent.buttonMainBG,
  },
  buttonResend: {
    backgroundColor: theme.components.formComponent.buttonSecondaryBG,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
}));
