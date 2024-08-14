import { createStyleSheet, useStyles } from "react-native-unistyles";
import Form from "./Form";
import AuthCard from "@/assets/authForms/AuthCard";

export default function Card() {
  return (
    <AuthCard>
      <Form />
    </AuthCard>
  );
}
