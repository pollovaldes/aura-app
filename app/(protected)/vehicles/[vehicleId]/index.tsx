import React, { useEffect, useState } from "react";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import {
  View,
  Image,
  ScrollView,
  RefreshControl,
  Text,
  Platform,
  Alert,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import {
  BookOpen,
  Boxes,
  Clipboard,
  Fuel,
  Images,
  Trash,
  Waypoints,
  Wrench,
} from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import useVehicleThumbnail from "@/hooks/truckHooks/useVehicleThumbnail";
import useProfile from "@/hooks/useProfile";
import Modal from "@/components/Modal/Modal";
import ChangeCoverImage from "@/components/vehicles/modals/ChangeCoverImage";
import { supabase } from "@/lib/supabase";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";

type ModalType = "change_cover_image" | null;

export default function VehicleDetail() {
  const navigation = useNavigation();
  const { showModal } = useLocalSearchParams();
  useEffect(() => {
    navigation.setOptions({
      presentation: showModal === "true" ? "modal" : "card",
    });
  }, []);
  const { styles } = useStyles(stylesheet);
  const { vehicles, fetchVehicles, vehiclesAreLoading } = useVehicle();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { deleteThumbnail, selectThumbnail } = useVehicleThumbnail();

  if (isProfileLoading || vehiclesAreLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
          }}
        />
        <FetchingIndicator
          caption={isProfileLoading ? "Cargando perfil" : "Cargando vehículos"}
        />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen options={{ title: "Error", headerLargeTitle: false }} />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (!vehicles) {
    return (
      <>
        <Stack.Screen options={{ title: "Error", headerLargeTitle: false }} />
        <ErrorScreen
          caption="Ocurrió un error al cargar los vehículos"
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);
  if (!vehicle) {
    return (
      <>
        <Stack.Screen
          options={{ title: "Recurso inaccesible", headerLargeTitle: false }}
        />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const vehicleTitle = `${vehicle.brand ?? ""} ${vehicle.sub_brand ?? ""} (${vehicle.year ?? ""})`;
  const canEditVehicle = profile.role === "ADMIN" || profile.role === "OWNER";

  const deleteVehicle = () => {
    Alert.alert(
      "Confirmación",
      `¿Estás seguro de eliminar el vehículo "${vehicleTitle}"?\nEsta acción borrará permanentemente sus rutas, historiales, documentos, etc.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("vehicles")
              .delete()
              .eq("id", vehicleId);

            if (error) {
              alert(
                "Ocurrió un error al eliminar el vehículo\n" + error.message,
              );
              return;
            }

            fetchVehicles();
            router.back();
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: false,
          title: "",
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                text="Editar portada"
                onPress={() => setActiveModal("change_cover_image")}
                show={canEditVehicle}
              />
            </ActionButtonGroup>
          ),
        }}
      />
      <Modal isOpen={activeModal === "change_cover_image"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <ChangeCoverImage
            closeModal={closeModal}
            vehicle={vehicle}
            selectThumbnail={selectThumbnail}
            deleteThumbnail={deleteThumbnail}
          />
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
        <View style={styles.root}>
          <View style={styles.imageWrapper}>
            {vehicle.thumbnail ? (
              <Image source={{ uri: vehicle.thumbnail }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.title}>{vehicleTitle}</Text>
              </View>
            )}
            <View style={styles.overlay}>
              {vehicle.thumbnail && (
                <Text style={styles.imageText}>{vehicleTitle}</Text>
              )}
            </View>
          </View>
          <View style={styles.groupedListContainer}>
            <GroupedList header="Consulta general">
              <Row
                title="Galería"
                icon={Images}
                backgroundColor={colorPalette.cyan[500]}
              />
              <Row
                title="Ficha técnica"
                onPress={() =>
                  router.navigate(`/vehicles/${vehicleId}/technical_sheet`)
                }
                icon={Clipboard}
                backgroundColor={colorPalette.green[500]}
              />
              <Row
                title="Guantera digital"
                icon={BookOpen}
                backgroundColor={colorPalette.orange[500]}
                onPress={() =>
                  router.navigate(`/vehicles/${vehicleId}/documentation`)
                }
              />
            </GroupedList>
          </View>
          <View style={styles.groupedListContainer}>
            <GroupedList header="Acciones">
              <Row
                title="Mantenimiento"
                icon={Wrench}
                backgroundColor={colorPalette.cyan[500]}
                onPress={() =>
                  router.navigate(`/vehicles/${vehicleId}/maintenance`)
                }
              />
              <Row
                title="Cargas de gasolina"
                icon={Fuel}
                backgroundColor={colorPalette.red[500]}
                onPress={() =>
                  router.navigate(`/vehicles/${vehicleId}/gasoline_history`)
                }
              />
              <Row
                title="Rutas"
                icon={Waypoints}
                backgroundColor={colorPalette.sky[500]}
              />
              <Row
                title="Administrar flotillas"
                icon={Boxes}
                backgroundColor={colorPalette.lime[500]}
                onPress={() =>
                  router.navigate(`/vehicles/${vehicleId}/manage_fleets`)
                }
                show={canEditVehicle} // Added back
              />
            </GroupedList>
          </View>
          <View style={styles.groupedListContainer}>
            <GroupedList header="Zona de peligro">
              <Row
                title="Borrar vehículo"
                icon={Trash}
                backgroundColor={colorPalette.red[500]}
                onPress={() => deleteVehicle()}
                show={canEditVehicle} // Added back
              />
            </GroupedList>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  root: {
    flex: 1,
    width: "100%",
    paddingBottom: 36,
  },
  groupedListContainer: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section, //Excepción
  },
  imageWrapper: {
    position: "relative",
    aspectRatio: 16 / 9,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 800 : "100%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: Platform.OS === "web" ? 12 : 0,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.ui.colors.border,
    width: "100%",
    height: "100%",
    borderRadius: Platform.OS === "web" ? 12 : 0,
    paddingHorizontal: 30,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderRadius: Platform.OS === "web" ? 12 : 0,
  },
  imageText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    color: theme.textPresets.main,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
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
}));
