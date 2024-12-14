import React, { useEffect, useState } from "react";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { View, ScrollView, Text, Switch, RefreshControl } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import {
  Info,
  SquarePen,
  Truck,
  User,
  UserCog,
  UserPlus,
} from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import ProfileColumn from "@/components/people/ProfileColumn";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import useUsers from "@/hooks/peopleHooks/useUsers";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import useProfile from "@/hooks/useProfile";
import { FormButton } from "@/components/Form/FormButton";

export default function UserDetail() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const { styles } = useStyles(stylesheet);
  const { users, usersAreLoading, fetchUsers } = useUsers();
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  // =========== SWITCHES ===========

  // Define states for each switch
  const [isAdminEnabled, setIsAdminEnabled] = useState(false);
  const [isAllPeopleEnabled, setIsAllPeopleEnabled] = useState(false);
  const [isAllVehiclesEnabled, setIsAllVehiclesEnabled] = useState(false);

  // Toggle functions for each switch
  const toggleAdminSwitch = () => setIsAdminEnabled(!isAdminEnabled);
  const toggleAllPeopleSwitch = () =>
    setIsAllPeopleEnabled(!isAllPeopleEnabled);
  const toggleAllVehiclesSwitch = () =>
    setIsAllVehiclesEnabled(!isAllVehiclesEnabled);

  // =========== SWITCHES ===========

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando perfil y permisos" />
      </>
    );
  }

  if (usersAreLoading) {
    return <LoadingScreen caption="Cargando perfil" />;
  }

  if (!users) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchUsers}
      />
    );
  }

  const user = users.find((user) => user.id === personId);

  if (!user) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchUsers}
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

  // =============== CAPTIONS ===============

  const getDescription = () => {
    switch (true) {
      case isAdminEnabled && isAllPeopleEnabled && isAllVehiclesEnabled:
        return 'Con los tres botones activos, el administrador tiene el control más amplio disponible. Puede gestionar roles administrativos, reorganizar personas entre diferentes responsables y gestionar la flota completa. Por ejemplo, puede reasignar una persona a un grupo, promoverla a administrador y asignarle un conjunto de vehículos bajo su nueva responsabilidad. Esto lo transforma en un "superadministrador" con casi las mismas capacidades que el rol "Dueño", excepto que no puede crear o eliminar otros superadministradores ni otorgar el rol de "Dueño".';
      case isAdminEnabled && isAllPeopleEnabled:
        return "Esta combinación amplía el alcance del administrador permitiéndole reasignar personas entre diferentes responsables y otorgar o revocar roles de administrador para cualquier persona en la base de datos. Por ejemplo, puede mover una persona de un grupo a otro y, además, promoverla a administrador si lo considera necesario. Esto permite una gestión integral de personas y roles dentro de toda la estructura organizativa, sin restricciones locales.";
      case isAdminEnabled && isAllVehiclesEnabled:
        return "El administrador puede otorgar y revocar roles de administrador a las personas que ya están bajo su cargo y, al mismo tiempo, gestionar todos los vehículos de la base de datos. Por ejemplo, puede asignar nuevos administradores a ciertos vehículos o reorganizar encargados de flotas sin intervención externa. Esto habilita la capacidad de reorganizar roles administrativos vinculados a la gestión de flotas.";
      case isAllPeopleEnabled && isAllVehiclesEnabled:
        return 'Permite al administrador gestionar tanto personas como vehículos. Por ejemplo, puede reasignar una persona a un grupo diferente y, además, reasignar los vehículos asociados a esa persona o grupo. Sin embargo, no puede cambiar el rol de ninguna persona a "Administrador", ya que eso requiere el permiso "Puede administrar personas". Esta combinación optimiza la capacidad de reorganización, permitiendo ajustes tanto en equipos humanos como en la logística vehicular.';
      case isAdminEnabled:
        return "El administrador puede otorgar o revocar roles de administrador, pero únicamente para las personas que ya están bajo su control. Esto significa que no puede administrar a personas que no han sido previamente asignadas a él. Por ejemplo, si una persona pertenece al grupo de otro administrador, no podrá interactuar con esa persona para asignarle o revocarle roles de administrador.";
      case isAllPeopleEnabled:
        return 'El administrador tiene acceso completo a la base de datos de personas y puede reasignarlas a diferentes administradores. Sin embargo, este privilegio no incluye la capacidad de otorgar o revocar roles de administrador, ya que esto requiere el toggle "Administra Admins". Por ejemplo, si una persona está en el estado "driver" o "no_role", el administrador puede moverla a otro grupo, pero no puede promoverla a "admin". Este privilegio permite organizar y distribuir personas entre diferentes responsables para optimizar la gestión local.';
      case isAllVehiclesEnabled:
        return 'El administrador puede acceder a todos los vehículos de la base de datos. Puede ver información relevante, como documentos asociados al vehículo, imágenes, y los encargados asignados. Además, puede reasignar vehículos a diferentes personas o grupos. No tiene acceso directo a las personas que manejan estos vehículos, a menos que tenga el toggle "Administra Personas". Este privilegio es útil para administradores que necesitan supervisar la flota completa, gestionar documentación o realizar ajustes en la asignación de vehículos.';
      default:
        return 'El administrador no tiene privilegios adicionales activados. Sus capacidades se limitan a las funciones básicas: asignar o revocar los roles de "Conductor" y "Sin rol" a las personas bajo su responsabilidad, banear a personas bajo su cargo y modificar los camiones asignados, como cambiar imágenes o documentos.';
    }
  };

  const getEditRoleState = (() => {
    // Case 1: User is viewing their own profile
    if (user.id === profile.id) {
      return {
        description: "No puedes cambiar tu propio rol",
        disabled: true,
      };
    }

    // Case 2: No one can change the role of an OWNER
    if (user.role === "OWNER") {
      return {
        description: "No puedes cambiar el rol de un propietario",
        disabled: true,
      };
    }

    // Case 3: Profile role is OWNER
    if (profile.role === "OWNER") {
      return {
        description: "",
        disabled: false,
      };
    }

    // Case 4: Admins or Owners can always edit roles for DRIVER, NO_ROLE, or BANNED
    if (
      (profile.role === "ADMIN" || profile.role === "OWNER") &&
      ["DRIVER", "NO_ROLE", "BANNED"].includes(user.role)
    ) {
      return {
        description: "",
        disabled: false,
      };
    }

    // Case 5: Profile role is ADMIN and user role is ADMIN or OWNER
    if (
      profile.role === "ADMIN" &&
      (user.role === "ADMIN" || user.role === "OWNER")
    ) {
      if (profile.can_manage_admins) {
        return {
          description: "",
          disabled: false,
        };
      }
      return {
        description:
          "No tienes permisos para cambiar el rol de otros administradores",
        disabled: true,
      };
    }

    // Default case
    return {
      description: "No puedes editar el rol en este momento",
      disabled: true,
    };
  })();

  // =============== CAPTIONS ===============

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: user.id === profile.id ? "Tú" : "",
          headerLargeTitle: false,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={isProfileLoading || usersAreLoading}
            onRefresh={() => {
              fetchProfile();
              fetchUsers();
            }}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <ProfileColumn profile={user} />
          </View>
          <GroupedList>
            <Row
              title="Información personal"
              trailingType="chevron"
              onPress={() => router.navigate(`/users/${personId}/details`)}
              icon={<Info size={24} color="white" />}
              color={colorPalette.cyan[500]}
            />
          </GroupedList>
          <GroupedList>
            <Row
              title="Rol"
              trailingType="chevron"
              showChevron={false}
              caption={(() => {
                switch (user.role) {
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
              icon={<UserCog size={24} color="white" />}
              color={colorPalette.orange[500]}
            />
            <Row
              title="Administrar personas"
              trailingType="chevron"
              icon={<UserPlus size={24} color="white" />}
              color={colorPalette.lime[500]}
            />
            {}
            <Row
              title="Puede administrar administradores"
              trailingType="chevron"
              showChevron={false}
              caption={() => {
                return (
                  <Switch
                    value={isAdminEnabled}
                    onValueChange={toggleAdminSwitch}
                  />
                );
              }}
            />
            <Row
              title="Puede administrar a todas las personas"
              trailingType="chevron"
              showChevron={false}
              caption={() => {
                return (
                  <Switch
                    value={isAllPeopleEnabled}
                    onValueChange={toggleAllPeopleSwitch}
                  />
                );
              }}
            />
            <Row
              title="Puede administrar todos los vehículos"
              trailingType="chevron"
              showChevron={false}
              caption={() => {
                return (
                  <Switch
                    value={isAllVehiclesEnabled}
                    onValueChange={toggleAllVehiclesSwitch}
                  />
                );
              }}
            />
            <Row
              trailingType="chevron"
              title=""
              onPress={() => {}}
              showChevron={false}
              disabled
            >
              <Text style={styles.permissionsDescription}>
                {getDescription()}
              </Text>
            </Row>
            <Row
              trailingType="chevron"
              title=""
              onPress={() => {}}
              showChevron={false}
              disabled
            >
              <View style={{ flexDirection: "row", flex: 1, gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <FormButton
                    title="Restablecer"
                    onPress={() => {}}
                    buttonType="danger"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormButton title="Guardar cambios" onPress={() => {}} />
                </View>
              </View>
            </Row>
          </GroupedList>
          <GroupedList header="Acciones">
            <Row
              title="Editar rol"
              trailingType="chevron"
              onPress={() => router.navigate(`/users/${personId}/changeRole`)}
              icon={<SquarePen size={24} color="white" />}
              color={colorPalette.red[500]}
              caption={getEditRoleState.description}
              disabled={getEditRoleState.disabled}
            />
            <Row
              title="Asignación de vehículos"
              trailingType="chevron"
              onPress={() => router.navigate(`/users/${personId}/assignTruck`)}
              icon={<Truck size={24} color="white" />}
              color={colorPalette.green[500]}
            />
          </GroupedList>
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginBottom: theme.marginsComponents.section,
  },
  imageContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
  },
  permissionsDescription: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
}));
