import { View, ScrollView, Alert, RefreshControl } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import ChangeDataModal from "@/components/Modal/ChangeDataModal";
import { FormButton } from "@/components/Form/FormButton";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useProfile from "@/hooks/useProfile";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import React from "react";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const [numEco, setNumEco] = useState(false);
  const [marca, setMarca] = useState(false);
  const [subMarca, setSubMarca] = useState(false);
  const [modelo, setModelo] = useState(false);
  const [noSerie, setNoSerie] = useState(false);
  const [placa, setPlaca] = useState(false);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      presentation: undefined,
    });
  }, []);

  if (vehiclesAreLoading) {
    return (
      <>
        <LoadingScreen caption="Cargando vehículos" />
        <Stack.Screen
          options={{ title: "Cargando...", headerLargeTitle: false }}
        />
      </>
    );
  }

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <LoadingScreen caption="Cargando perfil y permisos" />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen options={{ title: "Error", headerLargeTitle: false }} />
        <ErrorScreen
          caption="Ocurrió un error al cargar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (!vehicles) {
    return (
      <>
        <Stack.Screen options={{ title: "Error", headerLargeTitle: false }} />
        <ErrorScreen
          caption="Ocurrió un error al cargar los vehículos"
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
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  return (
    vehicle && (
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
        <ChangeDataModal
          isOpen={
            profile.role === "ADMIN" || profile.role === "OWNER"
              ? numEco
              : false
          }
          currentDataType="Numero Económico"
          currentData={vehicle.economic_number}
          closeModal={() => setNumEco(false)}
          dataChange="numero_economico"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={
            profile.role === "ADMIN" || profile.role === "OWNER" ? marca : false
          }
          currentDataType="Marca"
          currentData={vehicle.brand}
          closeModal={() => setMarca(false)}
          dataChange="marca"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={
            profile.role === "ADMIN" || profile.role === "OWNER"
              ? subMarca
              : false
          }
          currentDataType="Submarca"
          currentData={vehicle.sub_brand}
          closeModal={() => setSubMarca(false)}
          dataChange="sub_marca"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={
            profile.role === "ADMIN" || profile.role === "OWNER"
              ? modelo
              : false
          }
          currentDataType="Modelo"
          currentData={vehicle.year}
          closeModal={() => setModelo(false)}
          dataChange="modelo"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={
            profile.role === "ADMIN" || profile.role === "OWNER"
              ? noSerie
              : false
          }
          currentDataType="No. de serie"
          currentData={vehicle.serial_number}
          closeModal={() => setNoSerie(false)}
          dataChange="no_serie"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={
            profile.role === "ADMIN" || profile.role === "OWNER" ? placa : false
          }
          currentDataType="No. de placa"
          currentData={vehicle.plate}
          closeModal={() => setPlaca(false)}
          dataChange="placa"
          id={vehicle.id}
        />

        <View style={styles.container}>
          <Stack.Screen
            options={{ title: "Ficha técnica", headerLargeTitle: true }}
          />
          <GroupedList
            header="Detalles"
            footer="Contacta a tu administrador para más información o a tu supervisor para reportar errores. Solo los administradores pueden editar la información del camión."
          >
            <Row
              title="Numero Económico"
              onPress={() => setNumEco(true)}
              trailingType="chevron"
              caption={`${vehicle.economic_number}`}
              showChevron={profile.role === "ADMIN" || profile.role === "OWNER"}
            />
            <Row
              title="Marca"
              onPress={() => setMarca(true)}
              trailingType="chevron"
              caption={`${vehicle.brand}`}
              showChevron={profile.role === "ADMIN" || profile.role === "OWNER"}
            />
            <Row
              title="Submarca"
              onPress={() => setSubMarca(true)}
              trailingType="chevron"
              caption={`${vehicle.sub_brand}`}
              showChevron={profile.role === "ADMIN" || profile.role === "OWNER"}
            />
            <Row
              title="Año"
              onPress={() => setModelo(true)}
              trailingType="chevron"
              caption={`${vehicle.year}`}
              showChevron={profile.role === "ADMIN" || profile.role === "OWNER"}
            />
            <Row
              title="Número de serie"
              onPress={() => setNoSerie(true)}
              trailingType="chevron"
              caption={`${vehicle.serial_number}`}
              showChevron={profile.role === "ADMIN" || profile.role === "OWNER"}
            />
            <Row
              title="Número de placa"
              onPress={() => setPlaca(true)}
              trailingType="chevron"
              caption={`${vehicle.plate}`}
              showChevron={profile.role === "ADMIN" || profile.role === "OWNER"}
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
