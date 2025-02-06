import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { useState } from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormInput from "../Form/FormInput";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useFleets } from "@/hooks/useFleets";
import Toast from "react-native-toast-message";

const showToast = (title: string, caption: string) => {
  Toast.show({
    type: "alert",
    text1: title,
    text2: caption,
  });
};

type ModalProps = {
  close: () => void;
};

export default function AddFleetModal({ close }: ModalProps) {
  const { styles } = useStyles(stylesheet);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchFleetById } = useFleets();

  const createFleet = async (title: string, description: string) => {
    const { data, error } = await supabase
      .from("fleet")
      .insert([
        {
          title,
          description,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(
        `Ocurrió un error al crear la flotilla: \n\nMensaje de error: ${error.message}\n\nCódigo de error: ${error.code}\n\nDetalles: ${error.details}\n\nSugerencia: ${error.hint}`
      );
      return;
    }

    close();
    fetchFleetById(data.id);
    showToast("Flotilla creada", "La flotilla ha sido creada exitosamente");
    router.push(`./${data.id}`, { relativeToDirectory: true });
  };

  const handleCreateFleet = async () => {
    setIsSubmitting(true);

    await createFleet(title, description);

    setIsSubmitting(false);
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Crear una nueva flotilla" />
        <Text style={styles.subtitle}>
          Una flotilla es la unidad de organización dentro de Aura, que agrupa vehículos y usuarios para facilitar su
          gestión y coordinación.
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
