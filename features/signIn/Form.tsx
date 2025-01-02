import Apple from "@/assets/icons/Apple";
import Google from "@/assets/icons/Google";
import Phone from "@/assets/icons/Phone";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import AuraLogo from "@/components/web-logo-title/AuraLogo";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import TermsAndPrivacy from "./TermsAndPrivacy";
import { SignInModalType } from "./SignInModalType";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

//props
type FormProps = {
  setActiveModal: React.Dispatch<React.SetStateAction<SignInModalType>>;
};

export function Form({ setActiveModal }: FormProps) {
  const { styles } = useStyles(stylesheet);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    setLoading(false);
    router.push("/tab/vehicles");
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <AuraLogo fill={styles.auraLogo.color} style={styles.auraLogo} />
        <Text style={styles.text}>
          <Text style={styles.textPlain}>¿No tienes una cuenta? </Text>
          <Text style={styles.textLink} onPress={() => setActiveModal("create_account")}>
            Regístrate
          </Text>
        </Text>
        <Text style={styles.text}>
          <Text style={styles.textPlain}>¿Olvidaste tu contraseña? </Text>
          <Text style={styles.textLink} onPress={() => setActiveModal("forgot_password")}>
            Recupérala
          </Text>
        </Text>
      </View>
      <View style={styles.group}>
        <FormInput
          description="Correo electrónico"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
        <FormInput
          description="Contraseña"
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <FormButton
          title="Continuar"
          onPress={signIn}
          isLoading={loading}
          isDisabled={password === "" || email === ""}
        />
        <View style={styles.socialAuthContainer}>
          <Pressable style={styles.socialAuthItem} onPress={() => setActiveModal("number_sign_in")}>
            <Phone fill={styles.socialAuthIcon.color} />
          </Pressable>
          <Pressable style={styles.socialAuthItem}>
            <Google />
          </Pressable>
          <Pressable style={styles.socialAuthItem}>
            <Apple fill={styles.socialAuthIcon.color} />
          </Pressable>
        </View>
      </View>
      <TermsAndPrivacy />
    </View>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  socialAuthContainer: {
    display: "flex",
    flexDirection: "row",
    gap: theme.marginsComponents.group,
  },
  socialAuthItem: {
    flexGrow: 1,
    height: 60,
    padding: 8,
    borderRadius: 6,
    borderWidth: runtime.hairlineWidth,
    borderColor: theme.ui.colors.border,
  },
  socialAuthIcon: {
    color: theme.colors.inverted,
  },
  auraLogo: {
    color: theme.colors.inverted,
    width: 180,
    height: 70,
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 14,
  },
  textPlain: {
    color: theme.textPresets.subtitle,
  },
  textLink: {
    color: theme.ui.colors.primary,
    textDecorationLine: "underline",
  },
}));
