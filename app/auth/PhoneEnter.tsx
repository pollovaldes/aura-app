import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { PrimaryFormProps } from "./Form";
import { PhoneFormProps } from "./PhoneForm";
import { FormButton } from "@/components/form/FormButton";
import FormTitle from "./FormTitle";
import { supabase } from "@/lib/supabase";

export default function PhoneEnter({
  togglePrimaryForm,
  togglePhoneForm,
  setPhoneNumber,
  phoneNumber,
}: PrimaryFormProps & PhoneFormProps) {
  const { styles } = useStyles(stylesheet);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    setIsLoading(false);

    if (error) {
      setError(error.message);
      console.error(error.message);
    } else {
      togglePhoneForm();
    }
  };

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
          placeholderTextColor={styles.textInput.placeholderTextColor}
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <FormButton
          onPress={handlePhoneSubmit}
          title="Siguiente"
          isLoading={isLoading}
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
    placeholderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
    borderRadius: 5,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
}));
