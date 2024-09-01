import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/SessionContext";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import ChangeDataModal from "@/components/Modal/ChangeDataModal";
import { FormButton } from "@/components/Form/FormButton";
import useTruck, { Truck } from "@/hooks/truckHooks/useTruck";

export default function Index() {
  const { trucks, loading } = useTruck({ justOne: true}); // Usa el hook
  const { styles } = useStyles(stylesheet);
  const { isAdmin } = useAuth();
  
  const [numEco, setNumEco] = useState(false);
  const [marca, setMarca] = useState(false);
  const [subMarca, setSubMarca] = useState(false);
  const [modelo, setModelo] = useState(false);
  const [noSerie, setNoSerie] = useState(false);
  const [placa, setPlaca] = useState(false);
  const [poliza, setPoliza] = useState(false);

  console.log(trucks)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <Stack.Screen options={{ title: "" }} />
      </View>
    );
  }

  if (!trucks) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.details}>Este camión no existe…</Text>
        <Stack.Screen options={{ title: "Error" }} />
      </View>
    );
  }

  const truck: Truck = trucks[0]

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ChangeDataModal
        isOpen={isAdmin ? numEco : false}
        currentDataType="Numero Economico"
        currentData={truck.numero_economico}
        closeModal={() => setNumEco(false)}
        dataChange="numero_economico"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? marca : false}
        currentDataType="Marca"
        currentData={truck.marca}
        closeModal={() => setMarca(false)}
        dataChange="marca"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? subMarca : false}
        currentDataType="Sub Marca"
        currentData={truck.sub_marca}
        closeModal={() => setSubMarca(false)}
        dataChange="sub_marca"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? modelo : false}
        currentDataType="Modelo"
        currentData={truck.modelo}
        closeModal={() => setModelo(false)}
        dataChange="modelo"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? noSerie : false}
        currentDataType="No de Serie"
        currentData={truck.no_serie}
        closeModal={() => setNoSerie(false)}
        dataChange="no_serie"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? placa : false}
        currentDataType="Placa"
        currentData={truck.placa}
        closeModal={() => setPlaca(false)}
        dataChange="placa"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={isAdmin ? poliza : false}
        currentDataType="Poliza"
        currentData={truck.poliza}
        closeModal={() => setPoliza(false)}
        dataChange="poliza"
        id={truck.id}
      />

      <View style={styles.container}>
        <Stack.Screen options={{ title: `${truck.marca} ${truck.sub_marca}` }} />
        <GroupedList
          header="Detalles"
          footer="Si necesitas más información, contacta a tu administrador y si ves algún error contacta a tu supervisor, solo los administradores pueden editar la información del camión."
        >
          <Row
            title="Numero Economico"
            onPress={() => setNumEco(true)}
            trailingType="chevron"
            caption={`${truck.numero_economico}`}
            showChevron={isAdmin}
          />
          <Row
            title="Marca"
            onPress={() => setMarca(true)}
            trailingType="chevron"
            caption={`${truck.marca}`}
            showChevron={isAdmin}
          />
          <Row
            title="Sub Marca"
            onPress={() => setSubMarca(true)}
            trailingType="chevron"
            caption={`${truck.sub_marca}`}
            showChevron={isAdmin}
          />
          <Row
            title="Modelo"
            onPress={() => setModelo(true)}
            trailingType="chevron"
            caption={`${truck.modelo}`}
            showChevron={isAdmin} />
          <Row
            title="No de Serie"
            onPress={() => setNoSerie(true)}
            trailingType="chevron"
            caption={`${truck.no_serie?.substring(0, 8) ?? 'No disponible'}${truck.no_serie && truck.no_serie.length > 8 ? '...' : ''}`}
            showChevron={isAdmin}
          />
          <Row
            title="Placa"
            onPress={() => setPlaca(true)}
            trailingType="chevron"
            caption={`${truck.placa}`}
            showChevron={isAdmin} />
          <Row
            title="Poliza"
            onPress={() => setPoliza(true)}
            trailingType="chevron"
            caption={`${truck.poliza}`}
            showChevron={isAdmin} />
        </GroupedList>
        {isAdmin && (
        <GroupedList>
            <FormButton title="Borrar Camión" onPress={() => Alert.alert("A")} isRed={true}/>
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