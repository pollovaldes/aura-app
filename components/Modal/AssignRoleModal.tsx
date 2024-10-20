import React from "react";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useAssignRole } from "@/hooks/peopleHooks/useAssignRole";

export default function AssignRoleModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const { styles } = useStyles(stylesheet);
  const { loading, assignUserRole } = useAssignRole();

  return (
    <View style={styles.section}>
      <FormTitle title="Asignar Rol" />
      <View style={styles.group}>
        <TouchableOpacity onPress={() => assignUserRole("ADMIN")}>
          <Text style={styles.optionText}>Administrador</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => assignUserRole("DRIVER")}>
          <Text style={styles.optionText}>Operador</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => assignUserRole("NO_ROLE")}>
          <Text style={styles.optionText}>Denegar acceso</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>
          Al seleccionar una de estas opciones, los permisos de visualización
          del usuario se actualizarán en tiempo real.
        </Text>
        <FormButton title="Aceptar" onPress={closeModal} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    rowGap: 10,
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
  optionText: {
    padding: 10,
    color: theme.ui.colors.primary,
    textAlign: "center",
    fontSize: 15,
  },
}));
