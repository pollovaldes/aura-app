import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import ScrollableFormContainer from "@/features/details/route_wizard/ScrollableFormContainer";
import { router, Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Index() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Nueva ruta",
        }}
      />
      <ScrollableFormContainer>
        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title="Inicia una nueva ruta" />
            <Text style={styles.subtitle}>A continuación deberás llenar los campos requeridos</Text>
          </View>
          <View style={styles.group}>
            <FormButton
              title="Continuar"
              onPress={() => router.push("./title_description", { relativeToDirectory: true })}
            />
          </View>
        </View>
      </ScrollableFormContainer>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
}));
