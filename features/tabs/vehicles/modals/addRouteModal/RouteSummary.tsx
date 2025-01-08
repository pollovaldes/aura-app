import React, { useEffect, useState } from "react";
import { Text, View, Alert } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import WebView from "react-native-webview";
import FormTitle from "@/app/auth/FormTitle";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { VehicleThumbnail } from "@/components/vehicles/VehicleThumbnail";
import { FormButton } from "@/components/Form/FormButton";
import { Play, Trash } from "lucide-react-native";
import { useCreateRoute } from "./CreateRouteContext";
import { BackButtonOverlay } from "./BackButtonOverlay";
import useProfile from "@/hooks/useProfile";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { formatDate } from "@/features/global/functions/formatDate";
import { useLocalSearchParams } from "expo-router";
import Modal from "@/components/Modal/Modal";
import { AddMaintenanceModal } from "../AddMaintenanceModal";

type ModalType = "create_maintenance_record" | null;

export function RouteSummary() {
  const { styles } = useStyles(stylesheet);
  const { setStep, setField, routeData } = useCreateRoute();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicle();
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [vehicleIsLoading, setVehicleIsLoading] = useState(true);

  const fetchVehicle = async () => {
    setVehicleIsLoading(true);
    try {
      await fetchVehicleById(vehicleId);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      throw error;
    } finally {
      setVehicleIsLoading(false);
    }
  };

  const refetchVehicle = async () => {
    setVehicleIsLoading(true);
    try {
      await refetchVehicleById(vehicleId);
    } catch (error) {
      console.error("Error refetching vehicle:", error);
      throw error;
    } finally {
      setVehicleIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const zoomFactor = routeData.started_location_latitude && routeData.started_location_longitude ? 0.01 / 15 : 180;
  const mapUrl =
    routeData.started_location_latitude && routeData.started_location_longitude
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${routeData.started_location_longitude - zoomFactor}%2C${routeData.started_location_latitude - zoomFactor}%2C${routeData.started_location_longitude + zoomFactor}%2C${routeData.started_location_latitude + zoomFactor}&layer=carto-dark&marker=${routeData.started_location_latitude}%2C${routeData.started_location_longitude}`
      : `https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-90%2C180%2C90&layer=carto-dark`;

  const vehicle = vehicles?.[vehicleId];

  // Handle Loading State
  if (vehicleIsLoading) {
    return <FetchingIndicator caption="Cargando vehículo" />;
  }

  // Handle Error State for Vehicles
  if (!vehicles) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar los vehículos"
        buttonCaption="Reintentar"
        retryFunction={fetchVehicle}
      />
    );
  }

  // Handle Unauthorized Access
  if (!vehicle) {
    return (
      <>
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={refetchVehicle}
        />
      </>
    );
  }

  return (
    <View style={styles.section}>
      <BackButtonOverlay back={() => setStep(2)} />
      <View style={styles.group}>
        <FormTitle title="Resumen de la ruta" />
        <Text style={styles.subtitle}>Revisa los detalles de la ruta antes de proseguir.</Text>
      </View>
      <View style={styles.group}>
        <Text style={styles.subtitle}>Nombre de la ruta: {routeData.title}</Text>
        <Text style={styles.subtitle}>Descripción de la ruta: {routeData.description}</Text>
        <Text style={styles.subtitle}>
          Quién hará la ruta: {`${profile.name} ${profile.father_last_name} ${profile.mother_last_name}`}
        </Text>
        <Text style={styles.subtitle}>Dirección de inicio: {routeData.started_adrees}</Text>
        <View style={styles.webviewContainer}>
          <WebView
            source={{ uri: mapUrl }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
          />
          <View style={styles.overlay} />
        </View>
        <View>
          {vehicle && vehicleId ? (
            <SimpleList
              relativeToDirectory
              leading={<VehicleThumbnail vehicleId={vehicleId} />}
              content={
                <>
                  <Text style={styles.itemTitle}>
                    {`${vehicle.brand ?? "N/A"} ${vehicle.sub_brand ?? "N/A"} (${vehicle.year ?? "N/A"})`}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {`Placa: ${vehicle.plate ?? "N/A"}\nNúmero económico: ${
                      vehicle.economic_number ?? "N/A"
                    }\nNúmero de serie: ${vehicle.serial_number ?? "N/A"}`}
                  </Text>
                </>
              }
              hideChevron
            />
          ) : (
            <SimpleList
              relativeToDirectory
              content={
                <>
                  <Text style={styles.itemTitle}>No se ha podido mostrar el vehículo para esta ruta.</Text>
                  <Text style={styles.itemDetails}>Por favor selecciona un vehículo.</Text>
                </>
              }
              hideChevron
            />
          )}
        </View>
      </View>
      <View style={styles.group}>
        <FormButton
          title="Iniciar ruta"
          Icon={Play}
          onPress={() => {
            /* Implement iniciar ruta functionality */
          }}
        />
      </View>

      {/* Modal for Adding Maintenance Record */}
      <Modal isOpen={activeModal === "create_maintenance_record"} close={() => setActiveModal(null)}>
        <AddMaintenanceModal
          closeModal={() => setActiveModal(null)}
          fetchMaintenance={fetchVehicle} // Assuming fetchVehicle fetches necessary data
          vehicle={vehicle}
          profile={profile}
        />
      </Modal>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    paddingHorizontal: 16,
    flex: 1,
  },
  group: {
    gap: theme.marginsComponents.group,
    marginTop: theme.marginsComponents.group,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    textAlign: "center",
    fontSize: 16,
    marginVertical: 4,
  },
  webviewContainer: {
    height: 320,
    overflow: "hidden",
    borderRadius: 8,
    position: "relative",
    marginTop: 10,
  },
  webview: {
    height: 300,
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: theme.textPresets.main,
  },
  itemDetails: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
    marginTop: 4,
  },
}));
