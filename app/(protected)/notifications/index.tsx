import { FlatList, Platform, RefreshControl, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { FilterSelector } from "@/components/radioButton/FilterSelector";
import { useHeaderHeight } from "@react-navigation/elements";

export default function Index() {
  const [selectedFilter, setSelectedFilter] = useState("todo");
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const headerHeight = useHeaderHeight();

  const FILTER_OPTIONS = [
    { key: "todo", label: "Todo" },
    { key: "mantenimiento", label: "Mantenimiento" },
    { key: "gasolina", label: "Gasolina" },
    { key: "roles", label: "Roles" },
    { key: "ayuda", label: "Ayuda" },
    { key: "reportes", label: "Reportes de error" },
  ];

  const DATA = [
    { id: "1", category: "mantenimiento", title: "Cambio de aceite" },
    { id: "2", category: "gasolina", title: "Recarga de gasolina" },
    { id: "3", category: "roles", title: "Asignar roles" },
    { id: "4", category: "ayuda", title: "Solicitar soporte" },
  ];

  const filteredData = selectedFilter === "todo" ? DATA : DATA.filter((item) => item.category === selectedFilter);

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <FetchingIndicator caption={isProfileLoading ? "Cargando perfil" : "Cargando sesión"} />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notificaciones",
          headerLargeTitle: false,
          headerRight: undefined,
        }}
      />

      <View style={styles.filterContainer}>
        <FilterSelector options={FILTER_OPTIONS} selected={selectedFilter} onChange={setSelectedFilter} />
      </View>

      <FlatList
        refreshControl={<RefreshControl refreshing={isProfileLoading} onRefresh={fetchProfile} />}
        style={styles.container}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay resultados disponibles</Text>}
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
