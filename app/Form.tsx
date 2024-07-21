import { useState } from "react";
import SignInSignUpForm from "./SignInSignUpForm";
import PhoneForm from "./PhoneForm";
import PrivacyPolicy from "./privacy-policy";
import TermsAndPrivacy from "./TermsAndPrivacy";

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

  return (
    <>
      {activePrimaryForm === "phone" ? (
        <PhoneForm togglePrimaryForm={togglePrimaryForm} />
      ) : (
        <SignInSignUpForm togglePrimaryForm={togglePrimaryForm} />
      )}
      <TermsAndPrivacy />
    </>
  );
}
