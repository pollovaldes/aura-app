import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { FilterSelector } from "@/components/radioButton/FilterSelector";
import useProfile from "@/hooks/useProfile";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function NotificationsList() {
  const [selectedFilter, setSelectedFilter] = useState("todo");
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();

  const FILTER_OPTIONS = [
    { key: "todo", label: "Todo" },
    { key: "mantenimiento", label: "Mantenimiento" },
    { key: "gasolina", label: "Gasolina" },
    { key: "roles", label: "Roles" },
    { key: "flotillas", label: "Flotillas" },
    { key: "rutas", label: "Rutas" },
  ];

  const DATA = [
    { id: "1", category: "mantenimiento", title: "Cambio de aceite" },
    { id: "2", category: "gasolina", title: "Recarga de gasolina" },
    { id: "3", category: "roles", title: "Asignar roles" },
    { id: "4", category: "ayuda", title: "Solicitar soporte" },
  ];

  const filteredData = selectedFilter === "todo" ? DATA : DATA.filter((item) => item.category === selectedFilter);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notificaciones",
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay resultados disponibles</Text>}
        ListHeaderComponent={
          <View style={styles.filterContainer}>
            <FilterSelector options={FILTER_OPTIONS} selected={selectedFilter} onChange={setSelectedFilter} />
          </View>
        }
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    //backgroundColor: "green",
  },
  filterContainer: {
    paddingVertical: 12,
  },
  listItem: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
  },
  itemText: {
    fontSize: 16,
    color: theme.textPresets.main,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
}));
