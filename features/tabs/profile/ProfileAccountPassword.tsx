import { supabase } from "@/lib/supabase";
import { RefreshControl, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");

  useEffect(() => {
    if (!isSessionLoading && session) {
      if (!session.user.email) {
        router.back();
        alert(
          "No se puede cambiar la contraseña ya que no tienes un correo electrónico asociado a tu cuenta.",
        );
      }
    }
  }, [isSessionLoading, session]);

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

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cambio de contraseña",
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
          <FormInput
            description="Contraseña actual"
            enterKeyHint="done"
            autoComplete="current-password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <FormInput
            description="Nueva contraseña"
            enterKeyHint="done"
            autoComplete="current-password"
            secureTextEntry={true}
            onChangeText={setNewPassword}
          />
          <FormInput
            description="Repite la contraseña"
            enterKeyHint="done"
            autoComplete="current-password"
            secureTextEntry={true}
            onChangeText={setRepeatPassword}
          />
          <FormButton
            title="Cambiar contraseña"
            onPress={() => {}}
            isDisabled={
              newPassword !== repeatPassword || !newPassword || !password
            }
          />
          <View />
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.group,
    marginTop: theme.marginsComponents.group,
    padding: 16,
  },
}));
