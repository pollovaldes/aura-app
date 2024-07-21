import { Pressable, Text } from "react-native";
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
      ¿Ya tienes una cuenta?{" "}
      <Pressable onPress={toggleForm}>
        <Text style={styles.link}>Inicia Sesión</Text>
      </Pressable>
    </Text>
  );
};

const SignUpText = ({ toggleForm }: TextProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={styles.text}>
      ¿No tienes una cuenta?{" "}
      <Pressable onPress={toggleForm}>
        <Text style={styles.link}>Regístrate</Text>
      </Pressable>
    </Text>
  );
};

export { SignInText, SignUpText };
