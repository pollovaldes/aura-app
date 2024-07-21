import { Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { EmailFormProps } from "./SignInSignUpForm";

const stylesheet = createStyleSheet((theme) => ({
  text: {
    color: theme.textPresets.main,
    textAlign: "center",
    marginBottom: 12,
  },
  link: {
    color: theme.textPresets.link, // Customize link color
    textDecorationLine: "underline",
    userSelect: "none",
  },
}));

const SignInText = ({ toggleEmailForm }: EmailFormProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={styles.text}>
      <Text>¿Ya tienes una cuenta? </Text>
      <Text style={styles.link} onPress={toggleEmailForm}>
        Inicia Sesión
      </Text>
    </Text>
  );
};

const SignUpText = ({ toggleEmailForm }: EmailFormProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={styles.text}>
      <Text>¿No tienes una cuenta? </Text>
      <Text style={styles.link} onPress={toggleEmailForm}>
        Regístrate
      </Text>
    </Text>
  );
};

export { SignInText, SignUpText };
