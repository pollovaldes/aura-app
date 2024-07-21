import { useState } from "react";
import { Text } from "react-native";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { SignInText, SignUpText } from "./FormToggleText";
import SocialAuth from "./SocialAuth";

type FormType = "sign-in" | "sign-up";

export default function Form() {
  const [form, setForm] = useState<FormType>("sign-in");
  const { styles } = useStyles(stylesheet);

  const toggleForm = () => {
    setForm((prevForm) => (prevForm === "sign-in" ? "sign-up" : "sign-in"));
  };

  const titleText = form === "sign-in" ? "Iniciar Sesión" : "Crear una Cuenta";

  return (
    <>
      <Text style={styles.title}>{titleText}</Text>
      {form === "sign-in" ? (
        <SignUpText toggleForm={toggleForm} />
      ) : (
        <SignInText toggleForm={toggleForm} />
      )}
      {form === "sign-in" ? <SignIn /> : <SignUp />}
      <SocialAuth />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  title: {
    fontSize: 24,
    textAlign: "center",
    color: theme.colors.text.main,
    fontWeight: "bold",
  },
}));
