import { useState } from "react";
import { PrimaryFormProps } from "./Form";
import PhoneEnter from "./PhoneEnter";
import PhoneVerify from "./PhoneVerify";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import TermsAndPrivacy from "./TermsAndPrivacy";

type PhoneFormType = "enter" | "verify";
export type PhoneFormProps = {
  togglePhoneForm: () => void;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
};

export default function PhoneForm({ togglePrimaryForm }: PrimaryFormProps) {
  const [activePhoneForm, setActivePhoneForm] =
    useState<PhoneFormType>("enter");

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const { styles } = useStyles(stylesheet);

  const togglePhoneForm = () => {
    setActivePhoneForm(activePhoneForm === "enter" ? "verify" : "enter");
  };

  return (
    <View style={styles.section}>
      {activePhoneForm === "enter" ? (
        <PhoneEnter
          togglePrimaryForm={togglePrimaryForm}
          togglePhoneForm={togglePhoneForm}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      ) : (
        <PhoneVerify
          togglePhoneForm={togglePhoneForm}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      )}
      <TermsAndPrivacy />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
}));
