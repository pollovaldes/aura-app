import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormInput from "../Form/FormInput";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

type ModalProps = {
  closeModal: () => void;
  fetchFleets: () => void;
};

export default function AddFleetModal({ closeModal, fetchFleets }: ModalProps) {
  const { styles } = useStyles(stylesheet);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createFleet = async (title: string, description: string) => {
    const { data, error } = await supabase
      .from("fleets")
      .insert([
        {
          title,
          description,
        },
      ])
      .select();

    if (error) {
      alert(
        `Ocurrió un error al crear la flotilla: \n\nMensaje de error: ${error.message}\n\nCódigo de error: ${error.code}\n\nDetalles: ${error.details}\n\nSugerencia: ${error.hint}`
      );
      return;
    }

    fetchFleets();
    closeModal();
    router.navigate(`/fleets/${data[0].id}`);
  };

  const handleCreateFleet = async () => {
    setIsSubmitting(true);

    createFleet(title, description);

    setIsSubmitting(false);
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Crear una nueva flotilla" />
        <Text style={styles.subtitle}>
          Una flotilla es la unidad de organización dentro de Aura, que agrupa
          vehículos y usuarios para facilitar su gestión y coordinación.
        </Text>
      </View>
      <View style={styles.group}>
        <FormInput
          description="Nombre de la flottila"
          inputMode="text"
          autoCorrect={false}
          onChangeText={setTitle}
          editable={!isSubmitting}
        />
        <FormInput
          description="Descripción de la flotilla"
          inputMode="text"
          autoCorrect={false}
          onChangeText={setDescription}
          editable={!isSubmitting}
          multiline
        />
      </View>
      <View style={styles.group}>
        <FormButton
          title="Crear flotilla"
          onPress={handleCreateFleet}
          isDisabled={isSubmitting || !title || !description}
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
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  currentRoleText: {
    color: theme.textPresets.main,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
}));
