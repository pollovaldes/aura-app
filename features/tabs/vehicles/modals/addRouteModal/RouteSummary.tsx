import React, { useEffect, useState } from "react";
import { Text, View, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { VehicleThumbnail } from "@/components/vehicles/VehicleThumbnail";
import { FormButton } from "@/components/Form/FormButton";
import { Locate, Maximize2, Minimize2, Play } from "lucide-react-native";
import { useCreateRoute } from "./CreateRouteContext";
import { BackButtonOverlay } from "./BackButtonOverlay";
import useProfile from "@/hooks/useProfile";
import { useVehicles } from "@/hooks/truckHooks/useVehicle";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useLocalSearchParams } from "expo-router";
import { UniversalMap as UniversalMapNative } from "@/features/global/components/UniversalMap.native";
import { UniversalMap as UniversalMapWeb } from "@/features/global/components/UniversalMap.web";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { useAddRoute } from "@/features/routePage/hooks/useAddRoute";

export function RouteSummary() {
  const { styles } = useStyles(stylesheet);
  const { setStep, routeData, close } = useCreateRoute();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicles();
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { isLoading, error, addRoute } = useAddRoute(profile);
  const [vehicleIsLoading, setVehicleIsLoading] = useState(true);
  const [refocusTrigger, setRefocusTrigger] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);

  function handleRefocus() {
    setRefocusTrigger((prev) => prev + 1);
  }

  function handleMaximize() {
    setIsMaximized((prev) => !prev);
  }

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

  const vehicle = vehicles?.[vehicleId];

  if (vehicleIsLoading) {
    return <FetchingIndicator caption="Cargando vehículo" />;
  }

  if (!vehicles) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar los vehículos"
        buttonCaption="Reintentar"
        retryFunction={fetchVehicle}
      />
    );
  }

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
        <Text style={styles.subtitle}>Dirección de inicio: {routeData.started_address}</Text>
        <View style={{ alignSelf: "center" }}>
          <ActionButtonGroup>
            <ActionButton text="Centrar" Icon={Locate} onPress={handleRefocus} />
            <ActionButton
              text={isMaximized ? "Minimizar" : "Maximizar"}
              Icon={isMaximized ? Minimize2 : Maximize2}
              onPress={handleMaximize}
            />
          </ActionButtonGroup>
        </View>
        <View style={{ flex: 1 }}>
          {Platform.OS !== "web" ? (
            <UniversalMapNative
              latitude={routeData.started_location_latitude as number}
              longitude={routeData.started_location_longitude as number}
              refocusTrigger={refocusTrigger}
              isMaximized={isMaximized}
            />
          ) : (
            <UniversalMapWeb
              latitude={routeData.started_location_latitude as number}
              longitude={routeData.started_location_longitude as number}
              refocusTrigger={refocusTrigger}
              isMaximized={isMaximized}
            />
          )}
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
        <FormButton title="Iniciar ruta" Icon={Play} onPress={() => addRoute(close, vehicle)} isLoading={isLoading} />
      </View>
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
