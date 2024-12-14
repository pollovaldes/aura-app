import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import {
  FlatList,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { Boxes, ChevronRight, Plus } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import useFleets from "@/hooks/useFleets";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import AddFleetModal from "@/components/fleets/AddFleetModal";
import { useHeaderHeight } from "@react-navigation/elements";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import UserThumbnail from "@/components/people/UserThumbnail";
import VehicleThumbnail from "@/components/vehicles/TruckThumbnail";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { fleetId } = useLocalSearchParams<{ fleetId: string }>();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets(fleetId);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const headerHeight = useHeaderHeight();

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <LoadingScreen caption="Cargando perfil" />
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

  if (areFleetsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <LoadingScreen caption="Cargando flotillas" />
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

  const canAddFleet = profile.role === "ADMIN" || profile.role === "OWNER";
  const fleet = fleets[0];

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: false,
          title: fleet.title,
          headerRight: () =>
            canAddFleet && (
              <Pressable
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
              >
                <Plus color={styles.plusIcon.color} />
              </Pressable>
            ),
        }}
      />
      <View
        style={[
          styles.container,
          { marginTop: Platform.OS === "ios" ? headerHeight : 6 },
        ]}
      >
        <SegmentedControl
          values={["Personas", "Vehículos"]}
          selectedIndex={currentTabIndex}
          onChange={(event) =>
            setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)
          }
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
            <Link href={`/users/${item.id}?showModal=true`} asChild>
              <Pressable>
                <View style={styles.rowContainer}>
                  <View style={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                      <UserThumbnail userId={item.id} size={60} />
                    </View>
                    <Text style={styles.itemText}>
                      {`${item.name} ${item.father_last_name} ${item.mother_last_name}`}
                    </Text>
                  </View>
                  <View style={styles.chevronView}>
                    <ChevronRight color={styles.chevron.color} />
                  </View>
                </View>
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <EmptyScreen
                caption="No hay personas en esta flotilla"
                buttonCaption="Añadir personas"
                retryFunction={
                  canAddFleet
                    ? () =>
                        router.push("./edit_people", {
                          relativeToDirectory: true,
                        })
                    : undefined
                }
              />
            </View>
          }
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
            <Link
              href={{ pathname: `/vehicles/${item.id}?showModal=true` }}
              asChild
            >
              <TouchableOpacity>
                <View style={styles.rowContainer}>
                  <View style={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                      <VehicleThumbnail vehicleId={item.id} />
                    </View>
                    <Text style={styles.itemText}>
                      <Text style={styles.boldText}>
                        {`${item.brand} ${item.sub_brand} (${item.year})\n`}
                      </Text>
                      {`Placa: ${item.plate}\n`}
                      {`Número económico: ${item.economic_number}\n`}
                    </Text>
                  </View>
                  <View style={styles.chevronView}>
                    <ChevronRight color={styles.chevron.color} />
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          )}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <EmptyScreen
                caption="No hay vehículos en esta flotilla"
                buttonCaption="Añadir vehículos"
                retryFunction={
                  canAddFleet
                    ? () =>
                        router.push("./edit_vehicles", {
                          relativeToDirectory: true,
                        })
                    : undefined
                }
              />
            </View>
          }
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
}));
