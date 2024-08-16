/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import TermsAndPrivacy from "@/app/auth/TermsAndPrivacy";
import { FormButton } from "@/components/form/FormButton";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import useUserName from "@/hooks/useUserName";
import { supabase } from "@/lib/supabase";
import { ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Page() {
  const { styles } = useStyles(stylesheet);

  const signOut = async () => {
    let { error } = await supabase.auth.signOut();
  };

  const { name } = useUserName();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <GroupedList
          footer="Para obtener acceso completo a la aplicación, asegúrate de completar estos puntos necesarios. Aunque ya tengas una cuenta, esta información es crucial para ofrecerte acceso completo."
          header="Acceso a la App"
        >
          <Row
            title="Datos personales"
            trailingType="chevron"
            caption={name ? "Completo" : "Sin completar"}
          />
          <Row title="Rol" trailingType="chevron" caption="Sin rol" />
        </GroupedList>
        <GroupedList
          header="Seguridad y acceso"
          footer="Explora las opciones disponibles para proteger tu cuenta. Considera que las opciones de correo electrónico y contraseña solo estarán activas si la identidad de correo electrónico está vinculada."
        >
          <Row title="Correo electrónico" trailingType="chevron" />
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
        <GroupedList
          header="Zona de peligro"
          footer="Cerrar tu sesión no eliminará nada, pero deberás iniciar sesión de nuevo."
        >
          <Row title="Eliminar cuenta" trailingType="chevron" />
          <Row title="Cerrar sesión" trailingType="chevron" />
        </GroupedList>
        <GroupedList header="Créditos y extras" footer="">
          <Row title="Licensias de código abierto" trailingType="chevron" />
          <Row title="Reporta un error" trailingType="chevron" />
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
}));
