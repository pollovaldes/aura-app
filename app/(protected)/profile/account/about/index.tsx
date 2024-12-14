import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { supabase } from "@/lib/supabase";
import { RefreshControl, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { Stack, useNavigation } from "expo-router";
import React, { useEffect } from "react";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
    });
  }, []);

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
        <FetchingIndicator
          caption={isProfileLoading ? "Cargando perfil" : "Cargando sesión"}
        />
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

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("es", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} de ${month} del ${year} a las ${hours}:${minutes} horas`;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Información de la cuenta",
          headerLargeTitle: false,
          headerRight: undefined,
        }}
      />
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
          <GroupedList header="Información de la cuenta">
            <Row
              title="ID de usuario"
              trailingType="chevron"
              caption={session.user.id}
              pressedStyle={false}
              showChevron={false}
            />
            <Row
              title="Correo electrónico"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={
                session.user.email
                  ? session.user.email
                  : "No se proveyó ningún correo electrónico"
              }
            />
            <Row
              title="Número de celular"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={session.user.phone ? session.user.phone : "Sin registro"}
            />
            <Row
              title="Fecha y hora de creación"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={formatDate(session.user.created_at)}
            />
            <Row
              title="Rol"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={session.user.role ? session.user.role : "Sin asignar"}
            />
          </GroupedList>

          <GroupedList header="Estado de confirmación">
            <Row
              title="Correo confirmado"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={
                session.user.email_confirmed_at
                  ? formatDate(session.user.email_confirmed_at)
                  : "No confirmado"
              }
            />
            <Row
              title="Teléfono confirmado"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={
                session.user.phone_confirmed_at
                  ? formatDate(session.user.phone_confirmed_at)
                  : "No confirmado"
              }
            />
            <Row
              title="Cuenta confirmada"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={
                session.user.confirmed_at
                  ? formatDate(session.user.confirmed_at)
                  : "No confirmada"
              }
            />
          </GroupedList>

          <GroupedList header="Historial de acceso">
            <Row
              title="Último inicio de sesión"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={
                session.user.last_sign_in_at
                  ? formatDate(session.user.last_sign_in_at)
                  : "No registrado"
              }
            />
            <Row
              title="Última actualización de cuenta"
              trailingType="chevron"
              pressedStyle={false}
              showChevron={false}
              caption={
                session.user.updated_at
                  ? formatDate(session.user.updated_at)
                  : "Sin registro"
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
}));
