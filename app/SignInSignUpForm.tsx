import { Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { SignInText, SignUpText } from "./FormToggleText";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SocialAuth from "./SocialAuth";
import { PrimaryFormProps } from "./Form";
import { useState } from "react";

type EmailFormType = "sign-in" | "sign-up";
export type EmailFormProps = {
  toggleEmailForm: () => void;
};

export default function SignInSignUpForm({
  togglePrimaryForm,
}: PrimaryFormProps) {
  const { styles } = useStyles(stylesheet);

  const [activeEmailForm, setActiveEmailForm] =
    useState<EmailFormType>("sign-in");

  const toggleEmailForm = () => {
    setActiveEmailForm(activeEmailForm === "sign-in" ? "sign-up" : "sign-in");
  };

  const title = activeEmailForm === "sign-in" ? "Iniciar Sesión" : "Regístrate";

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      {activeEmailForm === "sign-in" ? (
        <SignUpText toggleEmailForm={toggleEmailForm} />
      ) : (
        <SignInText toggleEmailForm={toggleEmailForm} />
      )}
      {activeEmailForm === "sign-in" ? <SignIn /> : <SignUp />}
      <SocialAuth togglePrimaryForm={togglePrimaryForm} />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  title: {
    fontSize: 24,
    textAlign: "center",
    color: theme.textPresets.main,
    fontWeight: "bold",
  },
}));
