import { useState } from "react";
import SignInSignUpForm from "./SignInSignUpForm";
import PhoneForm from "./PhoneForm";
import AuraLogo from "@/components/web-logo-title/AuraLogo";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import TermsAndPrivacy from "./TermsAndPrivacy";
import { View } from "react-native";

type PrimaryFormType = "email" | "phone";
export type PrimaryFormProps = {
  togglePrimaryForm: () => void;
};

export default function Form() {
  const [activePrimaryForm, setActivePrimaryForm] =
    useState<PrimaryFormType>("email");

  const togglePrimaryForm = () => {
    setActivePrimaryForm(activePrimaryForm === "email" ? "phone" : "email");
  };

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.section}>
      <AuraLogo fill={styles.logo.color} style={styles.logo} />
      {activePrimaryForm === "phone" ? (
        <PhoneForm togglePrimaryForm={togglePrimaryForm} />
      ) : (
        <SignInSignUpForm togglePrimaryForm={togglePrimaryForm} />
      )}
      <TermsAndPrivacy />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  logo: {
    color: theme.colors.inverted,
    width: "40%",
  },
}));
