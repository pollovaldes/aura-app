// ChangeImageModal.tsx
import React from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { Document } from "@/hooks/useDocuments";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";

interface ChangeVehicleImageModalProps {
  closeModal: () => void;
  document: Document;
}

export default function EditDocument({
  closeModal,
  document,
}: ChangeVehicleImageModalProps) {
  const { styles } = useStyles(stylesheet);
  const [documentNewName, setDocumentNewName] = React.useState("");

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
          placeholder="Nombre"
          description="Nuevo nombre"
        />
        <FormButton
          title="Renombrar"
          onPress={() => {
            closeModal();
          }}
        />
      </View>
      <View style={styles.group}>
        <FormButton
          title="Reemplazar archivo"
          onPress={() => {
            closeModal();
          }}
        />
        <FormButton
          title="Eliminar"
          onPress={() => {
            closeModal();
          }}
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
}));
