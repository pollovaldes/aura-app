import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { FlatList, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { Boxes } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import { useFleets } from "@/hooks/useFleets";
import React from "react";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";

export default function FleetDetailsEditVehicles() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { fleetId } = useLocalSearchParams<{ fleetId: string }>();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets(fleetId);
  const headerHeight = useHeaderHeight();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ presentation: "modal" });
  }, [navigation]);

  if (areFleetsLoading) {
    return <FetchingIndicator caption="Cargando flotillas" />;
  }

  if (!fleets) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar las flotillas"
        buttonCaption="Reintentar"
        retryFunction={fetchFleets}
      />
    );
  }

  if (fleets.length === 0) {
    return (
      <UnauthorizedScreen
        caption="No tienes acceso a este recurso"
        buttonCaption="Reintentar"
        retryFunction={fetchFleets}
      />
    );
  }

  const canAddFleet = profile.role === "ADMIN" || profile.role === "OWNER";

  const fleet = fleets[0];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Administrar vehículos",
          headerRight: undefined,
          headerLargeTitle: false,
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={fleet.users}
        keyExtractor={(item) => item.id}
        refreshing={areFleetsLoading}
        onRefresh={fetchFleets}
        style={{ marginBottom: 36 }}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <GroupedList>
              <Row title={item.name} icon={Boxes} backgroundColor={colorPalette.cyan[500]} />
              <Row disabled title="" onPress={() => {}} hideChevron>
                <Text style={styles.description}>{item.father_last_name}</Text>
              </Row>
            </GroupedList>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ marginTop: 100 }}>
            <EmptyScreen
              caption="No hay personas en esta flotilla"
              buttonCaption="Añadir personas"
              retryFunction={fetchFleets}
            />
          </View>
        }
      />
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
    width: "98.5%",
    marginHorizontal: "auto",
    marginVertical: 6,
  },
}));
