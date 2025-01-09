import React, { useState, useCallback } from "react";
import { View, Text, Pressable, FlatList, RefreshControl } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import useGasolineLoads from "@/hooks/useGasolineLoads";
import useGasolineStatus from "@/hooks/GasolineDataTest/useGasolineStatus";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import WeeklyGasolineChart from "@/components/GasolineDataComponentsTest/WeeklyGasolineChart";
import RecentGasolineLoads from "@/components/GasolineDataComponentsTest/RecentGasolineLoads";
import GasolineThreshold from "@/components/GasolineDataComponentsTest/GasolineThreshold";
import AddGasolineLoadModal from "@/components/GasolineDataComponentsTest/AddGasolineLoadModal";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import PendingGasolineLoads from "@/components/GasolineDataComponentsTest/PendingGasolineLoads";
import MonthlyGasolineChart from "@/components/GasolineDataComponentsTest/MonthlyGasolineChart";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useVehicles } from "@/hooks/truckHooks/useVehicle";

interface GasolineHistoryContentProps {
  profile: {
    id: string;
    role: string;
  };
  vehicle: {
    id: string;
  };
  isAdmin: boolean;
  gasolineStatus: any; // Replace 'any' with your actual GasolineStatus type
  isGasolineStatusLoading: boolean;
  updateGasolineThreshold: (threshold: number) => Promise<void>;
  vehicleId: string;
}

const GasolineHistoryContent = React.memo(
  ({
    profile,
    vehicle,
    isAdmin,
    gasolineStatus,
    isGasolineStatusLoading,
    updateGasolineThreshold,
    vehicleId,
  }: GasolineHistoryContentProps) => {
    const { styles } = useStyles(stylesheet);
    const router = useRouter();
    const [selectedView, setSelectedView] = useState(0); // 0 for weekly, 1 for monthly

    const handleHistoryPress = useCallback(() => {
      router.push(`./GasolineLoadHistory`, { relativeToDirectory: true }); // !Cambiar ruta o eliminar una de las dos gasolinas
    }, [vehicleId, router]);

    return (
      <View style={styles.contentContainer}>
        {<PendingGasolineLoads vehicleId={vehicle.id} profile={profile} />}
        <GasolineThreshold
          gasolineStatus={gasolineStatus}
          isLoading={isGasolineStatusLoading}
          canEdit={isAdmin}
          onUpdateThreshold={updateGasolineThreshold}
        />

        <SegmentedControl
          values={["Semanal", "Mensual"]}
          selectedIndex={selectedView}
          onChange={(event) => setSelectedView(event.nativeEvent.selectedSegmentIndex)}
          style={styles.segmentedControl}
        />

        {selectedView === 0 ? (
          <WeeklyGasolineChart vehicleId={vehicle.id} />
        ) : (
          <MonthlyGasolineChart vehicleId={vehicle.id} />
        )}

        <RecentGasolineLoads vehicleId={vehicle.id} />
        <Pressable style={styles.historyButton} onPress={handleHistoryPress}>
          <Text style={styles.viewHistoryButton}>Ver Historial Completo</Text>
        </Pressable>
      </View>
    );
  }
);

export default function VehicleGasoline() {
  const { styles } = useStyles(stylesheet);
  const router = useRouter();

  // State Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Custom Hooks
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicles();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  useGasolineLoads(); // * Borrar o ver que hacer

  // Find the vehicle
  const vehicle = vehicles?.find((Vehicle) => Vehicle.id === vehicleId);

  const { gasolineStatus, isGasolineStatusLoading, fetchGasolineStatus, updateGasolineThreshold } = useGasolineStatus(
    vehicle?.id
  ); // TODO arreglar todos los pdos de supabase

  const isAdmin = profile?.role === "ADMIN" || profile?.role === "OWNER";

  // Add refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchGasolineStatus(), fetchVehicles()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchGasolineStatus, fetchVehicles]);

  const handleModalSuccess = useCallback(() => {
    fetchGasolineStatus();
    setIsModalOpen(false);
  }, [fetchGasolineStatus]);

  // Combined loading state check
  if (vehiclesAreLoading || isGasolineStatusLoading) {
    return (
      <FetchingIndicator caption={vehiclesAreLoading ? "Cargando vehículos" : "Cargando estátus de combustible"} />
    );
  }

  if (!profile || !vehicles || !gasolineStatus) {
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
          caption="Ocurrió un error al cargar los datos"
          buttonCaption="Reintentar"
          retryFunction={onRefresh}
        />
      </>
    );
  }

  if (!vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const screenOptions = {
    title: "Historial de Gasolina",
    headerRight: () => (
      <Pressable onPress={() => setIsModalOpen(true)}>
        <Text style={styles.addButton}>Agregar</Text>
      </Pressable>
    ),
  };

  return (
    <>
      <Stack.Screen options={screenOptions} />
      {!gasolineStatus ? (
        <EmptyScreen
          caption="No hay datos de gasolina disponibles"
          buttonCaption="Reintentar"
          retryFunction={onRefresh}
        />
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={[null]} // Changed to [null] for better type safety
          renderItem={() => null}
          ListHeaderComponent={
            <GasolineHistoryContent // TODO: En supabase no se esta recargando la gasolina restante
              profile={profile}
              vehicle={vehicle}
              isAdmin={isAdmin}
              gasolineStatus={gasolineStatus}
              isGasolineStatusLoading={isGasolineStatusLoading}
              updateGasolineThreshold={updateGasolineThreshold}
              vehicleId={vehicleId}
            />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1976d2"]} tintColor="#1976d2" />
          }
        />
      )}
      {vehicle && (
        <AddGasolineLoadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicleId={vehicle.id}
          profile={profile}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  addButton: {
    color: theme.headerButtons.color,
    fontSize: 16,
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  historyButton: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 16,
    padding: 25,
    width: "95%",
    marginVertical: 10,
  },
  viewHistoryButton: {
    color: theme.headerButtons.color,
    fontSize: 16,
    textAlign: "center",
  },
  segmentedControl: {
    width: "95%",
    marginVertical: 10,
  },
}));
