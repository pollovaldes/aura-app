import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import UserThumbnail from "@/components/people/UserThumbnail";
import { SimpleList } from "@/components/simpleList/SimpleList";
import VehicleThumbnail from "@/components/vehicles/TruckThumbnail";
import { useFleets } from "@/hooks/useFleets";
import useProfile from "@/hooks/useProfile";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { fleetId } = useLocalSearchParams<{ fleetId: string }>();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets(fleetId);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const headerHeight = useHeaderHeight();

  if (isProfileLoading || areFleetsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <FetchingIndicator caption={isProfileLoading ? "Cargando perfil" : "Cargando flotillas"} />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerRight: undefined,
            headerLargeTitle: false,
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

  if (!fleets) {
    return (
      <>
        <ErrorScreen
          caption="Ocurrió un error al recuperar las flotillas"
          buttonCaption="Reintentar"
          retryFunction={fetchFleets}
        />
        <Stack.Screen
          options={{
            title: "Error",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
      </>
    );
  }

  if (fleets.length === 0) {
    return (
      <>
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso"
          buttonCaption="Reintentar"
          retryFunction={fetchFleets}
        />
        <Stack.Screen
          options={{
            title: "Error",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
      </>
    );
  }

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const canAddFleet = profile.role === "ADMIN" || profile.role === "OWNER";
  const fleet = fleets[0];

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          title: fleet.title,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                text="Editar"
                onPress={
                  currentTabIndex === 0
                    ? () =>
                        router.push("./edit_people", {
                          relativeToDirectory: true,
                        })
                    : () =>
                        router.push("./edit_vehicles", {
                          relativeToDirectory: true,
                        })
                }
                show={canAddFleet}
              />
            </ActionButtonGroup>
          ),
        }}
      />
      <View style={[styles.container, { marginTop: Platform.OS === "ios" ? headerHeight : 6 }]}>
        <SegmentedControl
          values={["Personas", "Vehículos"]}
          selectedIndex={currentTabIndex}
          onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
          style={styles.segmentedControl}
        />
      </View>

      {currentTabIndex === 0 ? (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={fleet.users}
          keyExtractor={(item) => item.id}
          refreshing={areFleetsLoading || isProfileLoading}
          onRefresh={() => {
            fetchFleets();
            fetchProfile();
          }}
          style={styles.flatList}
          renderItem={({ item }) => (
            <SimpleList
              leading={<UserThumbnail userId={item.id.toString()} size={60} />}
              content={
                <Text style={styles.itemText}>
                  {`${capitalizeWords(item.name)} ${capitalizeWords(item.father_last_name)} ${capitalizeWords(item.mother_last_name)}`}
                </Text>
              }
            />
          )}
          ListEmptyComponent={<EmptyScreen caption="No hay personas en esta flotilla" />}
        />
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={fleet.vehicles}
          keyExtractor={(item) => item.id}
          refreshing={areFleetsLoading || isProfileLoading}
          onRefresh={() => {
            fetchFleets();
            fetchProfile();
          }}
          style={styles.flatList}
          renderItem={({ item }) => (
            <SimpleList
              leading={<VehicleThumbnail vehicleId={item.id} />}
              content={
                <>
                  <Text style={styles.itemTitle}>{`${item.brand} ${item.sub_brand} (${item.year})`}</Text>
                  <Text style={styles.itemDetails}>
                    {`Placa: ${item.plate}\nNúmero económico: ${item.economic_number}`}
                  </Text>
                </>
              }
            />
          )}
          ListEmptyComponent={<EmptyScreen caption="No hay vehículos en esta flotilla" />}
        />
      )}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  flatList: {
    marginBottom: 36,
  },
  container: {
    marginTop: theme.marginsComponents.section,
  },
  segmentedControl: {
    width: "97%",
    margin: "auto",
    marginVertical: 6,
  },
  rowContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
    paddingVertical: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    padding: 12,
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
  boldText: {
    fontWeight: "bold",
  },
  chevronView: {
    paddingRight: 12,
  },
  plusIcon: {
    fontSize: 16,
    color: theme.headerButtons.color,
  },
  emptyStateContainer: {
    marginTop: 100,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: theme.textPresets.main,
  },
  itemDetails: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
}));
