import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState, useMemo } from "react";
import { View, Text, FlatList, RefreshControl, Alert, Platform, Pressable } from "react-native";
import useAllGasolineLoads from "@/hooks/GasolineDataTest/useAllGasolineLoadHistory";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { useHeaderHeight } from "@react-navigation/elements";
import { ChevronRight, Filter } from "lucide-react-native";
import Modal from "@/components/Modal/Modal";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import StatusChip from "@/components/General/StatusChip";

type GasolineLoad = {
  id: string;
  vehicle_id: string;
  status: string;
  requested_at: string;
  amount: number;
  liters: number;
};

type DateFilter = "all" | "week" | "month";
type ModalType = "date_filter" | null;

const statesConfig = {
  approved: {
    text: "Aprobado",
    backgroundColor: "#e8f5e9", // Verde claro
    textColor: "#2e7d32", // Verde
  },
  pending: {
    text: "Pendiente",
    backgroundColor: "#fff3e0", // Naranja claro
    textColor: "#ef6c00", // Naranja
  },
  rejected: {
    text: "Rechazado",
    backgroundColor: "#ffebee", // Rojo claro
    textColor: "#c62828", // Rojo
  },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("es", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} de ${month} del ${year} a las ${hours}:${minutes} horas`;
}

export default function VehicleGasolineHistory() {
  const { styles } = useStyles(stylesheet);
  const headerHeight = useHeaderHeight();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const { allGasolineLoads, loading, error, refetch } = useAllGasolineLoads(vehicleId);

  const closeModal = () => setActiveModal(null);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el historial");
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const getFilteredByDate = (data: GasolineLoad[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return data.filter((item) => new Date(item.requested_at) >= weekAgo);
      case "month":
        const monthAgo = new Date(today.getTime());
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return data.filter((item) => new Date(item.requested_at) >= monthAgo);
      default:
        return data;
    }
  };

  const filteredData = useMemo(() => {
    if (!allGasolineLoads) return [];

    // First filter by status using the SegmentedControl
    const statusFiltered = allGasolineLoads.filter((item) => {
      switch (currentTabIndex) {
        case 1:
          return item.status === "pending";
        case 2:
          return item.status === "approved";
        case 3:
          return item.status === "rejected";
        default:
          return true;
      }
    });

    // Then filter by date using the modal filter
    return getFilteredByDate(statusFiltered);
  }, [allGasolineLoads, currentTabIndex, dateFilter]);

  const DateFilterModal = () => (
    <Modal isOpen={activeModal === "date_filter"}>
      <View style={styles.modalContainer}>
        <Text style={styles.closeButton} onPress={closeModal}>
          Cerrar
        </Text>
        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title="Filtrar por fecha" />
            <Text style={styles.subtitle}>Selecciona un rango de fechas para filtrar el historial</Text>
          </View>
          <View style={styles.group}>
            {["all", "week", "month"].map((filter) => (
              <FormButton
                key={filter}
                title={filter === "all" ? "Todos los registros" : filter === "week" ? "Última semana" : "Último mes"}
                onPress={() => {
                  setDateFilter(filter as DateFilter);
                  closeModal();
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!vehicleId) {
    return (
      <>
        <Stack.Screen options={{ title: "Error" }} />
        <ErrorScreen caption="ID de vehículo no encontrado" buttonCaption="Regresar" retryFunction={onRefresh} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: "Error" }} />
        <ErrorScreen
          caption="Error al cargar el historial de gasolina"
          buttonCaption="Reintentar"
          retryFunction={onRefresh}
        />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <LoadingScreen caption="Cargando historial de gasolina" />
      </>
    );
  }

  return (
    <>
      <DateFilterModal />
      <Stack.Screen
        options={{
          title: "Historial de Cargas",
          headerLargeTitle: false,
          headerRight: () => (
            <Pressable onPress={() => setActiveModal("date_filter")}>
              <Filter color={styles.filterIcon.color} />
            </Pressable>
          ),
        }}
      />
      <SegmentedControl
        values={["Todos", "Pendientes", "Aprobados", "Rechazados"]}
        selectedIndex={currentTabIndex}
        onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
        style={[styles.segmentedControl, { marginTop: Platform.OS === "ios" ? headerHeight + 6 : 6 }]}
      />
      <View style={styles.safeContainer}>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <StatusChip status={item.status} statesConfig={statesConfig} />
                  <Text style={styles.title}>${item.amount.toFixed(2)} MXN</Text>
                </View>
                <View>
                  <Text style={styles.subtitle}>
                    {`${item.liters.toFixed(2)} L • ${formatDate(item.requested_at)}`}
                  </Text>
                </View>
              </View>
              <View style={styles.chevronView}>
                <ChevronRight color={styles.chevron.color} />
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1976d2"]} tintColor="#1976d2" />
          }
          ListEmptyComponent={() => (
            <View style={{ height: 250 }}>
              <EmptyScreen caption="No hay registros de gasolina con este filtro" />
            </View>
          )}
        />
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.ui.colors.background,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
    padding: 12,
  },
  contentContainer: {
    gap: 6,
    flexDirection: "column",
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    paddingLeft: 10,
    color: theme.textPresets.main,
    marginRight: 120,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    fontSize: 15,
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: {
    color: theme.headerButtons.color,
    fontSize: 18,
    textAlign: "right",
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
  filterIcon: {
    color: theme.headerButtons.color,
  },
  segmentedControl: {
    width: runtime.screen.width >= 750 ? 520 : "98.5%",
    marginHorizontal: "auto",
    marginVertical: 6,
  },
}));
