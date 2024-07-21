import { Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface TextProps {
  toggleForm: () => void;
}

const stylesheet = createStyleSheet((theme) => ({
  text: {
    color: theme.colors.text.main,
    textAlign: "center",
    padding: 12,
    marginBottom: 12,
  },
  link: {
    color: "#0ea5e9", // Customize link color
    textDecorationLine: "underline",
    userSelect: "none",
  },
}));

const SignInText = ({ toggleForm }: TextProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={styles.text}>
      <Text>¿Ya tienes una cuenta? </Text>
      <Text style={styles.link} onPress={toggleForm}>
        Inicia Sesión
      </Text>
    </Text>
  );
};

const SignUpText = ({ toggleForm }: TextProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={styles.text}>
      <Text>¿No tienes una cuenta? </Text>
      <Text style={styles.link} onPress={toggleForm}>
        Regístrate
      </Text>
    </Text>
  );
};

export { SignInText, SignUpText };
