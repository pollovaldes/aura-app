import { router, Stack } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
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
              <View style={styles.closeButtonContainer}>
                <MaterialIcons
                  name="arrow-back-ios"
                  size={24}
                  color={styles.closeButton.color}
                />
                <Text style={styles.closeButton} onPress={() => router.back()}>
                  Atras
                </Text>
              </View>
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
  },
  closeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
}));
