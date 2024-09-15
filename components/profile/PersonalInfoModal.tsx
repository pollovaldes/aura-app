import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { useSession } from "@/context/SessionContext";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
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
  const [fatherLastName, setFirstLastName] = useState("");
  const [motherLastName, setSecondLastName] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  const session = useSession();
  const maySubmit: boolean =
    name === "" ||
    fatherLastName === "" ||
    motherLastName === "" ||
    position === "";

  const updateProfile = async () => {
    setLoading(true);
    if (session) {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: name.trim(),
          father_last_name: fatherLastName.trim(),
          mother_last_name: motherLastName.trim(),
          position: position.trim(),
        })
        .eq("id", session.user.id)
        .single();

      if (!error) {
        alert("¡Se actualizaron los datos con éxito!");
        setLoading(false);
        closeModal();
        router.replace("/"); //Refresh the whole app
      } else {
        alert(`¡Ocurrió un error!\n${error.message}`);
        setLoading(false);
        return;
      }
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
        <TextInput
          placeholder="Posición"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          autoCorrect={false}
          onChangeText={setPosition}
        />
        <FormButton
          title="Guardar"
          onPress={updateProfile}
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
