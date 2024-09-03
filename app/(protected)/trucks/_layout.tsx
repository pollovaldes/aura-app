import React from "react";
import { Stack } from "expo-router";
import { Platform, Text } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerBlurEffect: "regular",
        headerTransparent: Platform.OS === "ios" ? true : false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Camiones",
          headerSearchBarOptions: {
            placeholder: 'Search name or number',
            hideWhenScrolling: false,
          },
        }}
      />
    </Stack>
  );
}
