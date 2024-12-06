import TermsAndPrivacy from "@/app/auth/TermsAndPrivacy";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import Modal from "@/components/Modal/Modal";
import PersonalInfoModal from "@/components/profile/PersonalInfoModal";
import RoleModal from "@/components/profile/RoleModal";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { RefreshControl, ScrollView, Switch, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import ProfileRow from "@/components/profile/ProfileRow";
import ChangeImageModal from "@/components/profile/ChangeImageModal";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";

type ModalType =
  | "personal_info"
  | "role"
  | "email"
  | "password"
  | "change_image"
  | null;

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const signOut = async () => {
    let { error } = await supabase.auth.signOut({ scope: "local" });
  };

  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  if (isSessionLoading) {
    return <LoadingScreen caption="Cargando sesión" />;
  }

  if (isProfileLoading) {
    return <LoadingScreen caption="Cargando perfil" />;
  }

  if (!profile) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchProfile}
      />
    );
  }

  if (!session) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu sesión"
        buttonCaption="Intentar cerrar sesión"
        retryFunction={() => supabase.auth.signOut({ scope: "local" })}
      />
    );
  }

  if (!session.user.identities) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tus identidades"
        buttonCaption="Intentar cerrar sesión"
        retryFunction={() => supabase.auth.signOut({ scope: "local" })}
      />
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          refreshing={isProfileLoading}
          onRefresh={fetchProfile}
        />
      }
    >
      <View style={styles.container}>
        <GroupedList
          header="Es más fácil manejar los permisos a través de flotillas (algo así como un grupo de canvas) que a través de permisos por cada administrador. Esto se implementa en fa, no se me asusten. Ustedes chambeen como si nada "
          footer="Que ya se acabe por favor 🙏🙏"
        >
          <Row
            title="chido"
            trailingType="chevron"
            caption="que rollo bandera"
          />
        </GroupedList>
        <View />
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section, //Excepción
  },
  termsAndPrivacy: {
    marginHorizontal: 12,
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  text: {
    color: theme.textPresets.main,
  },
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
  closeButton: {
    color: theme.headerButtons.color,
    fontSize: 18,
    textAlign: "right",
  },
}));
