// ChangeImageModal.tsx
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/Vehicle";

interface ChangeVehicleImageModalProps {
  closeModal: () => void;
  vehicle: Vehicle;
}

export default function AddDocument({
  closeModal,
  vehicle,
}: ChangeVehicleImageModalProps) {
  const { styles } = useStyles(stylesheet);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleAddDocument = async () => {
    setIsUploading(true);
    const { data, error } = await supabase
      .from("vehicle_documentation_sheet")
      .insert([
        {
          vehicle_id: vehicle.id,
          title: documentTitle,
          description: documentDescription,
        },
      ])
      .select();

    if (error && !data) {
      console.error(error.details);
    }

    setIsUploading(false);
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Agregar un nuevo documento" />
        <Text style={styles.subtitle}>
          Llena los campos para agregar un nuevo documento a este vehículo.
        </Text>
      </View>
      <View style={styles.group}>
        <TextInput
          placeholder="Título del documento"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          onChangeText={setDocumentTitle}
        />
        <TextInput
          placeholder="Descripción del documento"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          onChangeText={setDocumentTitle}
        />
        <FormButton title="Seleccionar archivo" onPress={() => {}} />
      </View>
      <View style={styles.group}>
        <FormButton
          title="Agregar documento"
          onPress={() => {
            handleAddDocument();
            console.log("si");
          }}
          isLoading={isUploading}
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
  loadingContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  coverImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
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
