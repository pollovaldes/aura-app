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
  id: number;
  numero_economico: string;
  marca: string;
  sub_marca: string;
  modelo: string;
  no_serie: string;
  placa: string;
  poliza: string;
  id_usuario: string;
};

type Props = {
  truck: Truck | null;
  loading: boolean;
};

export default function TruckDetailComponent({ truck, loading }: Props) {
  const { styles } = useStyles(stylesheet);
  const { isAdmin } = useAuth();
  const [truckModal, setTruckModal] = useState(false);

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
      <ChangeDataModal isOpen={truckModal} currentData={truck} />
      <View style={styles.container}>
        <Stack.Screen options={{ title: `${truck.marca} ${truck.sub_marca}` }} />
        <GroupedList
            header="Detalles"
            footer="Si necesitas más información, contacta a tu administrador y si vez algun error contacta a tu supervisor, solo los administradores pueden editar la información del camion."
          >
            <Row title="Numero Economico" onPress={()=>setTruckModal(true)} trailingType="chevron" caption={`${truck.numero_economico}`} showChevron={isAdmin}/>
            <Row title="Marca" trailingType="chevron" caption={`${truck.marca}`} showChevron={isAdmin} />
            <Row title="Sub Marca" trailingType="chevron" caption={`${truck.sub_marca}`} showChevron={isAdmin} />
            <Row title="Modelo" trailingType="chevron" caption={`${truck.modelo}`} showChevron={isAdmin} />
            <Row
              title="No de Serie"
              trailingType="chevron"
              caption={`${truck.no_serie.length > 8 ? truck.no_serie.substring(0, 8) + '...' : truck.no_serie}`}
              showChevron={isAdmin}
            />
            <Row title="Placa" trailingType="chevron" caption={`${truck.placa}`} showChevron={isAdmin} />
            <Row title="Poliza" trailingType="chevron" caption={`${truck.poliza}`} showChevron={isAdmin} />
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
