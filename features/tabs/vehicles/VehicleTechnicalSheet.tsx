import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Platform } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";
import useProfile from "@/hooks/useProfile";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import Modal from "@/components/Modal/Modal";
import Row from "@/components/grouped-list/Row";
import GroupedList from "@/components/grouped-list/GroupedList";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { RotateCw } from "lucide-react-native";
import { EconomicNumberModal } from "./modals/technicalSheetModal/EconomicNumberModal";
import { BrandModal } from "./modals/technicalSheetModal/BrandModal";
import { SubBrandModal } from "./modals/technicalSheetModal/SubBrandModal";
import { YearModal } from "./modals/technicalSheetModal/YearModal";
import { SerialNumberModal } from "./modals/technicalSheetModal/SerialNumberModal";
import { PlateModal } from "./modals/technicalSheetModal/PlateModal";

type ModalType = "economic_number" | "brand" | "sub_brand" | "model" | "serial_number" | "plate" | "year" | null;

export function VehicleTechnicalSheet() {
  const { styles } = useStyles(stylesheet);
  const { vehicles, refetchVehicleById, fetchVehicleById } = useVehicle();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [vehicleIsLoading, setVehicleIsLoading] = useState(true);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  async function fetchVehicle() {
    setVehicleIsLoading(true);
    await fetchVehicleById(vehicleId);
    setVehicleIsLoading(false);
  }

  async function refetchVehicle() {
    setVehicleIsLoading(true);
    await refetchVehicleById(vehicleId);
    setVehicleIsLoading(false);
  }

  useEffect(() => {
    fetchVehicle();
  }, []);

  if (vehicleIsLoading) {
    return <FetchingIndicator caption="Cargando vehículo" />;
  }

  const vehicle = vehicles[vehicleId];

  if (!vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible", headerLargeTitle: false }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchVehicle}
        />
      </>
    );
  }

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";

  return (
    <>
      <Modal close={closeModal} isOpen={activeModal === "economic_number"}>
        <EconomicNumberModal vehicle={vehicle} closeModal={closeModal} refetchVehicle={refetchVehicle} />
      </Modal>
      <Modal close={closeModal} isOpen={activeModal === "brand"}>
        <BrandModal vehicle={vehicle} closeModal={closeModal} refetchVehicle={refetchVehicle} />
      </Modal>
      <Modal close={closeModal} isOpen={activeModal === "sub_brand"}>
        <SubBrandModal vehicle={vehicle} closeModal={closeModal} refetchVehicle={refetchVehicle} />
      </Modal>
      <Modal close={closeModal} isOpen={activeModal === "year"}>
        <YearModal vehicle={vehicle} closeModal={closeModal} refetchVehicle={refetchVehicle} />
      </Modal>
      <Modal close={closeModal} isOpen={activeModal === "serial_number"}>
        <SerialNumberModal vehicle={vehicle} closeModal={closeModal} refetchVehicle={refetchVehicle} />
      </Modal>
      <Modal close={closeModal} isOpen={activeModal === "plate"}>
        <PlateModal vehicle={vehicle} closeModal={closeModal} refetchVehicle={refetchVehicle} />
      </Modal>

      <Stack.Screen
        options={{
          title: "Ficha técnica",
          headerLargeTitle: true,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton onPress={refetchVehicle} text="Actualizar" Icon={RotateCw} show={Platform.OS === "web"} />
            </ActionButtonGroup>
          ),
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={vehicleIsLoading} onRefresh={refetchVehicle} />}
      >
        <View style={styles.container}>
          <GroupedList header="Ficha técnica del vehículo">
            <Row
              title="Número Económico"
              onPress={() => setActiveModal("economic_number")}
              caption={vehicle.economic_number ?? "N/A"}
              hideChevron={!canEdit}
            />
            <Row
              title="Marca"
              onPress={() => setActiveModal("brand")}
              caption={vehicle.brand ?? "N/A"}
              hideChevron={!canEdit}
            />
            <Row
              title="Submarca"
              onPress={() => setActiveModal("sub_brand")}
              caption={vehicle.sub_brand ?? "N/A"}
              hideChevron={!canEdit}
            />
            <Row
              title="Año"
              onPress={() => setActiveModal("year")}
              caption={vehicle.year ?? "N/A"}
              hideChevron={!canEdit}
            />
            <Row
              title="Número de serie"
              onPress={() => setActiveModal("serial_number")}
              caption={vehicle.serial_number ?? "N/A"}
              hideChevron={!canEdit}
            />
            <Row
              title="Número de placa"
              onPress={() => setActiveModal("plate")}
              caption={vehicle.plate ?? "N/A"}
              hideChevron={!canEdit}
            />
          </GroupedList>
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginTop: theme.marginsComponents.section,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  itemSubtitle: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
}));
