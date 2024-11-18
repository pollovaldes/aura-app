// index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import useVehicle from "@/hooks/truckHooks/useVehicle";
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

export default function GasolineHistory() {
  const { styles } = useStyles(stylesheet);
  const router = useRouter();

  // State Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Custom Hooks
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  useGasolineLoads();

  // Find the vehicle
  const vehicle = vehicles?.find((Vehicle) => Vehicle.id === vehicleId);

  const {
    gasolineStatus,
    isGasolineStatusLoading,
    fetchGasolineStatus,
    updateGasolineThreshold
  } = useGasolineStatus(vehicle?.id);

  const canEditThreshold = profile?.role === 'ADMIN' || profile?.role === 'OWNER';
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'OWNER';

  // Add refresh function
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchGasolineStatus(),
        fetchProfile(),
        fetchVehicles(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [vehicleId]);

  // Combined loading state check
  if (vehiclesAreLoading || isProfileLoading || isGasolineStatusLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando datos de gasolina" />
      </>
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

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {isAdmin && <PendingGasolineLoads vehicleId={vehicle.id} />}
      <GasolineThreshold
        gasolineStatus={gasolineStatus}
        isLoading={isGasolineStatusLoading}
        canEdit={canEditThreshold}
        onUpdateThreshold={updateGasolineThreshold}
      />
      <WeeklyGasolineChart vehicleId={vehicle.id} />
      <RecentGasolineLoads vehicleId={vehicle.id} />
      <Pressable
        style={styles.historyButton}
        onPress={() =>
          router.push(`/vehicles/${vehicleId}/gasoline_history/GasolineLoadHistory`)
        }
      >
        <Text style={styles.viewHistoryButton}>Ver Historial Completo</Text>
      </Pressable>
    </View>
  );

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
          ListHeaderComponent={renderContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1976d2"]}
              tintColor="#1976d2"
            />
          }
        />
      )}
      <AddGasolineLoadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleId={vehicle.id}
        profile={profile}
        onSuccess={() => {
          fetchGasolineStatus();
          setIsModalOpen(false); // Add this to close modal after success
        }}
      />
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
}));