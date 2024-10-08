import React from "react";
import { Stack } from "expo-router";
import { Platform, View } from "react-native";
import { SearchProvider, useSearch } from "@/context/SearchContext"; // Import the SearchContext

export const unstable_settings = {
  initialRouteName: "index",
};

export default function _layout() {
  return (
    // Wrap the entire layout with SearchProvider to provide search context
    <SearchProvider>
      <SearchConsumer />
    </SearchProvider>
  );
}

// Separate component to consume the search context
function SearchConsumer() {
  const { setSearchQuery } = useSearch(); // Use search context to get setSearchQuery

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerLargeTitle: true,
        headerBlurEffect: "regular",
        headerTransparent: Platform.OS === "ios" ? true : false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Personas",
          headerSearchBarOptions: {
            placeholder: "Search name or number",
            hideWhenScrolling: false,
            onChangeText: (event) =>
              setSearchQuery("people", event.nativeEvent.text), // Use the context to update the search query for "personas"
          },
        }}
      />
    </Stack>
  );
}
