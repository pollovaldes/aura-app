import { View, ScrollView, Alert, RefreshControl } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
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

export default function Index() {
  const { styles } = useStyles(stylesheet);

  const [numEco, setNumEco] = useState(false);
  const [marca, setMarca] = useState(false);
  const [subMarca, setSubMarca] = useState(false);
  const [modelo, setModelo] = useState(false);
  const [noSerie, setNoSerie] = useState(false);
  const [placa, setPlaca] = useState(false);
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle(); // Usa el hook
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

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

  if (vehiclesAreLoading) {
    <>
      <LoadingScreen caption="Cargando vehículos" />
      <Stack.Screen
        options={{ title: "Cargando...", headerLargeTitle: false }}
      />
    </>;
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
        <Stack.Screen options={{ title: "Error", headerLargeTitle: false }} />
        <EmptyScreen caption="No se encuentra la ficha técnica de este vehículo" />
      </>
    );
  }

  return (
    vehicle && (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={vehiclesAreLoading}
            onRefresh={fetchVehicles}
          />
        }
      >
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" ? numEco : false}
          currentDataType="Numero Economico"
          currentData={vehicle.economic_number}
          closeModal={() => setNumEco(false)}
          dataChange="numero_economico"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" ? marca : false}
          currentDataType="Marca"
          currentData={vehicle.brand}
          closeModal={() => setMarca(false)}
          dataChange="marca"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" ? subMarca : false}
          currentDataType="Sub Marca"
          currentData={vehicle.sub_brand}
          closeModal={() => setSubMarca(false)}
          dataChange="sub_marca"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" ? modelo : false}
          currentDataType="Modelo"
          currentData={vehicle.year}
          closeModal={() => setModelo(false)}
          dataChange="modelo"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" ? noSerie : false}
          currentDataType="No de Serie"
          currentData={vehicle.serial_number}
          closeModal={() => setNoSerie(false)}
          dataChange="no_serie"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={profile.role === "ADMIN" ? placa : false}
          currentDataType="Placa"
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
            footer="Si necesitas más información, contacta a tu administrador y si ves algún error contacta a tu supervisor, solo los administradores pueden editar la información del camión."
          >
            <Row
              title="Numero Economico"
              onPress={() => setNumEco(true)}
              trailingType="chevron"
              caption={`${vehicle.economic_number}`}
              showChevron={profile.role === "ADMIN"}
            />
            <Row
              title="Marca"
              onPress={() => setMarca(true)}
              trailingType="chevron"
              caption={`${vehicle.brand}`}
              showChevron={profile.role === "ADMIN"}
            />
            <Row
              title="Sub Marca"
              onPress={() => setSubMarca(true)}
              trailingType="chevron"
              caption={`${vehicle.sub_brand}`}
              showChevron={profile.role === "ADMIN"}
            />
            <Row
              title="Modelo"
              onPress={() => setModelo(true)}
              trailingType="chevron"
              caption={`${vehicle.year}`}
              showChevron={profile.role === "ADMIN"}
            />
            <Row
              title="No de Serie"
              onPress={() => setNoSerie(true)}
              trailingType="chevron"
              caption={`${vehicle.serial_number?.substring(0, 8) ?? "No disponible"}${vehicle.serial_number && vehicle.serial_number.length > 8 ? "..." : ""}`}
              showChevron={profile.role === "ADMIN"}
            />
            <Row
              title="Placa"
              onPress={() => setPlaca(true)}
              trailingType="chevron"
              caption={`${vehicle.plate}`}
              showChevron={profile.role === "ADMIN"}
            />
          </GroupedList>
          {profile.role === "ADMIN" && (
            <GroupedList>
              <FormButton
                title="Borrar Camión"
                onPress={() =>
                  Alert.alert(
                    "Se tiene que borrar de muchas tablas, ver al final"
                  )
                }
              />
            </GroupedList>
          )}
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
