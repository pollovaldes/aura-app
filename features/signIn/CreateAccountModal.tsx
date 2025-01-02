import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function CreateAccountModal() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Crea una nueva cuenta" />
        <Text style={styles.subtitle}>Ingresa los datos de tu nueva cuenta</Text>
      </View>
      <View style={styles.group}>
        <FormInput description="Correo electrónico" textContentType="emailAddress" keyboardType="email-address" />
        <FormInput description="Contraseña" secureTextEntry textContentType="password" />
        <FormInput description="Repite la contraseña" secureTextEntry textContentType="password" />
      </View>
      <View style={styles.group}>
        <FormButton title="Crear cuenta" onPress={() => {}} />
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
