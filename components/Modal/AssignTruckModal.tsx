import Modal from "./Modal";
import { View, Text, TextInput, Alert } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "../Form/FormButton";
import usePeople from "@/hooks/peopleHooks/usePeople";
import useTruck from "@/hooks/truckHooks/useTruck";
import TrucksList from "../trucks/TrucksList";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};



export default function AssignTruckModal({
  isOpen,
  closeModal,
}: ModalProps) {
  const { styles } = useStyles(stylesheet);
  const { people } = usePeople({ justOne: false, isComplete: false });
  const { trucks } = useTruck({ justOne: false, isComplete: false });



  return (
    <Modal isOpen={isOpen}>
      <View style={styles.modalContainer}>
        <Text style={styles.closeButton} onPress={closeModal}>
          Cerrar
        </Text>
        {/* Form goes here */}
        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title={`Asignar camion a conductor`} />
            <Text style={styles.subtitle}>
              <TrucksList/>
            </Text>
          </View>
          <View style={styles.group}>
            <FormButton
              title="Continuar"
              onPress={() => {}}
              isLoading={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalContainer: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  logo: {
    color: theme.colors.inverted,
    width: 180,
    height: 60,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
}));