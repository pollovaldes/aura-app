import TermsAndPrivacy from "@/features/signIn/TermsAndPrivacy";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { supabase } from "@/lib/supabase";
import { RefreshControl, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { router, Stack } from "expo-router";
import React from "react";
import { Bell, Bug, Info, LogOut, Moon, Palette, User } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import ProfileColumn from "@/components/people/ProfileColumn";
import { QRCodeColumn } from "@/components/people/QRCodeColumn";
import Modal from "@/components/Modal/Modal";

export default function Profile() {
  const { styles } = useStyles(stylesheet);
  const signOut = async () => {
    await supabase.auth.signOut({ scope: "local" });
  };

  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { getGuaranteedProfile, isProfileLoading, fetchProfile } = useProfile();
  const profile = getGuaranteedProfile();

  if (isSessionLoading) {
    return <FetchingIndicator caption={"Cargando sesión"} />;
  }

  if (!session) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu sesión."
        buttonCaption="Intentar cerrar sesión"
        retryFunction={() => supabase.auth.signOut({ scope: "local" })}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Perfil",
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={isProfileLoading} onRefresh={fetchProfile} />}
      >
        <View style={styles.container}>
          <GroupedList>
            <Row>
              {profile.role === "NO_ROLE" ? <QRCodeColumn profile={profile} /> : <QRCodeColumn profile={profile} />}
            </Row>
          </GroupedList>
          <GroupedList>
            <Row
              title="Cuenta"
              icon={User}
              backgroundColor={colorPalette.green[500]}
              onPress={() => router.push("./account", { relativeToDirectory: true })}
            />
            <Row
              title="Datos personales"
              onPress={() => router.push("./personal_data", { relativeToDirectory: true })}
            />
          </GroupedList>
          <GroupedList header="Configuración">
            <Row
              title="Tema de la aplicación"
              icon={Moon}
              backgroundColor={colorPalette.neutral[500]}
              onPress={() => router.push("./theme", { relativeToDirectory: true })}
            />
            <Row
              title="Color de acento"
              icon={Palette}
              backgroundColor={colorPalette.cyan[500]}
              onPress={() => router.push("./accent_color", { relativeToDirectory: true })}
            />
            <Row
              title="Notificaciones"
              icon={Bell}
              backgroundColor={colorPalette.red[500]}
              onPress={() => router.push("./notifications", { relativeToDirectory: true })}
            />
          </GroupedList>

          <GroupedList header="Otros">
            <Row
              title="Sobre Aura"
              icon={Info}
              backgroundColor={colorPalette.emerald[500]}
              onPress={() => router.push("./about", { relativeToDirectory: true })}
            />
            <Row
              title="Reportar un problema"
              icon={Bug}
              backgroundColor={colorPalette.orange[500]}
              onPress={() => router.push("./report", { relativeToDirectory: true })}
            />
          </GroupedList>
          <GroupedList>
            <Row title="Cerrar sesión" icon={LogOut} backgroundColor={colorPalette.red[500]} onPress={signOut} />
          </GroupedList>
          <View style={styles.termsAndPrivacy}>
            <TermsAndPrivacy />
          </View>
          <View />
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
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
