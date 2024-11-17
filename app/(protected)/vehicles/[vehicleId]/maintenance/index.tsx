import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useMaintenance from "@/hooks/useMaintenance";
import useProfile from "@/hooks/useProfile";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Index() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { styles } = useStyles(stylesheet);
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance } =
    useMaintenance();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

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

  if (areMaintenanceRecordsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando solicitudes de mantenimiento" />
      </>
    );
  }

  if (vehiclesAreLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando vehículos" />
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

  if (vehicles === null) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption={`Ocurrió un error y no \npudimos cargar los vehículos`}
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);

  if (!vehicle) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerRight: undefined,
            headerLargeTitle: false,
            headerTitle: undefined,
          }}
        />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  if (!maintenanceRecords) {
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
          caption={`Ocurrió un error y no \npudimos cargar las solicitudes de mantenimiento`}
          buttonCaption="Reintentar"
          retryFunction={fetchMaintenance}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Solicitudes de mantenimiento",
          headerRight: undefined,
          headerLargeTitle: false,
          headerTitle: () => (
            <View>
              <SegmentedControl
                values={["Pendientes", "En revisión", "Resuletas"]}
                selectedIndex={currentTabIndex}
                onChange={(event) => {
                  setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex);
                }}
                style={styles.segmentedControl}
              />
            </View>
          ),
        }}
      />

      <FlatList
        refreshing={
          vehiclesAreLoading || areMaintenanceRecordsLoading || isProfileLoading
        }
        onRefresh={() => {
          fetchVehicles();
          fetchProfile();
          fetchMaintenance();
        }}
        contentInsetAdjustmentBehavior="automatic"
        data={maintenanceRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/vehicles/${item.id}` }} asChild>
            <Pressable>
              <View style={styles.container}>
                <View style={styles.contentContainer}>
                  <Text>{item.description}</Text>
                </View>
                <View style={styles.chevronView}>
                  <ChevronRight color={styles.chevron.color} />
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  segmentedControl: {
    width: 350,
  },
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    padding: 12,
  },
  image: {
    borderRadius: 6,
    width: 100,
    height: 100,
  },
  noImageIcon: {
    color: theme.textPresets.main,
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
  plusIcon: {
    fontSize: 16,
    color: theme.headerButtons.color,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
}));
