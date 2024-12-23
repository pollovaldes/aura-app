import { ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { Stack, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import Row from "@/components/grouped-list/Row";
import { UserRound, UserRoundPen } from "lucide-react-native";
import GroupedList from "@/components/grouped-list/GroupedList";
import { colorPalette } from "@/style/themes";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";
import { ChipSelecto } from "@/components/radioButton/ChipSelecto";

export default function ProfileRoleChange() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("NONE");

  useEffect(() => {
    navigation.setOptions({ presentation: "modal" });
  }, [navigation]);

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
      <ScrollView contentInsetAdjustmentBehavior="automatic" automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <Text style={styles.text}>Solicitud en progreso</Text>
            <Text style={styles.subtitle}>
              Se inició una solicitud para el cambio de rol al puesto de conductor el 17 de diciembre de 2024. A
              continuación podrás ver la solicitud.
            </Text>
          </View>
          <GroupedList>
            <Row
              title="Rol actual"
              icon={UserRound}
              backgroundColor={colorPalette.cyan[500]}
              caption={getRoleLabel(profile.role)}
              hasTouchableFeedback={false}
              hideChevron={true}
            />
            <Row
              title="Selecciona el nuevo rol"
              icon={UserRoundPen}
              backgroundColor={colorPalette.green[500]}
              hasTouchableFeedback={false}
              hideChevron={true}
            />
            <Row>
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
    width: "100%",
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
