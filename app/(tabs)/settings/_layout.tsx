/*
 * _layout.tsx - Created on Mon Jun 24 2024
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, title: "Configuración" }} />
  );
}
