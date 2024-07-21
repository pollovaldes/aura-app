import { useState } from "react";
import { PrimaryFormProps } from "./Form";
import PhoneEnter from "./PhoneEnter";
import PhoneVerify from "./PhoneVerify";

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

  const togglePhoneForm = () => {
    setActivePhoneForm(activePhoneForm === "enter" ? "verify" : "enter");
  };

  return activePhoneForm === "enter" ? (
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
  );
}
