import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import ChangeDataModal from "@/components/Modal/ChangeDataModal";
import { FormButton } from "@/components/Form/FormButton";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useIsAdmin from "@/hooks/useIsAdmin";

export default function Index() {
  const { vehicles, vehiclesAreLoading } = useVehicle(); // Usa el hook
  const { styles } = useStyles(stylesheet);

  const [numEco, setNumEco] = useState(false);
  const [marca, setMarca] = useState(false);
  const [subMarca, setSubMarca] = useState(false);
  const [modelo, setModelo] = useState(false);
  const [noSerie, setNoSerie] = useState(false);
  const [placa, setPlaca] = useState(false);
  const [poliza, setPoliza] = useState(false);

  const isAdmin = useIsAdmin();

  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const vehicle = vehicles?.find((Vehicle) => Vehicle.id === vehicleId);

  if (vehiclesAreLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <Stack.Screen options={{ title: "" }} />
      </View>
    );
  }

  if (!vehicles) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.details}>Este camión no existe…</Text>
        <Stack.Screen options={{ title: "Error" }} />
      </View>
    );
  }

  return (
    vehicle && (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ChangeDataModal
          isOpen={isAdmin ? numEco : false}
          currentDataType="Numero Economico"
          currentData={vehicle.economic_number}
          closeModal={() => setNumEco(false)}
          dataChange="numero_economico"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={isAdmin ? marca : false}
          currentDataType="Marca"
          currentData={vehicle.brand}
          closeModal={() => setMarca(false)}
          dataChange="marca"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={isAdmin ? subMarca : false}
          currentDataType="Sub Marca"
          currentData={vehicle.sub_brand}
          closeModal={() => setSubMarca(false)}
          dataChange="sub_marca"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={isAdmin ? modelo : false}
          currentDataType="Modelo"
          currentData={vehicle.year}
          closeModal={() => setModelo(false)}
          dataChange="modelo"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={isAdmin ? noSerie : false}
          currentDataType="No de Serie"
          currentData={vehicle.serial_number}
          closeModal={() => setNoSerie(false)}
          dataChange="no_serie"
          id={vehicle.id}
        />
        <ChangeDataModal
          isOpen={isAdmin ? placa : false}
          currentDataType="Placa"
          currentData={vehicle.plate}
          closeModal={() => setPlaca(false)}
          dataChange="placa"
          id={vehicle.id}
        />

        <View style={styles.container}>
          <Stack.Screen
            options={{ title: `${vehicle.brand} ${vehicle.sub_brand}` }}
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
              showChevron={!!isAdmin}
            />
            <Row
              title="Marca"
              onPress={() => setMarca(true)}
              trailingType="chevron"
              caption={`${vehicle.brand}`}
              showChevron={!!isAdmin}
            />
            <Row
              title="Sub Marca"
              onPress={() => setSubMarca(true)}
              trailingType="chevron"
              caption={`${vehicle.sub_brand}`}
              showChevron={!!isAdmin}
            />
            <Row
              title="Modelo"
              onPress={() => setModelo(true)}
              trailingType="chevron"
              caption={`${vehicle.year}`}
              showChevron={!!isAdmin}
            />
            <Row
              title="No de Serie"
              onPress={() => setNoSerie(true)}
              trailingType="chevron"
              caption={`${vehicle.serial_number?.substring(0, 8) ?? "No disponible"}${vehicle.serial_number && vehicle.serial_number.length > 8 ? "..." : ""}`}
              showChevron={!!isAdmin}
            />
            <Row
              title="Placa"
              onPress={() => setPlaca(true)}
              trailingType="chevron"
              caption={`${vehicle.plate}`}
              showChevron={!!isAdmin}
            />
          </GroupedList>
          {isAdmin && (
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
