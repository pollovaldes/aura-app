import { useState } from "react";
import PhoneForm from "./PhoneEnter";
import SignInSignUpForm from "./SignInSignUpForm";

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

  return activePrimaryForm === "phone" ? (
    <PhoneForm togglePrimaryForm={togglePrimaryForm} />
  ) : (
    <SignInSignUpForm togglePrimaryForm={togglePrimaryForm} />
  );
}
