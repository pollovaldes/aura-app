import { router, Stack } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { MaterialIcons } from "@expo/vector-icons";

export default function Layout() {
  const { styles } = useStyles(stylesheet);


  //Arturo, resuleve ya porfavor JAJAJAJJAJJ. La navegacion no sirve 

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerBackTitleVisible: true,
      }}
    >
      <Stack.Screen
        name="ATMS"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Asignar camión",
          headerShown: true, // Asegura que el header se muestre
          headerLeft: () => (
            <Pressable onPress={() => { }}>
              <Text style={styles.closeButton} onPress={() => router.back()}>
                <MaterialIcons 
                  name="chevron-left" 
                  size={30} 
                  color = {styles.closeButton.color}
                /> 
                Cerrar
              </Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "left",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
}));
