import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import useDocuments from "@/hooks/useDocuments";
import useProfile from "@/hooks/useProfile";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, SafeAreaView, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import WebView from "react-native-webview";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { documents, areDocumentsLoading, fetchDocuments } = useDocuments();
  const [isWebViewLoading, setIsWebViewLoading] = useState(false);
  const headerHeight = useHeaderHeight();

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando perfil y permisos" />
      </>
    );
  }

  if (areDocumentsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando documentos" />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (documents === null) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption={`Ocurrió un error y no \npudimos cargar los documentos`}
          buttonCaption="Reintentar"
          retryFunction={fetchDocuments}
        />
      </>
    );
  }

  const document = documents.find(
    (Document) => Document.document_id === documentId
  );

  if (!document) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchDocuments}
        />
      </>
    );
  }

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";

  const fileUrl =
    "https://www.medicinaconductual-unam-fesi.org/uploads/1/0/3/4/103420148/elaboraci%C3%B3n_de_nota_soap_y_examen_mental.pdf";
  const embeddedUrl = `http://docs.google.com/gview?embedded=true&url=${fileUrl}`;

  console.log("embeddedUrl", embeddedUrl);

  return (
    <>
      <Stack.Screen
        options={{
          title: document.title,
          headerLargeTitle: false,
          // headerRight: () =>
          //   canEdit && (
          //     <Pressable onPress={() => setActiveModal("add_document")}>
          //       <Plus color={styles.plusIcon.color} />
          //     </Pressable>
          //   ),
        }}
      />
      {isWebViewLoading && (
        <View style={styles.container}>
          <LoadingScreen caption="Cargando documento" />
        </View>
      )}
      <WebView
        javaScriptEnabled={true}
        source={{ uri: Platform.OS === "ios" ? fileUrl : embeddedUrl }}
        onLoadStart={(syntheticEvent) => {
          setIsWebViewLoading(true);
        }}
        onLoadEnd={(syntheticEvent) => {
          setIsWebViewLoading(false);
        }}
        style={{
          marginTop: Platform.OS === "ios" ? headerHeight : 0,
        }}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 10000, // This is a hack to make the LoadingScreen fill the screen
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.textPresets.main,
  },
}));
