import React, { useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Image,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import {
  BookOpen,
  Clipboard,
  Fuel,
  Images,
  RotateCw,
  UsersRoundIcon,
  Waypoints,
  Wrench,
} from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ChangeVehicleImageModal from "@/components/trucks/ChangeVehicleThumbnail";
import { FormButton } from "@/components/Form/FormButton";
import useVehicleThumbnail from "@/hooks/truckHooks/useVehicleThumbnail";

export default function VehicleDetail() {
  const { styles } = useStyles(stylesheet);
  const { vehicles, fetchVehicles, vehiclesAreLoading } = useVehicle();
  const [activeModal, setActiveModal] = useState(false);
  
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const vehicle = vehicles?.find((Vehicle) => Vehicle.id === vehicleId);

  const {
    addPhotoToGallery,
    deletePhotoFromGallery,
    deleteThumbnail,
    selectThumbnail,
  } = useVehicleThumbnail();

  if (vehiclesAreLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <LoadingScreen caption="Cargando vehículos" />
      </>
    );
  }

  if (vehicles === null) {
    return (
      <>
        <Stack.Screen
          options={{ title: "Recurso inaccesible", headerLargeTitle: false }}
        />
        <ErrorScreen
          caption={`Ocurrió un error y no \npudimos cargar los vehículos`}
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  if (vehicles.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <EmptyScreen caption="Ningún detalle por aquí" />;
      </>
    );
  }

  if (!vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const vehicleTitle = `${vehicle.brand ?? ""} ${vehicle.sub_brand ?? ""} (${vehicle.year ?? ""})`;

  return (
    <>
      <Stack.Screen options={{ title: vehicleTitle }} />
      <ChangeVehicleImageModal
        visible={activeModal}
        closeModal={() => setActiveModal(false)}
        vehicle={vehicle}
        selectThumbnail={() => selectThumbnail(vehicleId as string)}
        addPhotoToGallery={() => addPhotoToGallery(vehicleId as string)}
        deleteThumbnail={() => deleteThumbnail(vehicleId as string)}
        deletePhotoFromGalley={() => deletePhotoFromGallery(vehicleId as string, vehicle.thumbnail as string)}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={vehiclesAreLoading}
            onRefresh={fetchVehicles}
          />
        }
      >
        <View style={styles.container}>
          <>
            <Pressable onPress={() => setActiveModal(true)}>
              {vehicle.thumbnail ? (
                <Image
                  style={styles.image}
                  source={{ uri: vehicle.thumbnail }}
                />
              ) : (
                <View style={styles.missingThumbanilContainer}>
                  <View style={styles.missingThumbanilContent}>
                    <FormButton
                      title="Seleccionar imagen"
                      onPress={() => setActiveModal(true)}
                    />
                  </View>
                </View>
              )}
            </Pressable>
          </>
          <GroupedList
            header="Consulta"
            footer="Ve distintos datos a lo largo del tiempo o actuales sobre este camión."
          >
            <Row
              title="Galeria"
              trailingType="chevron"
              icon={<Images size={24} color="white" />}
              color={colorPalette.cyan[500]}
            />
            <Row
              title="Ficha técnica"
              trailingType="chevron"
              onPress={() => router.navigate(`/vehicles/${vehicleId}/details`)}
              icon={<Clipboard size={24} color="white" />}
              color={colorPalette.emerald[500]}
            />
            <Row
              title="Guantera digital"
              trailingType="chevron"
              icon={<BookOpen size={24} color="white" />}
              color={colorPalette.orange[500]}
              onPress={() =>
                router.navigate(`/vehicles/${vehicleId}/documentation`)
              }
            />
            <Row
              title="Histórico de rutas"
              trailingType="chevron"
              icon={<Waypoints size={24} color="white" />}
              color={colorPalette.lime[500]}
            />
            <Row
              title="Histórico de cargas de gasolina"
              trailingType="chevron"
              icon={<Fuel size={24} color="white" />}
              color={colorPalette.red[500]}
              onPress={() => router.navigate(`/vehicles/${vehicleId}/gasoline`)}
            />
          </GroupedList>
          <GroupedList header="Acciones" footer="Alguna descripción.">
            <Row
              title="Administrar personas"
              trailingType="chevron"
              icon={<UsersRoundIcon size={24} color="white" />}
              color={colorPalette.sky[500]}
              onPress={() => router.navigate(`/vehicles/${vehicleId}/people`)}
            />
            <Row
              title="Registrar carga de gasolina"
              trailingType="chevron"
              icon={<Fuel size={24} color="white" />}
              color={colorPalette.red[500]}
            />
            <Row
              title="Solicitar mantenimiento"
              trailingType="chevron"
              icon={<Wrench size={24} color="white" />}
              color={colorPalette.green[500]}
            />
            <Row
              title="Actualizar datos"
              trailingType="chevron"
              icon={<RotateCw size={24} color="white" />}
              color={colorPalette.orange[500]}
              onPress={fetchVehicles}
              caption="Dev only"
            />
          </GroupedList>
          <View />
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  loadingText: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
  container: {
    flex: 1,
    gap: theme.marginsComponents.section,
  },
  loadingContainer: {
    gap: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  noVehiclesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVehiclesText: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  missingThumbanilContainer: {
    width: "100%",
    height: 250,
    backgroundColor: theme.ui.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  missingThumbanilContent: {
    flexDirection: "column",
    width: 200,
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
  button: {
    backgroundColor: "#add8e6", // Azul claro
    borderColor: "#000", // Borde negro
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    width: "100%", // Ancho completo
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Texto negro
  },
}));
