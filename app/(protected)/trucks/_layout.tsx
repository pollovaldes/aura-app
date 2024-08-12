import React from "react";
import { Stack } from "expo-router";

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
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Camiones",
        }}
      />
    </Stack>
  );
}
