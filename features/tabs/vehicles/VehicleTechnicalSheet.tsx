import { View, ScrollView, RefreshControl } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import ChangeDataModal from "@/components/Modal/ChangeDataModal";
import useProfile from "@/hooks/useProfile";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import React from "react";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";

export default function VehicleTechnicalSheet() {
  const { styles } = useStyles(stylesheet);
  const [numEco, setNumEco] = useState(false);
  const [marca, setMarca] = useState(false);
  const [subMarca, setSubMarca] = useState(false);
  const [modelo, setModelo] = useState(false);
  const [noSerie, setNoSerie] = useState(false);
  const [placa, setPlaca] = useState(false);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      presentation: undefined,
    });
  }, []);

  if (vehiclesAreLoading) {
    return <FetchingIndicator caption={"Cargando vehículos"} />;
  }

  if (!vehicles) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar los vehículos"
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
    );
  }

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);

  if (!vehicle) {
    return (
      <UnauthorizedScreen
        caption="No tienes acceso a este recurso."
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
    );
  }

  const isChevronVisible = !(profile.role === "ADMIN" || profile.role === "OWNER");

  return (
    vehicle && (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={vehiclesAreLoading} onRefresh={fetchVehicles} />}
      >
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" || profile.role === "OWNER" ? numEco : false}
          currentDataType="Numero Económico"
          currentData={vehicle.economic_number}
          closeModal={() => setNumEco(false)}
          dataChange="numero_economico"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" || profile.role === "OWNER" ? marca : false}
          currentDataType="Marca"
          currentData={vehicle.brand}
          closeModal={() => setMarca(false)}
          dataChange="marca"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" || profile.role === "OWNER" ? subMarca : false}
          currentDataType="Submarca"
          currentData={vehicle.sub_brand}
          closeModal={() => setSubMarca(false)}
          dataChange="sub_marca"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" || profile.role === "OWNER" ? modelo : false}
          currentDataType="Modelo"
          currentData={vehicle.year}
          closeModal={() => setModelo(false)}
          dataChange="modelo"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" || profile.role === "OWNER" ? noSerie : false}
          currentDataType="No. de serie"
          currentData={vehicle.serial_number}
          closeModal={() => setNoSerie(false)}
          dataChange="no_serie"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" || profile.role === "OWNER" ? placa : false}
          currentDataType="No. de placa"
          currentData={vehicle.plate}
          closeModal={() => setPlaca(false)}
          dataChange="placa"
          id={vehicle.id}
        />

        <View style={styles.container}>
          <Stack.Screen options={{ title: "Ficha técnica", headerLargeTitle: true }} />
          <GroupedList
            header="Detalles"
            footer="Contacta a tu administrador para más información o a tu supervisor para reportar errores. Solo los administradores pueden editar la información del camión."
          >
            <Row
              title="Numero Económico"
              onPress={() => setNumEco(true)}
              caption={`${vehicle.economic_number}`}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Marca"
              onPress={() => setMarca(true)}
              caption={`${vehicle.brand}`}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Submarca"
              onPress={() => setSubMarca(true)}
              caption={`${vehicle.sub_brand}`}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Año"
              onPress={() => setModelo(true)}
              caption={`${vehicle.year}`}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Número de serie"
              onPress={() => setNoSerie(true)}
              caption={`${vehicle.serial_number}`}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Número de placa"
              onPress={() => setPlaca(true)}
              caption={`${vehicle.plate}`}
              hideChevron={isChevronVisible}
            />
          </GroupedList>
        </View>
      </ScrollView>
    )
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
}));
