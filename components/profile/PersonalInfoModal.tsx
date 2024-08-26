import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { useSession } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function PersonalInfoModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const { styles } = useStyles(stylesheet);

  const [name, setName] = useState("");
  const [firstLastName, setFirstLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  const session = useSession();

  const maySubmit: boolean =
    name === "" || firstLastName === "" || secondLastName === "";

  const checkUserProfile = async () => {
    setLoading(true);
    if (session) {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          nombre: name.trim(),
          apellido_paterno: firstLastName.trim(),
          apellido_materno: secondLastName.trim(),
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
      closeModal();
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Datos personales" />
        <Text style={styles.subtitle}>
          Actualiza o guarda por primera vez tus datos personales.
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
          title="Guardar"
          onPress={checkUserProfile}
          isLoading={loading}
          isDisabled={maySubmit}
        />
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
