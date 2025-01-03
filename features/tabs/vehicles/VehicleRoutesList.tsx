import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import Modal from "@/components/Modal/Modal";
import { Link, router, Stack } from "expo-router";
import { Plus, RotateCw } from "lucide-react-native";
import React, { useState } from "react";
import { Button, Platform, View } from "react-native";
import { AddRouteModal } from "./modals/addRouteModal/AddRouteModal";

type ModalType = "create_route" | null;

export default function VehichleRoutesList() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <Modal close={closeModal} isOpen={activeModal === "create_route"}>
        <AddRouteModal close={closeModal} />
      </Modal>

      <Stack.Screen
        options={{
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton Icon={Plus} text="Nueva ruta" onPress={() => setActiveModal("create_route")} />
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
