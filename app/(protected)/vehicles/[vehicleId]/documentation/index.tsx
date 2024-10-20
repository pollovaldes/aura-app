import {
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  Text,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import useProfile from "@/hooks/useProfile";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useDocuments from "@/hooks/useDocuments";
import { Plus } from "lucide-react-native";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import AddDocument from "@/components/vehicles/modals/AddDocument";

type ModalType = "add_document" | null;

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { documents, areDocumentsLoading } = useDocuments();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando perfil y permisos" />
      </>
    );
  }

  if (vehiclesAreLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando vehículos" />
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

  if (vehicles === null) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption={`Ocurrió un error y no \npudimos cargar los vehículos`}
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);
  const canEditDocumentation =
    profile.role === "ADMIN" || profile.role === "OWNER";

  if (!vehicle) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  return (
    <>
      <Modal isOpen={activeModal === "add_document"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <AddDocument closeModal={closeModal} vehicle={vehicle} />
        </View>
      </Modal>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={vehiclesAreLoading || isProfileLoading}
            onRefresh={() => {
              fetchVehicles();
              fetchProfile();
            }}
          />
        }
      >
        <View style={styles.container}>
          <Stack.Screen
            options={{
              title: "Guantera Digital",
              headerLargeTitle: true,
              headerRight: () =>
                canEditDocumentation && (
                  <Pressable onPress={() => setActiveModal("add_document")}>
                    <Plus color={styles.plusIcon.color} />
                  </Pressable>
                ),
            }}
          />
          <GroupedList
            header="Documentos"
            footer="Solo los administradores pueden editar los documentos"
          >
            <Row
              title="Seguro"
              trailingType="chevron"
              onPress={() =>
                router.navigate(
                  `/vehicles/[vehicleId]/documentation/iddeldocumento`
                )
              } // Reemplazar el id del cocumento. Para Jackson: Aqui no se como funcione el storage pero en algun momento deberias tener que obtener el id de un documento, que seria algo asi como .documentId
            />
            <Row title="Licencia" trailingType="chevron" />
            <Row
              title="Permiso de transporte de carga"
              trailingType="chevron"
            />
            <Row
              title="Certificado de inspección vehicular"
              trailingType="chevron"
            />
            <Row title="Manual Técnico" trailingType="chevron" />
            <Row title="Números de emergencia" trailingType="chevron" />
          </GroupedList>
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
  details: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  plusIcon: {
    color: theme.ui.colors.primary,
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
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
}));
