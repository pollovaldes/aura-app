import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { supabase } from "@/lib/supabase";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { router, Stack, useNavigation } from "expo-router";
import React from "react";
import { LockKeyhole, Trash } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";

export default function ProfileAccountPassword() {
  const { styles } = useStyles(stylesheet);
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const navigation = useNavigation();

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

  const confirmUnlinking = ConfirmDialog({
    title: "Confirmación",
    message: "¿Estás seguro de que deseas desvincular tu correo electrónico de tu cuenta?",
    cancelText: "Cancelar",
    confirmText: "Desvincular",
    confirmStyle: "destructive",
    onConfirm: async () => {
      alert("Desvinculando correo electrónico");
    },
    onCancel: () => {},
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Acciones para correo electrónico",
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
            <Row title="Correo electrónico actual" hideChevron />
            <Row title="Correo electrónico actual" hideChevron>
              <Text style={styles.description}>{session.user.email}</Text>
            </Row>
          </GroupedList>
          <GroupedList>
            <Row title="Correo electrónico nuevo" hideChevron />
            <Row title="Correo electrónico actual" hideChevron>
              <View style={{ gap: 16 }}>
                <FormInput description="Nuevo correo" />
                <FormButton title="Cambiar correo" onPress={() => {}} />
              </View>
            </Row>
          </GroupedList>
          <GroupedList>
            <Row
              title="Cambiar contraseña"
              icon={LockKeyhole}
              backgroundColor={colorPalette.cyan[500]}
              onPress={() => router.replace("../../password", { relativeToDirectory: true })}
            />
            <Row
              title="Desvincular correo electrónico"
              icon={Trash}
              backgroundColor={colorPalette.red[500]}
              onPress={confirmUnlinking.showDialog}
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
