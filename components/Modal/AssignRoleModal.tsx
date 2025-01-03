import React from "react";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { Text, TouchableOpacity, View, Pressable } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useAssignRole } from "@/hooks/peopleHooks/useAssignRole";

export default function AssignRoleModal({ closeModal }: { closeModal: () => void }) {
  const { styles } = useStyles(stylesheet);
  const { loading, assignUserRole } = useAssignRole();

  return (
    <View style={styles.section}>
      <FormTitle title="Asignar Rol" />
      <View style={styles.group}>
        <View style={styles.optionsContainer}>
          <Pressable
            style={({ pressed }) => [styles.roleOption, pressed && styles.roleOptionPressed]}
            onPress={() => assignUserRole("ADMIN")}
          >
            <Text style={styles.roleTitle}>Administrador</Text>
            <Text style={styles.roleDescription}>Acceso total al sistema</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.roleOption, pressed && styles.roleOptionPressed]}
            onPress={() => assignUserRole("DRIVER")}
          >
            <Text style={styles.roleTitle}>Operador</Text>
            <Text style={styles.roleDescription}>Acceso a funciones operativas</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.roleOption, pressed && styles.roleOptionPressed]}
            onPress={() => assignUserRole("NO_ROLE")}
          >
            <Text style={styles.roleTitle}>Denegar acceso</Text>
            <Text style={styles.roleDescription}>Revocar todos los permisos</Text>
          </Pressable>
        </View>

        <Text style={styles.subtitle}>
          Al seleccionar una de estas opciones, los permisos de visualización del usuario se actualizarán en tiempo
          real.
        </Text>

        <FormButton title="Cerrar" onPress={closeModal} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    rowGap: 20,
    alignItems: "center",
    width: "100%",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  optionsContainer: {
    gap: 12,
    width: "100%",
  },
  roleOption: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.ui.colors.card,
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
  },
  roleOptionPressed: {
    backgroundColor: theme.ui.colors.primary,
    opacity: 0.8,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.headerButtons.color,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: theme.textPresets.subtitle,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 10,
  },
}));
