/*
 * _layout.web.tsx - Created on Mon Jun 24 2024
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Stack, Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="trucks" options={{ title: "Camiones" }} />
      <Tabs.Screen name="people" options={{ title: "Personas", href: null }} />
      <Tabs.Screen name="notifications" options={{ title: "Notificaciones" }} />
      <Tabs.Screen name="settings" options={{ title: "Configuración" }} />
    </Tabs>
  );
}
