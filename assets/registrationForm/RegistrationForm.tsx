import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/form/FormButton";
import { useSession } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function RegistrationForm() {
  const { styles } = useStyles(stylesheet);

  const [name, setName] = useState("");
  const [firstLastName, setFirstLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const session = useSession();

  const signOut = async () => {
    let { error } = await supabase.auth.signOut();
  };

  const checkUserProfile = async () => {
    setLoading(true);
    if (session) {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: `${name.trim()} ${firstLastName.trim()} ${secondLastName.trim()}`,
        })
        .eq("id", session.user.id)
        .single();

      setData(data);

      if (error) {
        Alert.alert("Error", error.message);
        setLoading(false);
        return;
      }

      Alert.alert("Éxito", "Perfil actualizado");
      setLoading(false);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Finaliza tu registro" />
        <Text style={styles.subtitle}>
          Para poder continuar debes terminar de llenar tus datos personales.
        </Text>
      </View>
      <View style={styles.group}>
        <TextInput
          placeholder="Nombre"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          autoCorrect={false}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Apellido paterno"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          autoCorrect={false}
          onChangeText={setFirstLastName}
        />
        <TextInput
          placeholder="Apellido materno"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          autoCorrect={false}
          onChangeText={setSecondLastName}
        />
        <FormButton
          title="Continuar"
          onPress={checkUserProfile}
          isLoading={loading}
        />
        <FormButton title="Cerrar sesión" onPress={signOut} />
        <Text>{JSON.stringify(data)}</Text>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  logo: {
    color: theme.colors.inverted,
    width: 180,
    height: 60,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
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
