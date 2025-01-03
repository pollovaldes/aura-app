import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { isValidEmail, isValidPassword } from "../global/functions/validateInput";

export function CreateAccountModal() {
  const { styles } = useStyles(stylesheet);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  useEffect(() => {
    setEmailIsValid(isValidEmail(email));
    setPasswordIsValid(isValidPassword(password) && password === passwordConfirmation);
  }, [email, password, passwordConfirmation]);

  const mayCreateAccount = emailIsValid && passwordIsValid;

  const createAccount = async () => {
    if (!mayCreateAccount) {
      return;
    }

    setLoading(true);
    // Implement account creation logic here
    setLoading(false);
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Crea una nueva cuenta" />
        <Text style={styles.subtitle}>Ingresa los datos de tu nueva cuenta</Text>
      </View>
      <View style={styles.group}>
        <Text>EmailIsValid: {emailIsValid}</Text>
        <Text>passwordIsValid: {passwordIsValid}</Text>
        <FormInput
          description="Correo electrónico"
          textContentType="emailAddress"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <FormInput
          description="Contraseña"
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={setPassword}
        />
        <FormInput
          description="Repite la contraseña"
          secureTextEntry
          textContentType="password"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />
      </View>
      <View style={styles.group}>
        <FormButton title="Crear cuenta" onPress={createAccount} isDisabled={!mayCreateAccount} isLoading={loading} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
}));
