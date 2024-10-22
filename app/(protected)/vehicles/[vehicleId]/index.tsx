import React, { useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Image,
  ScrollView,
  RefreshControl,
  Pressable,
  Text,
  Platform,
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
  Trash,
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
import useVehicleThumbnail from "@/hooks/truckHooks/useVehicleThumbnail";
import useProfile from "@/hooks/useProfile";
import Modal from "@/components/Modal/Modal";
import ChangeCoverImage from "@/components/vehicles/modals/ChangeCoverImage";

type ModalType = "change_cover_image" | null;

export default function VehicleDetail() {
  const { styles } = useStyles(stylesheet);
  const { vehicles, fetchVehicles, vehiclesAreLoading } = useVehicle();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  const { deleteThumbnail, selectThumbnail } = useVehicleThumbnail();

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

  if (vehicles.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <EmptyScreen caption="Ningún detalle por aquí" />;
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

  const vehicleTitle = `${vehicle.brand ?? ""} ${vehicle.sub_brand ?? ""} (${vehicle.year ?? ""})`;
  const canEditVehicle = profile.role === "ADMIN" || profile.role === "OWNER";

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerLargeTitle: false,
          headerRight: () =>
            canEditVehicle && (
              <Pressable onPress={() => setActiveModal("change_cover_image")}>
                <Text style={styles.rightPressText}>Cambiar portada</Text>
              </Pressable>
            ),
        }}
      />
      <Modal isOpen={activeModal === "change_cover_image"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <ChangeCoverImage
            closeModal={closeModal}
            vehicle={vehicle}
            selectThumbnail={selectThumbnail}
            deleteThumbnail={deleteThumbnail}
          />
        </View>
      </Modal>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={vehiclesAreLoading || isProfileLoading}
            onRefresh={() => {
              fetchVehicles();
              fetchProfile();
            }}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            {vehicle.thumbnail ? (
              <Image style={styles.image} source={{ uri: vehicle.thumbnail }} />
            ) : (
              <View style={styles.missingThumbanilContainer}>
                <View style={styles.missingThumbanilContent}>
                  <Text style={styles.noImageText}>Sin imagen</Text>
                </View>
              </View>
            )}
            <Text style={styles.title}>{vehicleTitle}</Text>
          </View>
          <View style={styles.groupedListsContainer}>
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
                onPress={() =>
                  router.navigate(`/vehicles/${vehicleId}/technical_sheet`)
                }
                icon={<Clipboard size={24} color="white" />}
                color={colorPalette.green[500]}
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
                title="Histórico de cargas de gasolina"
                trailingType="chevron"
                icon={<Fuel size={24} color="white" />}
                color={colorPalette.red[500]}
                onPress={() =>
                  router.navigate(`/vehicles/${vehicleId}/gasoline`)
                }
              />
              <Row
                title="Histórico de rutas"
                trailingType="chevron"
                icon={<Waypoints size={24} color="white" />}
                color={colorPalette.sky[500]}
              />
            </GroupedList>
            <GroupedList header="Acciones" footer="Alguna descripción.">
              {canEditVehicle && (
                <Row
                  title="Administrar personas"
                  trailingType="chevron"
                  icon={<UsersRoundIcon size={24} color="white" />}
                  color={colorPalette.lime[500]}
                  onPress={() =>
                    router.navigate(`/vehicles/${vehicleId}/people`)
                  }
                />
              )}
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
            <GroupedList header="Zona de peligro">
              <Row
                title="Borrar vehículo"
                trailingType="chevron"
                icon={<Trash size={24} color="white" />}
                color={colorPalette.red[500]}
                onPress={() => router.navigate(`/vehicles/${vehicleId}/people`)}
              />
            </GroupedList>
          </View>
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
  noImageText: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
  rightPressText: {
    color: theme.ui.colors.primary,
    fontSize: 17,
  },
  container: {
    flex: 1,
    gap: theme.marginsComponents.section,
    flexDirection: Platform.OS === "web" ? "row" : undefined,
    marginTop: Platform.OS === "web" ? 16 : undefined,
  },
  groupedListsContainer: {
    flex: 2,
    gap: theme.marginsComponents.section,
  },
  imageContainer: {
    flex: 1,
    aspectRatio: 16 / 9,
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
    marginTop: 6,
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 16,
    marginRight: 100,
    color: theme.textPresets.main,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
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
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
}));
