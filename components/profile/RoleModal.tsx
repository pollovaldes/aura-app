import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { Profile } from "@/hooks/useProfile";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type RoleModalProps = {
  closeModal: () => void;
  profile: Profile;
};

const roleDescriptions = {
  ADMIN:
    "Eres un administrador, lo que significa que puedes gestionar usuarios, configuraciones y modificar datos.",
  DRIVER:
    "Eres un conductor, puedes ver los camiones que tu supervisor te haya asignado, consultar información sobre ellos, y hacer peticiones sobre viajes, cargas de combustibles, etc.",
  BANNED: "Estás bloqueado, no puedes acceder a la aplicación.",
  NO_ROLE: "No tienes un rol asignado, contacta a soporte.",
  OWNER: "Eres el dueño de la aplicación, puedes gestionar todo.",
  UNDEFINED: "Tu rol no está definido, contacta a soporte.",
};

export default function RoleModal({ closeModal, profile }: RoleModalProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <Text style={styles.subtitle}>En este momento tu rol es:</Text>
        <Text style={styles.currentRoleText}>
          {(() => {
            switch (profile.role) {
              case "ADMIN":
                return "Administrador";
              case "DRIVER":
                return "Conductor";
              case "BANNED":
                return "Bloqueado";
              case "NO_ROLE":
                return "Sin rol";
              case "OWNER":
                return "Dueño";
              default:
                return "Indefinido";
            }
          })()}
        </Text>
      </View>
      <View style={styles.group}>
        <Text style={styles.subtitle}>
          {(() => {
            switch (profile.role) {
              case "ADMIN":
                return roleDescriptions.ADMIN;
              case "DRIVER":
                return roleDescriptions.DRIVER;
              case "BANNED":
                return roleDescriptions.BANNED;
              case "NO_ROLE":
                return roleDescriptions.NO_ROLE;
              case "OWNER":
                return roleDescriptions.OWNER;
              default:
                return roleDescriptions.UNDEFINED;
            }
          })()}
        </Text>
        <FormButton title="Aceptar" onPress={closeModal} />
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
