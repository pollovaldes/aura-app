import { FormButton } from "@/components/Form/FormButton";
import { useSession } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";


export default function SignUp() {
  const { styles } = useStyles(stylesheet);
  const session = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");

  const checkUserProfile = async () => {
    setIsLoading(true);
    if (session) {
      const { data, error } = await supabase
      .from("profiles")
      .update({full_name: `${name.trim()} ${lastName.trim()} ${secondLastName.trim()}`})
      .eq("id", session.user.id)
      .single();
      
      if (error) {
        Alert.alert("Error", error.message);
        setIsLoading(false);
        return;
      }

      Alert.alert("Éxito", "Perfil actualizado");
      setIsLoading(false);
    }

    router.replace("/auth");
  };

  return (
    <>
      <TextInput
        placeholder="Nombre"
        autoComplete="name"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Apellido paterno"
        autoComplete="name"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Apellido materno"
        autoComplete="name"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        onChangeText={setSecondLastName}
      />
      <FormButton
        title="Crear cuenta"
        onPress={checkUserProfile}
        isLoading={isLoading}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
}));
