import { router, Stack } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchProvider, useSearch } from "@/context/SearchContext";

export default function Layout() {
  
  return (
    // Wrap the Stack with SearchProvider to provide search context to all screens
    <SearchProvider>
      <SearchConsumer />
    </SearchProvider>
  );
}

//Arturo, resuleve ya porfavor JAJAJAJJAJJ. La navegacion no sirve 
function SearchConsumer() {
  const { styles } = useStyles(stylesheet);
  const { setSearchQuery } = useSearch();

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
          headerShown: true,
          headerTitle: "Seleccionar Camiones",
          headerSearchBarOptions: {
            placeholder: 'Search name or number',
            hideWhenScrolling: false,
            onChangeText: (event) =>
              setSearchQuery("ATMS", event.nativeEvent.text),
          },
        }}
      />
      <Stack.Screen
        name="STMS"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Seleccionar Camiones",
          headerSearchBarOptions: {
            placeholder: 'Search name or number',
            hideWhenScrolling: false,
            onChangeText: (event) =>
              setSearchQuery("STMS", event.nativeEvent.text),
          },
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Asignar camión",
          headerShown: true, // Asegura que el header se muestre
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style = {({pressed}) => [{ opacity: pressed ? 0.5 : 1 }]}>
              <View style={styles.closeButtonContainer}>
                <MaterialIcons
                  name="arrow-back-ios"
                  size={24}
                  color={styles.closeButton.color}
                />
                <Text style={styles.closeButton}>
                  Info
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
    color: theme.headerButtons.color,
    fontSize: 18,
    textAlign: "left",
  },
  closeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
}));
