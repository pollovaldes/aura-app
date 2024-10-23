// ChangeImageModal.tsx
import React from "react";
import { View, Text, Alert } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { Document } from "@/hooks/useDocuments";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { supabase } from "@/lib/supabase";
import { Replace, Trash, Trash2 } from "lucide-react-native";
import { router } from "expo-router";

interface editDocumentModalProps {
  closeModal: () => void;
  fetchDocuments: () => void;
  document: Document;
}

export default function EditDocument({
  closeModal,
  fetchDocuments,
  document,
}: editDocumentModalProps) {
  const { styles } = useStyles(stylesheet);
  const [documentNewName, setDocumentNewName] = React.useState(document.title);
  const [documentNewDescription, setDocumentNewDescription] = React.useState(
    document.description
  );
  const [isDocumentUpdating, setIsDocumentUpdating] = React.useState(false);

  const deleteDocument = async () => {
    Alert.alert(
      "Confirmación",
      `¿Estás seguro de que quieres eliminar el archivo "${document.title}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setIsDocumentUpdating(true);
            // Delete the document from the storage
            await supabase.storage
              .from("documents")
              .remove([`${document.vehicle_id}/${document.document_id}`]);

            // Delete the document reference from the database table
            await supabase
              .from("vehicle_documentation_sheet")
              .delete()
              .eq("document_id", document.document_id);

            fetchDocuments();
            setIsDocumentUpdating(false);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title={"Opciones del documento"} />
        <Text style={styles.subtitle}>
          Reemplaza, elimina o renombra el documento: {"\n"}"{document.title}"
        </Text>
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
          placeholder="Sin descripción"
          value={documentNewDescription}
          editable={!isDocumentUpdating}
        />
        <FormButton
          title="Actualizar"
          onPress={() => {
            closeModal();
          }}
          isDisabled={isDocumentUpdating}
        />
      </View>
      <View style={styles.group}>
        <Text style={styles.subtitle}>O</Text>
      </View>
      <View style={styles.group}>
        <FormButton
          title="Reemplazar archivo"
          onPress={() => {
            closeModal();
          }}
          icon={() => <Replace color={styles.iconColor.color} />}
          isDisabled={isDocumentUpdating}
        />
        <FormButton
          title="Eliminar"
          onPress={() => {
            deleteDocument();
          }}
          buttonType="danger"
          icon={() => <Trash2 color={styles.iconColor.color} />}
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
