import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Image,
  ScrollView,
  RefreshControl,
  Text,
  Platform,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import {
  BookOpen,
  Boxes,
  Clipboard,
  Fuel,
  Image as ImageIcon,
  RotateCw,
  Trash,
  Waypoints,
  Wrench,
  Images,
  TruckIcon,
} from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import { supabase } from "@/lib/supabase";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { useVehicles } from "@/hooks/truckHooks/useVehicle";
import { useVehicleThumbnail } from "@/hooks/useVehicleThumbnail";
import { ChangeCoverImageModal } from "@/features/tabs/vehicles/modals/ChangeCoverImageModal";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import Modal from "@/components/Modal/Modal";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import useProfile from "@/hooks/useProfile";

type ModalType = "change_cover_image" | null;

export function VehicleDetails() {
  const { styles } = useStyles(stylesheet);
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicles();
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { thumbnail, refetchVehicleThumbnail } = useVehicleThumbnail(vehicleId);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const { width } = useWindowDimensions();
  const [vehicleIsLoading, setVehicleIsLoading] = useState(true);

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
          retryFunction={refetchVehicle}
        />
      </>
    );
  }

  const vehicleTitle = `${vehicle.brand ?? ""} ${vehicle.sub_brand ?? ""} (${vehicle.year ?? ""})`;
  const canEditVehicle = profile.role === "ADMIN" || profile.role === "OWNER";

  const deleteVehicle = async () => {
    Alert.alert(
      "Confirmación",
      `¿Estás seguro de eliminar el vehículo "${vehicleTitle}"?\nEsta acción borrará permanentemente sus rutas, historiales, documentos, etc.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);

            if (error) {
              console.error("Error deleting vehicle:", error);
              throw error;
            }

            fetchVehicle();
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: false,
          title: vehicleTitle,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                text="Editar portada"
                Icon={ImageIcon}
                onPress={() => setActiveModal("change_cover_image")}
                show={canEditVehicle}
              />
              <ActionButton
                onPress={() => {
                  refetchVehicle();
                }}
                Icon={RotateCw}
                text="Actualizar"
                show={Platform.OS === "web"}
              />
            </ActionButtonGroup>
          ),
        }}
      />
      <Modal isOpen={activeModal === "change_cover_image"} close={closeModal}>
        <ChangeCoverImageModal vehicle={vehicle} close={closeModal} />
      </Modal>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={vehicleIsLoading} onRefresh={refetchVehicle} />}
      >
        <View style={styles.root}>
          <View style={styles.imageWrapper(width)}>
            {thumbnail?.isLoading ? (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="large" />
              </View>
            ) : thumbnail?.imageURI ? (
              <Image source={{ uri: thumbnail.imageURI }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <TruckIcon size={100} color={styles.noImageIcon.color} strokeWidth={1.45} />
              </View>
            )}
            <View style={styles.overlay}>
              {thumbnail && !thumbnail.isLoading && <Text style={styles.imageText}>{vehicleTitle}</Text>}
            </View>
          </View>
          <View style={styles.groupedListContainer}>
            <GroupedList header="Consulta general">
              <Row title="Galería" icon={Images} backgroundColor={colorPalette.cyan[500]} />
              <Row
                title="Ficha técnica"
                onPress={() => router.push(`./technical_sheet`, { relativeToDirectory: true })}
                icon={Clipboard}
                backgroundColor={colorPalette.green[500]}
              />
              <Row
                title="Guantera digital"
                onPress={() => router.push(`./documentation`, { relativeToDirectory: true })}
                icon={BookOpen}
                backgroundColor={colorPalette.orange[500]}
              />
            </GroupedList>
          </View>
          <View style={styles.groupedListContainer}>
            <GroupedList header="Acciones">
              <Row
                title="Mantenimiento"
                onPress={() => router.push(`./maintenance`, { relativeToDirectory: true })}
                icon={Wrench}
                backgroundColor={colorPalette.cyan[500]}
              />
              <Row
                title="Combustible"
                onPress={() => router.push(`./gasoline`, { relativeToDirectory: true })}
                icon={Fuel}
                backgroundColor={colorPalette.red[500]}
              />
              <Row
                title="Rutas"
                onPress={() => router.push(`./routes`, { relativeToDirectory: true })}
                icon={Waypoints}
                backgroundColor={colorPalette.sky[500]}
              />
              <Row
                title="Administrar flotillas"
                onPress={() => router.push(`./manage_fleets`, { relativeToDirectory: true })}
                icon={Boxes}
                backgroundColor={colorPalette.lime[500]}
                show={canEditVehicle}
              />
            </GroupedList>
          </View>
          <View style={styles.groupedListContainer}>
            <GroupedList header="Zona de peligro">
              <Row
                title="Borrar vehículo"
                icon={Trash}
                backgroundColor={colorPalette.red[500]}
                onPress={deleteVehicle}
                show={canEditVehicle}
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
    marginTop: theme.marginsComponents.section,
  },
  imageWrapper: (width: number) => ({
    position: "relative",
    aspectRatio: 16 / 9,
    width: "100%",
    maxWidth: Platform.OS === "web" && width >= 750 ? 600 : "100%",
    marginTop: Platform.OS === "web" && width >= 750 ? 24 : 0,
    alignSelf: "center",
  }),
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
  imageLoadingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.ui.colors.border,
    borderRadius: Platform.OS === "web" ? 12 : 0,
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
  noImageIcon: {
    color: theme.textPresets.subtitle,
  },
}));
