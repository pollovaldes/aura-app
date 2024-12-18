import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, Switch, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { router, Stack } from "expo-router";
import React from "react";
import { BellDot, Info, LockKeyhole, Trash, Users } from "lucide-react-native";
import { colorPalette } from "@/style/themes";

export default function Index() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notificaciones",
          headerLargeTitle: true,
          headerRight: undefined,
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <GroupedList>
            <Row
              title="Recibir notificaciones"
              icon={<BellDot size={24} color="white" />}
              color={colorPalette.red[500]}
              trailing={<Switch />}
            />
          </GroupedList>

          <GroupedList header="Permisos">
            <Row
              title="Recibir alertas sobre documentos agregados o cambiados"
              trailing={<Switch />}
            />
            <Row
              title="Avisos de cambios en la ficha técnica"
              trailing={<Switch />}
            />
            <Row
              title="Notificaciones sobre cargas de gasolina recientes"
              trailing={<Switch />}
            />
            <Row
              title="Actualizaciones sobre historial de rutas"
              trailing={<Switch />}
            />
            <Row
              title="Alertas sobre tareas administrativas pendientes"
              trailing={<Switch />}
            />
            <Row
              title="Proximidad a vencimientos de seguros o mantenimientos"
              trailing={<Switch />}
            />
            <Row
              title="Alertas de seguridad durante las rutas"
              trailing={<Switch />}
            />
            <Row
              title="Avisos de asignación de vehículos a conductores"
              trailing={<Switch />}
            />
            <Row title="Permisos generales del sistema" trailing={<Switch />} />
            <Row
              title="Configuraciones sobre notificaciones de flota"
              trailing={<Switch />}
            />
            <Row
              title="Recibir notificaciones de solicitudes de conductores"
              trailing={<Switch />}
            />
            <Row
              title="Alertas sobre autorizaciones pendientes"
              trailing={<Switch />}
            />
            <Row
              title="Proximidad de servicios programados"
              trailing={<Switch />}
            />
            <Row
              title="Notificaciones generales relacionadas con el sistema"
              trailing={<Switch />}
            />
          </GroupedList>
          <View />
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
  },
}));
