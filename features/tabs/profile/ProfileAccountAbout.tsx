import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { supabase } from "@/lib/supabase";
import { RefreshControl, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { Stack } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";

export default function ProfileAccountAbout() {
  const { styles } = useStyles(stylesheet);
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { getGuaranteedProfile, fetchProfile } = useProfile();
  const profile = getGuaranteedProfile();

  const showToast = (title: string, caption: string) => {
    Toast.show({
      type: "alert",
      text1: title,
      text2: caption,
    });
  };

  if (isSessionLoading) {
    return <FetchingIndicator caption={"Cargando sesión"} />;
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
        refreshControl={<RefreshControl refreshing={isSessionLoading} onRefresh={fetchProfile} />}
      >
        <View style={styles.container}>
          <GroupedList header="Información de la cuenta">
            <Row
              title="ID de usuario"
              caption={session.user.id}
              hideChevron
              onPress={async () => {
                showToast("Elemento copiado", "Se copió ID de usuario al portapapeles");
                await Clipboard.setStringAsync(session.user.id);
              }}
            />
            <Row
              title="Correo electrónico"
              hideChevron
              caption={session.user.email ? session.user.email : "No se proveyó ningún correo electrónico"}
              onPress={async () => {
                if (session.user.email) {
                  showToast("Elemento copiado", "Se copió correo electrónico al portapapeles");
                  await Clipboard.setStringAsync(session.user.email);
                }
              }}
            />
            <Row
              title="Número de celular"
              hideChevron
              caption={session.user.phone ? session.user.phone : "Sin registro"}
              onPress={async () => {
                if (session.user.phone) {
                  showToast("Elemento copiado", "Se copió número de celular al portapapeles");
                  await Clipboard.setStringAsync(session.user.phone);
                }
              }}
            />
            <Row
              title="Fecha y hora de creación"
              hideChevron
              caption={formatDate(session.user.created_at)}
              onPress={async () => {
                showToast("Elemento copiado", "Se copió fecha y hora de creación al portapapeles");
                await Clipboard.setStringAsync(formatDate(session.user.created_at));
              }}
            />
            <Row
              title="Rol"
              hideChevron
              caption={session.user.role ? session.user.role : "Sin asignar"}
              onPress={async () => {
                if (session.user.role) {
                  showToast("Elemento copiado", "Se copió rol al portapapeles");
                  await Clipboard.setStringAsync(session.user.role);
                }
              }}
            />
          </GroupedList>

          <GroupedList header="Estado de confirmación">
            <Row
              title="Correo confirmado"
              hideChevron
              caption={session.user.email_confirmed_at ? formatDate(session.user.email_confirmed_at) : "No confirmado"}
              onPress={async () => {
                if (session.user.email_confirmed_at) {
                  showToast("Elemento copiado", "Se copió fecha de confirmación de correo al portapapeles");
                  await Clipboard.setStringAsync(formatDate(session.user.email_confirmed_at));
                }
              }}
            />
            <Row
              title="Teléfono confirmado"
              hideChevron
              caption={session.user.phone_confirmed_at ? formatDate(session.user.phone_confirmed_at) : "No confirmado"}
              onPress={async () => {
                if (session.user.phone_confirmed_at) {
                  showToast("Elemento copiado", "Se copió fecha de confirmación de teléfono al portapapeles");
                  await Clipboard.setStringAsync(formatDate(session.user.phone_confirmed_at));
                }
              }}
            />
            <Row
              title="Cuenta confirmada"
              hideChevron
              caption={session.user.confirmed_at ? formatDate(session.user.confirmed_at) : "No confirmada"}
              onPress={async () => {
                if (session.user.confirmed_at) {
                  showToast("Elemento copiado", "Se copió fecha de confirmación de cuenta al portapapeles");
                  await Clipboard.setStringAsync(formatDate(session.user.confirmed_at));
                }
              }}
            />
          </GroupedList>

          <GroupedList header="Historial de acceso">
            <Row
              title="Último inicio de sesión"
              hideChevron
              caption={session.user.last_sign_in_at ? formatDate(session.user.last_sign_in_at) : "No registrado"}
              onPress={async () => {
                if (session.user.last_sign_in_at) {
                  showToast("Elemento copiado", "Se copió último inicio de sesión al portapapeles");
                  await Clipboard.setStringAsync(formatDate(session.user.last_sign_in_at));
                }
              }}
            />
            <Row
              title="Última actualización de cuenta"
              hideChevron
              caption={session.user.updated_at ? formatDate(session.user.updated_at) : "Sin registro"}
              onPress={async () => {
                if (session.user.updated_at) {
                  showToast("Elemento copiado", "Se copió última actualización de cuenta al portapapeles");
                  await Clipboard.setStringAsync(formatDate(session.user.updated_at));
                }
              }}
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
