import { Redirect, useLocalSearchParams } from "expo-router";
import PhoneAuth from "./PhoneAuth";
import EmailAuth from "./EmailAuth";

interface ValidQueries {
  query: "email" | "phone";
}

export default function FinishRegistration() {
  const local = useLocalSearchParams();

  if (!local.provider) {
    return <Redirect href="/" />;
  }

  if (local.provider === "email") {
    return <EmailAuth />;
  }

  if (local.provider === "phone") {
    return <PhoneAuth />;
  }

  return <Redirect href="/" />;
}
