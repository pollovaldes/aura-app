import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { colorPalette } from "@/style/themes";
import { Pen } from "lucide-react-native";
import { View, Text, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import AssignTruckModal from "@/components/Modal/AssignTruckModal";
import { useState } from "react";
import { Stack } from "expo-router";


export default function Index() {
  const { styles } = useStyles(stylesheet);
  const [modal, setModal] = useState(false);


  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Stack.Screen options={{ headerBackTitle: "Asignar camión", headerTitle: "Asignar camión" }} />

        <AssignTruckModal isOpen={modal} closeModal={() => setModal(false)} />
          
        <GroupedList
          header="Asignaciones"
          footer="Asigna un camion a su conductor"
        >
          <Row
            title="Ver Camiones Asignados"
            trailingType="chevron"
            onPress={() => setModal(true)}
            icon={<Pen size={24} color="white" />}
            color={colorPalette.emerald[500]}
          />
        </GroupedList>
        <GroupedList
          header=""
          footer="Asigna un camion a su conductor"
        >
          <Row
            title="Asignar camión"
            trailingType="chevron"
            onPress={() => setModal(true)}
            icon={<Pen size={24} color="white" />}
            color={colorPalette.emerald[500]}
          />
        </GroupedList>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginTop: theme.marginsComponents.section,
    gap: theme.marginsComponents.section,
  },
  imageContainer: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
  },
  button: {
    backgroundColor: "#add8e6", // Azul claro
    borderColor: "#000", // Borde negro
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    width: "100%", // Ancho completo
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Texto negro
  },
}));