import TermsAndPrivacy from "@/app/auth/TermsAndPrivacy";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { supabase } from "@/lib/supabase";
import { RefreshControl, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import ProfileRow from "@/components/profile/ProfileRow";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { SkeletonLoading } from "@/components/dataStates/SkeletonLoading";
import { Stack } from "expo-router";
import React from "react";
import { Bug, Code, LogOut, Moon, User } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import ProfileColumn from "@/components/people/ProfileColumn";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const signOut = async () => {
    await supabase.auth.signOut({ scope: "local" });
  };

  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  if (isProfileLoading || isSessionLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <SkeletonLoading />
      </>
    );
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
        {profile.is_fully_registered && (
          <GroupedList>
            <Row trailingType="chevron" title="">
              <ProfileColumn profile={profile} />
            </Row>
          </GroupedList>
        )}
        <GroupedList
          footer="Tu perfil debe estar completo para acceder a todas las funcionalidades de la aplicación"
          header="Acceso a la App"
        >
          <Row
            title="Datos personales"
            trailingType="chevron"
            caption={
              profile.is_fully_registered ? "Completo" : "Sin completar ⚠️"
            }
          />
          <Row
            title="Rol"
            trailingType="chevron"
            caption={(() => {
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
          />
        </GroupedList>
        <GroupedList>
          <Row
            title="Cuenta"
            icon={<User size={24} color="white" />}
            color={colorPalette.cyan[500]}
            trailingType="chevron"
          />
          <Row
            title="Tema de la aplicación"
            icon={<Moon size={24} color="white" />}
            color={colorPalette.neutral[500]}
            trailingType="chevron"
          />
        </GroupedList>

        <GroupedList header="Otros">
          <Row
            title="Licensias de código abierto"
            icon={<Code size={24} color="white" />}
            color={colorPalette.green[500]}
            trailingType="chevron"
          />
          <Row
            title="Reportar un problema"
            icon={<Bug size={24} color="white" />}
            color={colorPalette.orange[500]}
            trailingType="chevron"
          />
        </GroupedList>
        <GroupedList>
          <Row
            title="Cerrar sesión"
            icon={<LogOut size={24} color="white" />}
            color={colorPalette.red[500]}
            trailingType="chevron"
            onPress={signOut}
          />
        </GroupedList>
        <View style={styles.termsAndPrivacy}>
          <TermsAndPrivacy />
        </View>
        <View />
      </View>
    </ScrollView>
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
