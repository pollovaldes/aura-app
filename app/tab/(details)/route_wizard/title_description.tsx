import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import ScrollableFormContainer from "@/features/details/route_wizard/ScrollableFormContainer";
import { router, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Index() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Título y descripción",
        }}
      />
      <ScrollableFormContainer>
        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title="Cuéntanos un poco más sobre la ruta que harás" />
          </View>
          <View style={styles.group}>
            <FormInput description="Nombre corto que describa la ruta" />
          </View>
          <View style={styles.group}>
            <FormInput description="Descripción breve" multiline />
          </View>
          <View style={styles.group}>
            <FormButton title="Continuar" onPress={() => router.push("./start_location")} />
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
