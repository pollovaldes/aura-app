// ChangeImageModal.tsx
import React from "react";
import { View, Text, Alert } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react-native";
import { router } from "expo-router";
import { MaintenanceDocument } from "@/hooks/useMaintenanceDocuments";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";

interface editMaintenanceDocumentModalProps {
  closeModal: () => void;
  fetchDocuments: () => void;
  document: MaintenanceDocument;
}

export default function EditMaintenanceDocument({
  closeModal,
  fetchDocuments,
  document,
}: editMaintenanceDocumentModalProps) {
  const { styles } = useStyles(stylesheet);
  const [documentNewName, setDocumentNewName] = React.useState(document.title);
  const [documentNewDescription, setDocumentNewDescription] = React.useState(document.description);
  const [isDocumentUpdating, setIsDocumentUpdating] = React.useState(false);

  const deleteDocument = ConfirmDialog({
    title: "Confirmación",
    message: `¿Estás seguro de que quieres eliminar el archivo "${document.title}"? Esta acción no se puede deshacer.`,
    cancelText: "Cancelar",
    confirmText: "Eliminar",
    confirmStyle: "destructive",
    onConfirm: async () => {
      setIsDocumentUpdating(true);
      await supabase.storage
        .from("maintenance_files")
        .remove([`${document.vehicle_id}/${document.maintenance_id}/${document.document_id}`]);

      await supabase.from("vehicle_maintenance_documentation").delete().eq("document_id", document.document_id);

      fetchDocuments();
      setIsDocumentUpdating(false);
      router.back();
    },
    onCancel: () => {},
  });

  const updateDocumentName = async () => {
    setIsDocumentUpdating(true);
    const { data, error } = await supabase
      .from("vehicle_maintenance_documentation")
      .update({ title: documentNewName, description: documentNewDescription })
      .eq("document_id", document.document_id)
      .select();

    if (error) {
      alert(
        `Ocurrió un error al actualizar el nombre o descripción del archivo \n–––– Detalles del error ––––\n\nMensaje de error: ${error.message}`
      );
    }

    setIsDocumentUpdating(false);
    fetchDocuments();
    closeModal();
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title={"Opciones del documento"} />
        <Text style={styles.subtitle}>"{document.title}"</Text>
      </View>
      <View style={styles.group}>
        <FormInput
          onChangeText={setDocumentNewName}
          description="Nombre"
          value={documentNewName}
          editable={!isDocumentUpdating}
        />
        <FormInput
          onChangeText={setDocumentNewDescription}
          description="Descripción"
          multiline
          placeholder="Sin descripción"
          value={documentNewDescription}
          editable={!isDocumentUpdating}
        />
        <FormButton title="Actualizar" onPress={updateDocumentName} isDisabled={isDocumentUpdating} />
      </View>
      <View style={styles.group}>
        <FormButton
          title="Eliminar"
          onPress={() => deleteDocument.showDialog()}
          buttonType="danger"
          Icon={Trash2}
          isDisabled={isDocumentUpdating}
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
  iconColor: {
    color: theme.textPresets.inverted,
  },
}));
