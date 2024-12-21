import { RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { router, Stack } from "expo-router";
import React from "react";
import Row from "@/components/grouped-list/Row";
import { UserRoundPen } from "lucide-react-native";
import GroupedList from "@/components/grouped-list/GroupedList";
import { colorPalette } from "@/style/themes";

export default function ProfileRole() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  if (isProfileLoading) {
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

  const getRoleLabel = (role: string) => {
    switch (role) {
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
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Eres un administrador, lo que significa que puedes gestionar usuarios, configuraciones y modificar datos.";
      case "DRIVER":
        return "Eres un conductor, puedes ver los camiones que tu supervisor te haya asignado, consultar información sobre ellos, y hacer peticiones sobre viajes, cargas de combustibles, etc.";
      case "BANNED":
        return "Estás bloqueado, no puedes acceder a la aplicación.";
      case "NO_ROLE":
        return "No tienes un rol asignado, contacta a soporte.";
      case "OWNER":
        return "Eres el dueño de la aplicación, puedes gestionar todo.";
      default:
        return "Tu rol no está definido, contacta a soporte.";
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Rol",
          headerLargeTitle: true,
          headerRight: undefined,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={isProfileLoading} onRefresh={fetchProfile} />}
      >
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <Text style={styles.text}>{getRoleLabel(profile.role)}</Text>
            <Text style={styles.subtitle}>{getRoleDescription(profile.role)}</Text>
          </View>
          <GroupedList>
            <Row
              title="Cambio de rol"
              icon={UserRoundPen}
              backgroundColor={colorPalette.cyan[500]}
              onPress={() => router.push("./change", { relativeToDirectory: true })}
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
  dateContainer: {
    marginHorizontal: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    borderRadius: 5,
    backgroundColor: theme.textInput.backgroundColor,
    padding: 12,
  },
  text: {
    color: theme.textPresets.main,
    fontSize: 25,
    fontWeight: "bold",
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    fontSize: 18,
    textAlign: "center",
  },
}));
