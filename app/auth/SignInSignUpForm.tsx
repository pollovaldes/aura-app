import { SignInText, SignUpText } from "./FormToggleText";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SocialAuth from "./SocialAuth";
import { PrimaryFormProps } from "./Form";
import { useState } from "react";
import FormTitle from "./FormTitle";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type EmailFormType = "sign-in" | "sign-up";
export type EmailFormProps = {
  toggleEmailForm: () => void;
};

export default function SignInSignUpForm({
  togglePrimaryForm,
}: PrimaryFormProps) {
  const [activeEmailForm, setActiveEmailForm] =
    useState<EmailFormType>("sign-in");

  const toggleEmailForm = () => {
    setActiveEmailForm(activeEmailForm === "sign-in" ? "sign-up" : "sign-in");
  };

  const title = activeEmailForm === "sign-in" ? "Iniciar Sesión" : "Regístrate";

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title={title} />
        {activeEmailForm === "sign-in" ? (
          <SignUpText toggleEmailForm={toggleEmailForm} />
        ) : (
          <SignInText toggleEmailForm={toggleEmailForm} />
        )}
      </View>
      <View style={styles.group}>
        {activeEmailForm === "sign-in" ? <SignIn /> : <SignUp />}
        <SocialAuth togglePrimaryForm={togglePrimaryForm} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    width: "100%",
  },
  group: {
    gap: theme.marginsComponents.group,
  },
}));
