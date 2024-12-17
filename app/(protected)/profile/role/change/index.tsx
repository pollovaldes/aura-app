import { RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { Stack, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import Row from "@/components/grouped-list/Row";
import { UserRound, UserRoundPen } from "lucide-react-native";
import GroupedList from "@/components/grouped-list/GroupedList";
import { colorPalette } from "@/style/themes";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";
import { ChipSelecto } from "@/components/radioButton/ChipSelecto";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("NONE");

  useEffect(() => {
    navigation.setOptions({ presentation: "modal" });
  }, [navigation]);

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <FetchingIndicator
          caption={isProfileLoading ? "Cargando perfil" : "Cargando sesión"}
        />
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "DRIVER":
        return "Conductor";
      case "BANNED":
        return "Bloqueado";
      case "NO_ROLE":
        return "Sin rol";
      case "OWNER":
        return "Dueño";
      default:
        return "Indefinido";
    }
  };

  const handleRadioChange = (option: string) => {
    setSelectedOption(option);

    switch (option) {
      case "ADMIN":
        break;
      case "DRIVER":
        break;
      default:
        alert("Opción inválida");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cambio de rol",
          headerLargeTitle: false,
          headerRight: undefined,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets={true}
        refreshControl={
          <RefreshControl
            refreshing={isProfileLoading}
            onRefresh={fetchProfile}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <Text style={styles.text}>{getRoleLabel(profile.role)}</Text>
            <Text style={styles.subtitle}>{profile.role}</Text>
          </View>
          <GroupedList>
            <Row
              title="Rol actual"
              icon={<UserRound size={24} color="white" />}
              color={colorPalette.cyan[500]}
              trailingType="chevron"
              caption={getRoleLabel(profile.role)}
              showChevron={false}
              pressedStyle={false}
            />
            <Row
              title="Selecciona el nuevo rol"
              icon={<UserRoundPen size={24} color="white" />}
              color={colorPalette.green[500]}
              trailingType="chevron"
              showChevron={false}
              pressedStyle={false}
            />
            <Row
              trailingType="chevron"
              disabled
              title=""
              onPress={() => {}}
              showChevron={false}
            >
              <View style={styles.roleChangeContainer}>
                <ChipSelecto
                  selected={selectedOption === "ADMIN"}
                  onPress={() => handleRadioChange("ADMIN")}
                  caption="Administrador"
                />
                <ChipSelecto
                  selected={selectedOption === "DRIVER"}
                  onPress={() => handleRadioChange("DRIVER")}
                  caption="Conductor"
                />
              </View>
            </Row>
          </GroupedList>
          <View style={styles.inputContainer}>
            <FormInput description="Describe el motivo del cambio" multiline />
            <FormButton title="Aceptar" onPress={() => {}} />
          </View>
          <View />
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
  roleChangeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  inputContainer: {
    marginHorizontal: 6,
    flexDirection: "column",
    gap: 16,
    borderRadius: 5,
    padding: 12,
  },
  dateContainer: {
    marginHorizontal: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    borderRadius: 5,
    backgroundColor: theme.textInput.backgroundColor,
    padding: 12,
  },
  text: {
    color: theme.textPresets.main,
    fontSize: 25,
    fontWeight: "bold",
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    fontSize: 18,
    textAlign: "center",
  },
}));
