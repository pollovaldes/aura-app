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
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
          </GroupedList>

          <GroupedList header="Permisos">
            <Row
              title="Recibir alertas sobre documentos agregados o cambiados"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Avisos de cambios en la ficha técnica"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Notificaciones sobre cargas de gasolina recientes"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Actualizaciones sobre historial de rutas"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Alertas sobre tareas administrativas pendientes"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Proximidad a vencimientos de seguros o mantenimientos"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Alertas de seguridad durante las rutas"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Avisos de asignación de vehículos a conductores"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Permisos generales del sistema"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Configuraciones sobre notificaciones de flota"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Recibir notificaciones de solicitudes de conductores"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Alertas sobre autorizaciones pendientes"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Proximidad de servicios programados"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
            />
            <Row
              title="Notificaciones generales relacionadas con el sistema"
              trailingType="chevron"
              showChevron={false}
              caption={<Switch />}
              pressedStyle={false}
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
