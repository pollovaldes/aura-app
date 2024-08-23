import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Asegúrate de tener configurado supabase correctamente
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { useAuth } from "@/context/AuthContext";
import ChangeDataModal from "@/components/Modal/ChangeDataModal";

// Define the type for the truck data
type Truck = {
  id: string;
  numero_economico: string;
  marca: string;
  sub_marca: string;
  modelo: string;
  no_serie: string;
  placa: string;
  poliza: string;
};

type Props = {
  truck: Truck | null;
  loading: boolean;
};

export default function TruckDetailComponent({ truck, loading }: Props) {
  const { styles } = useStyles(stylesheet);
  const { isAdmin } = useAuth();
  const [numEco, setNumEco] = useState(false);
  const [marca, setMarca] = useState(false);
  const [subMarca, setSubMarca] = useState(false);
  const [modelo, setModelo] = useState(false);
  const [noSerie, setNoSerie] = useState(false);
  const [placa, setPlaca] = useState(false);
  const [poliza, setPoliza] = useState(false);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <Stack.Screen options={{ title: "" }} />
      </View>
    );
  }

  if (!truck) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.details}>Este camión no existe…</Text>
        <Stack.Screen options={{ title: "Error" }} />
      </View>
    );
  }

  console.log(isAdmin)

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ChangeDataModal
        isOpen={numEco}
        currentDataType="Numero Economico"
        currentData={truck.numero_economico}
        closeModal={() => setNumEco(false)}
        dataChange="numero_economico"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={marca}
        currentDataType="Marca"
        currentData={truck.marca}
        closeModal={() => setMarca(false)}
        dataChange="marca"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={subMarca}
        currentDataType="Sub Marca"
        currentData={truck.sub_marca}
        closeModal={() => setSubMarca(false)}
        dataChange="sub_marca"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={modelo}
        currentDataType="Modelo"
        currentData={truck.modelo}
        closeModal={() => setModelo(false)}
        dataChange="modelo"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={noSerie}
        currentDataType="No de Serie"
        currentData={truck.no_serie}
        closeModal={() => setNoSerie(false)}
        dataChange="no_serie"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={placa}
        currentDataType="Placa"
        currentData={truck.placa}
        closeModal={() => setPlaca(false)}
        dataChange="placa"
        id={truck.id}
      />
      <ChangeDataModal
        isOpen={poliza}
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
          footer="Si necesitas más información, contacta a tu administrador y si vez algun error contacta a tu supervisor, solo los administradores pueden editar la información del camion."
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
            caption={`${truck.no_serie.length > 8 ? truck.no_serie.substring(0, 8) + '...' : truck.no_serie}`}
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
        {/* Agrega más detalles si es necesario */}
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section, //Excepción
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.textPresets.main,
  },
  details: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
}));
