import { SignInText, SignUpText } from "./FormToggleText";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SocialAuth from "./SocialAuth";
import { PrimaryFormProps } from "./Form";
import { useState } from "react";
import FormTitle from "./FormTitle";

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

  return (
    <>
      <FormTitle title={title} />
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
