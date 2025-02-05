import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { supabase } from "@/lib/supabase";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { router, Stack } from "expo-router";
import React from "react";
import { Check, Info, X } from "lucide-react-native";
import { colorPalette } from "@/style/themes";

export default function ProfileAccountIdentities() {
  const { styles } = useStyles(stylesheet);
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  if (isProfileLoading || isSessionLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <FetchingIndicator caption={isProfileLoading ? "Cargando perfil" : "Cargando sesión"} />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu sesión"
          buttonCaption="Intentar cerrar sesión"
          retryFunction={() => supabase.auth.signOut({ scope: "local" })}
        />
      </>
    );
  }

  const identities = session.user.identities;

  if (!identities) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tus identidades"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Identidades",
          headerLargeTitle: false,
          headerRight: undefined,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={isProfileLoading} onRefresh={fetchProfile} />}
      >
        <View style={styles.container}>
          <GroupedList>
            <Row title="¿Qué es una identidad?" icon={Info} backgroundColor={colorPalette.cyan[500]} hideChevron />

            <Row>
              <Text style={styles.description}>
                Una identidad es cualquier método que un usuario utiliza para acceder a su cuenta, como una cuenta de
                Google, Apple, un número de celular o un correo electrónico con contraseña. Todas las identidades
                asociadas al mismo correo electrónico representan al mismo usuario dentro de la aplicación.
              </Text>
            </Row>
          </GroupedList>
          <GroupedList
            header="Identidades vinculadas"
            footer="Podrás iniciar sesión con cualquiera de las identidades vinculadas a tu cuenta"
          >
            <Row
              title="Correo electrónico"
              caption={identities.find((i) => i.provider === "email") ? "Vinculada" : "No vinculada"}
              onPress={() => router.push("./email", { relativeToDirectory: true })}
              icon={identities.find((i) => i.provider === "email") ? Check : X}
              backgroundColor={
                identities.find((i) => i.provider === "email") ? colorPalette.green[500] : colorPalette.red[500]
              }
            />
            <Row
              title="Google"
              caption={identities.find((i) => i.provider === "google") ? "Vinculada" : "No vinculada"}
              icon={identities.find((i) => i.provider === "google") ? Check : X}
              backgroundColor={
                identities.find((i) => i.provider === "google") ? colorPalette.green[500] : colorPalette.red[500]
              }
            />
            <Row
              title="Apple"
              caption={identities.find((i) => i.provider === "apple") ? "Vinculada" : "No vinculada"}
              icon={identities.find((i) => i.provider === "apple") ? Check : X}
              backgroundColor={
                identities.find((i) => i.provider === "apple") ? colorPalette.green[500] : colorPalette.red[500]
              }
            />
            <Row
              title="Número de celular"
              caption={identities.find((i) => i.provider === "phone") ? "Vinculada" : "No vinculada"}
              icon={identities.find((i) => i.provider === "phone") ? Check : X}
              backgroundColor={
                identities.find((i) => i.provider === "phone") ? colorPalette.green[500] : colorPalette.red[500]
              }
            />
          </GroupedList>
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
  description: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
}));
