import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { Stack } from "expo-router";
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

  const truck = vehicles[0];

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ChangeDataModal
        isOpen={isAdmin ? numEco : false}
        currentDataType="Numero Economico"
        currentData={truck.economic_number}
        closeModal={() => setNumEco(false)}
        dataChange="numero_economico"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? marca : false}
        currentDataType="Marca"
        currentData={truck.brand}
        closeModal={() => setMarca(false)}
        dataChange="marca"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? subMarca : false}
        currentDataType="Sub Marca"
        currentData={truck.sub_brand}
        closeModal={() => setSubMarca(false)}
        dataChange="sub_marca"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? modelo : false}
        currentDataType="Modelo"
        currentData={truck.year}
        closeModal={() => setModelo(false)}
        dataChange="modelo"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? noSerie : false}
        currentDataType="No de Serie"
        currentData={truck.serial_number}
        closeModal={() => setNoSerie(false)}
        dataChange="no_serie"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? placa : false}
        currentDataType="Placa"
        currentData={truck.plate}
        closeModal={() => setPlaca(false)}
        dataChange="placa"
        id={truck.id}
      />

      <View style={styles.container}>
        <Stack.Screen
          options={{ title: `${truck.brand} ${truck.sub_brand}` }}
        />
        <GroupedList
          header="Detalles"
          footer="Si necesitas más información, contacta a tu administrador y si ves algún error contacta a tu supervisor, solo los administradores pueden editar la información del camión."
        >
          <Row
            title="Numero Economico"
            onPress={() => setNumEco(true)}
            trailingType="chevron"
            caption={`${truck.economic_number}`}
            showChevron={!!isAdmin}
          />
          <Row
            title="Marca"
            onPress={() => setMarca(true)}
            trailingType="chevron"
            caption={`${truck.brand}`}
            showChevron={!!isAdmin}
          />
          <Row
            title="Sub Marca"
            onPress={() => setSubMarca(true)}
            trailingType="chevron"
            caption={`${truck.sub_brand}`}
            showChevron={!!isAdmin}
          />
          <Row
            title="Modelo"
            onPress={() => setModelo(true)}
            trailingType="chevron"
            caption={`${truck.year}`}
            showChevron={!!isAdmin}
          />
          <Row
            title="No de Serie"
            onPress={() => setNoSerie(true)}
            trailingType="chevron"
            caption={`${truck.serial_number?.substring(0, 8) ?? "No disponible"}${truck.serial_number && truck.serial_number.length > 8 ? "..." : ""}`}
            showChevron={!!isAdmin}
          />
          <Row
            title="Placa"
            onPress={() => setPlaca(true)}
            trailingType="chevron"
            caption={`${truck.plate}`}
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
