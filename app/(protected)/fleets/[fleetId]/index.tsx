import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { FlatList, Platform, Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { Boxes, Plus } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import useFleets from "@/hooks/useFleets";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import AddFleetModal from "@/components/fleets/AddFleetModal";
import { useHeaderHeight } from "@react-navigation/elements";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";

type ModalType = "add_fleet" | null;

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { fleetId } = useLocalSearchParams<{ fleetId: string }>();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets(fleetId);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
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
      <Modal isOpen={activeModal === "add_fleet"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <AddFleetModal closeModal={closeModal} fetchFleets={fetchFleets} />
        </View>
      </Modal>
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
        style={[{ marginTop: Platform.OS === "ios" ? headerHeight + 0 : 6 }]}
      >
        <SegmentedControl
          values={["Personas", "Vehículos"]}
          selectedIndex={currentTabIndex}
          onChange={(event) =>
            setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)
          }
          style={[styles.segmentedControl, {}]}
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
          style={{ marginBottom: 36 }}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <GroupedList>
                <Row
                  title={item.name}
                  trailingType="chevron"
                  icon={<Boxes size={24} color="white" />}
                  color={colorPalette.cyan[500]}
                />
                <Row
                  trailingType="chevron"
                  disabled
                  title=""
                  onPress={() => {}}
                  showChevron={false}
                >
                  <Text style={styles.description}>
                    {item.father_last_name}
                  </Text>
                </Row>
              </GroupedList>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ marginTop: 100 }}>
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
          style={{ marginBottom: 36 }}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <GroupedList>
                <Row
                  title={item.brand}
                  trailingType="chevron"
                  icon={<Boxes size={24} color="white" />}
                  color={colorPalette.cyan[500]}
                />
                <Row
                  trailingType="chevron"
                  disabled
                  title=""
                  onPress={() => {}}
                  showChevron={false}
                >
                  <Text style={styles.description}>{item.sub_brand}</Text>
                </Row>
              </GroupedList>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ marginTop: 100 }}>
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
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section, //Excepción
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  description: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  text: {
    color: theme.textPresets.main,
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  logo: {
    color: theme.colors.inverted,
    width: 180,
    height: 60,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
  closeButton: {
    color: theme.headerButtons.color,
    fontSize: 18,
    textAlign: "right",
  },
  plusIcon: {
    fontSize: 16,
    color: theme.headerButtons.color,
  },
  segmentedControl: {
    width: "97%",
    margin: "auto",
    marginVertical: 6,
  },
}));
