/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { View, Text, Button, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

const index = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>
        La ruta / (esta) tendría que ser el landing page, podría ser la página
        de autenticación
      </Text>
      <Pressable onPress={() => router.replace("/trucks")}>
        <Text style={{ color: "blue" }}>
          Ir a la app (/trucks) - la primera pestaña
        </Text>
      </Pressable>
    </View>
  );
};

export default index;
