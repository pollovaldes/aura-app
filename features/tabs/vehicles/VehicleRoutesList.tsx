import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { Link, router, Stack } from "expo-router";
import { Plus, RotateCw } from "lucide-react-native";
import React from "react";
import { Button, Platform, View } from "react-native";

export default function VehichleRoutesList() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton Icon={Plus} text="Nueva ruta" onPress={() => router.push("/tab/route_wizard")} />
              <ActionButton onPress={() => {}} Icon={RotateCw} text="Actualizar" show={Platform.OS === "web"} />
            </ActionButtonGroup>
          ),
        }}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Link href="./1" asChild relativeToDirectory>
          <Button title="Ir a detalles" />
        </Link>
      </View>
    </>
  );
}
