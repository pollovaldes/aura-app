import React, { useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Image,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import {
  BookOpen,
  Clipboard,
  Fuel,
  Images,
  RotateCw,
  Truck,
  UsersRoundIcon,
  Waypoints,
  Wrench,
} from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import useTruck from "@/hooks/truckHooks/useTruck";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ChangeTruckImageModal from "@/components/trucks/ChangeTruckImages";
import useTruckThumbnail from "@/hooks/truckHooks/useTruckThumbnail";
import { FormButton } from "@/components/Form/FormButton";

export default function TruckDetail() {
  const { styles } = useStyles(stylesheet);
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const {
    trucks,
    setTrucks,
    fetchTrucks,
    trucksAreLoading,
    addPhotoToGalley,
    deletePhotoFromGallery,
    selectThumbnail,
    deleteThumbnail,
  } = useTruck();

  const [activeModal, setActiveModal] = useState(false);

  const truck = trucks?.find((Truck) => Truck.id === truckId);

  const { thumbnailIsLoading } = useTruckThumbnail(
    truck?.id as string,
    trucks,
    setTrucks
  );

  if (trucksAreLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <LoadingScreen caption="Cargando vehículos" />
      </>
    );
  }

  if (trucks === null) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <ErrorScreen
          caption={`Ocurrió un error y no \npudimos cargar los vehículos`}
          buttonCaption="Reintentar"
          retryFunction={fetchTrucks}
        />
      </>
    );
  }

  if (trucks.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <EmptyScreen caption="Ningún detalle por aquí" />;
      </>
    );
  }

  if (!truck) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchTrucks}
        />
      </>
    );
  }

  const truckTitle = `${truck.brand ?? ""} ${truck.sub_brand ?? ""} (${truck.year ?? ""})`;

  return (
    <>
      <Stack.Screen options={{ title: truckTitle }} />
      <ChangeTruckImageModal
        visible={activeModal}
        closeModal={() => setActiveModal(false)}
        truck={truck}
        selectThumbnail={selectThumbnail}
        addPhotoToGallery={addPhotoToGalley}
        deleteThumbnail={deleteThumbnail}
        deletePhotoFromGalley={deletePhotoFromGallery}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={trucksAreLoading}
            onRefresh={fetchTrucks}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Pressable onPress={() => setActiveModal(true)}>
              {thumbnailIsLoading ? (
                <ActivityIndicator />
              ) : truck.thumbnail ? (
                <Image style={styles.image} source={{ uri: truck.thumbnail }} />
              ) : (
                <FormButton
                  title="Seleccionar imagen"
                  onPress={() => setActiveModal(true)}
                />
              )}
            </Pressable>
          </View>
          <GroupedList
            header="Consulta"
            footer="Ve distintos datos a lo largo del tiempo o actuales sobre este camión."
          >
            <Row
              title="Galeria"
              trailingType="chevron"
              icon={<Images size={24} color="white" />}
              color={colorPalette.cyan[500]}
            />
            <Row
              title="Ficha técnica"
              trailingType="chevron"
              onPress={() => router.navigate(`/trucks/${truckId}/details`)}
              icon={<Clipboard size={24} color="white" />}
              color={colorPalette.emerald[500]}
            />
            <Row
              title="Guantera digital"
              trailingType="chevron"
              icon={<BookOpen size={24} color="white" />}
              color={colorPalette.orange[500]}
              onPress={() =>
                router.navigate(`/trucks/${truckId}/documentation`)
              }
            />
            <Row
              title="Histórico de rutas"
              trailingType="chevron"
              icon={<Waypoints size={24} color="white" />}
              color={colorPalette.lime[500]}
            />
            <Row
              title="Histórico de cargas de gasolina"
              trailingType="chevron"
              icon={<Fuel size={24} color="white" />}
              color={colorPalette.red[500]}
              onPress={() => router.navigate(`/trucks/${truckId}/gasoline`)}
            />
          </GroupedList>
          <GroupedList header="Acciones" footer="Alguna descripción.">
            <Row
              title="Administrar personas"
              trailingType="chevron"
              icon={<UsersRoundIcon size={24} color="white" />}
              color={colorPalette.sky[500]}
              onPress={() => router.navigate(`/trucks/${truckId}/people`)}
            />
            <Row
              title="Registrar carga de gasolina"
              trailingType="chevron"
              icon={<Fuel size={24} color="white" />}
              color={colorPalette.red[500]}
            />
            <Row
              title="Solicitar mantenimiento"
              trailingType="chevron"
              icon={<Wrench size={24} color="white" />}
              color={colorPalette.green[500]}
            />
            <Row
              title="Actualizar datos"
              trailingType="chevron"
              icon={<RotateCw size={24} color="white" />}
              color={colorPalette.orange[500]}
              onPress={fetchTrucks}
              caption="Dev only"
            />
          </GroupedList>
          <View />
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  loadingText: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
  container: {
    flex: 1,
    gap: theme.marginsComponents.section,
  },
  loadingContainer: {
    gap: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  noTrucksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTrucksText: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  imageContainer: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
  },
  button: {
    backgroundColor: "#add8e6", // Azul claro
    borderColor: "#000", // Borde negro
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    width: "100%", // Ancho completo
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Texto negro
  },
}));
