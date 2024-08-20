/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import FormTitle from "@/app/auth/FormTitle";
import TermsAndPrivacy from "@/app/auth/TermsAndPrivacy";
import RegistrationForm from "@/assets/registrationForm/RegistrationForm";
import { FormButton } from "@/components/Form/FormButton";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import Modal from "@/components/Modal/Modal";
import useRegistration from "@/hooks/useRegistration";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Page() {
  const { styles } = useStyles(stylesheet);

  const [modal, setModal] = useState(false);

  const signOut = async () => {
    let { error } = await supabase.auth.signOut();
  };

  const { name, email, phone, registered, isLoading } = useRegistration();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Modal isOpen={modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={() => setModal(false)}>
            Cerrar
          </Text>

          <RegistrationForm closeModal={() => setModal(false)}/>
          
        </View>
      </Modal>
      <View style={styles.container}>
        <GroupedList
          footer="Para obtener acceso completo a la aplicación, asegúrate de completar estos puntos necesarios. Aunque ya tengas una cuenta, esta información es crucial para ofrecerte acceso completo."
          header="Acceso a la App"
        >
          <Row
            title="Datos personales"
            trailingType="chevron"
            disabled={isLoading}
            isLoading={isLoading}
            caption={name ? "Completo ✅" : "Sin completar ⚠️"}
            onPress={() => setModal(true)}
          />
          <Row title="Rol" trailingType="chevron" caption="Sin rol ⚠️" />
        </GroupedList>
        <GroupedList
          header="Seguridad y acceso"
          footer="Explora las opciones disponibles para proteger tu cuenta. Considera que las opciones de correo electrónico y contraseña solo estarán activas si la identidad de correo electrónico está vinculada."
        >
          <Row title="Correo electrónico" trailingType="chevron" caption={email ? "Completo ✅" : "Sin completar ⚠️"}/>
          <Row title="Contraseña" trailingType="chevron" />
          <Row title="Dispositivos y sesiones" trailingType="chevron" />
          <Row title="2FA" trailingType="chevron" caption="No configurado" />
        </GroupedList>
        <GroupedList
          header="Identidades"
          footer="Vincula tus cuentas de diferentes servicios a un único perfil para centralizar tu información y acceso."
        >
          <Row
            title="Correo electrónico"
            trailingType="chevron"
            caption="Vinculado"
          />
          <Row
            title="Número de celular"
            trailingType="chevron"
            caption="Sin vincular"
          />
          <Row title="Apple" trailingType="chevron" caption="Sin vincular" />
          <Row title="Google" trailingType="chevron" caption="Sin vincular" />
        </GroupedList>

        <GroupedList>
          <Row title="Cerrar sesión" trailingType="chevron" onPress={signOut} />
        </GroupedList>
        <GroupedList header="Créditos y extras" footer="">
          <Row title="Licensias de código abierto" trailingType="chevron" />
          <Row title="Reporta un error" trailingType="chevron" />
        </GroupedList>
        <GroupedList header="Zona de peligro">
          <Row title="Eliminar cuenta" trailingType="chevron" />
        </GroupedList>
        <View style={styles.termsAndPrivacy}>
          <TermsAndPrivacy />
        </View>
        <View />
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section, //Excepción
  },
  termsAndPrivacy: {
    marginHorizontal: 12,
  },
  modalContainer: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  text: {
    color: theme.textPresets.main,
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
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
}));
