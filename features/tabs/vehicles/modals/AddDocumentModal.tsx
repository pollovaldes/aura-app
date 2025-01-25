// ChangeImageModal.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Switch, ScrollView, FlatList, Button } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { supabase } from "@/lib/supabase";
import FormInput from "@/components/Form/FormInput";
import {
  ArrowUpFromLine,
  File,
  RotateCw,
  Scroll,
  User as UserIcon,
  UserRoundPen,
  Users,
  Users2,
  X,
} from "lucide-react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { decode } from "base64-arraybuffer";
import { Fleet, User, Vehicle } from "@/types/globalTypes";
import Toast from "react-native-toast-message";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { colorPalette } from "@/style/themes";
import { RadioButton } from "@/components/radioButton/RadioButton";
import { useFleets } from "@/hooks/useFleets";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { SimpleList } from "@/components/simpleList/SimpleList";
import UserThumbnail from "@/components/people/UserThumbnail";
import { getRoleLabel } from "@/features/global/functions/getRoleLabel";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import Form from "@/app/auth/Form";

interface AddDocumentModalProps {
  closeModal: () => void;
  refreshDocuments: () => void;
  vehicle: Vehicle;
}

export function AddDocumentModal({ closeModal, refreshDocuments, vehicle }: AddDocumentModalProps) {
  const { styles } = useStyles(stylesheet);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentIsUploading, setDocumentIsUploading] = useState(false);
  const [documentDatabaseIsUploading, setDocumentDatabaseIsUploading] = useState(false);
  const [pickedDocument, setPickedDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [documentPickingIsLoading, setDocumentPickingIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("all");
  const { areFleetsLoading, fetchFleets, fleets } = useFleets();

  const showToast = (title: string, caption: string) => {
    Toast.show({
      type: "alert",
      text1: title,
      text2: caption,
    });
  };

  const handlePickDocument = async () => {
    setDocumentPickingIsLoading(true);
    const pickerResult = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });

    if (pickerResult.canceled) {
      setDocumentPickingIsLoading(false);
      setPickedDocument(null);
      return;
    }

    setPickedDocument(pickerResult.assets[0]);
    setDocumentPickingIsLoading(false);
  };

  const uploadDocument = async (documentId: string) => {
    setDocumentIsUploading(true);

    if (!pickedDocument) {
      showToast("Error", "No se seleccionó un archivo para subir");
      setDocumentIsUploading(false);
      return false;
    }

    let fileData;
    if (Platform.OS === "web") {
      fileData = pickedDocument.file;
    } else {
      fileData = await FileSystem.readAsStringAsync(pickedDocument.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      fileData = decode(fileData);
    }

    if (!fileData) {
      showToast("Error", "Ocurrió un error al leer el archivo seleccionado");
      setDocumentIsUploading(false);
      return false;
    }

    const { error } = await supabase.storage.from("documents").upload(`${vehicle.id}/${documentId}`, fileData, {
      contentType: pickedDocument.mimeType,
    });

    if (error) {
      showToast("Error", "Ocurrió un error al subir el archivo");
      console.error("Error uploading file", error);
      setDocumentIsUploading(false);
      return false;
    }

    showToast("Éxito", "El archivo se subió correctamente");
    setDocumentIsUploading(false);
    return true;
  };

  const handleAddDocumentToDatabase = async () => {
    setDocumentDatabaseIsUploading(true);

    const { data, error } = await supabase
      .from("vehicle_documentation_sheet")
      .insert([
        {
          vehicle_id: vehicle.id,
          title: documentTitle,
          description: documentDescription,
        },
      ])
      .select()
      .single();

    if (error) {
      showToast("Error", "Ocurrió un error al agregar el documento a la base de datos");
      console.error("Error adding document to database", error);
      setDocumentDatabaseIsUploading(false);
      return;
    }

    const uploadSuccess = await uploadDocument(data.document_id);

    if (!uploadSuccess) {
      const { error } = await supabase.from("vehicle_documentation_sheet").delete().eq("document_id", data.document_id);
      setDocumentDatabaseIsUploading(false);
      return;
    }

    setDocumentDatabaseIsUploading(false);
    refreshDocuments();
    closeModal();
  };

  const handleRadioChange = async (option: string) => {
    setSelectedOption(option);

    switch (option) {
      case "all":
        break;
      case "admin":
        break;
      case "custom":
        break;
      default:
        console.warn("Invalid option");
    }
  };

  const findUsersByVehicleID = (fleets: Fleet[] | null, vehicleID: string): User[] | null => {
    if (!fleets) return null;

    // Filter fleets that contain the vehicleID in fleets_vehicles
    const matchingFleets = fleets.filter((fleet) =>
      fleet.vehicles.some((fleetVehicle) => fleetVehicle.id === vehicleID)
    );

    console.log("Matching Fleets:", matchingFleets); // Debugging

    // Extract users from the matching fleets
    const users = matchingFleets.flatMap((fleet) => fleet.users);

    console.log("Found Users:", users); // Debugging

    return users.length > 0 ? users : null;
  };

  const users = findUsersByVehicleID(fleets, vehicle.id);

  console.log(vehicle.id);

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Agregar un nuevo documento" />
        <Text style={styles.subtitle}>Llena los campos para agregar un nuevo documento a este vehículo.</Text>
      </View>
      <View style={styles.group}>
        <SegmentedControl
          values={["Archivo", "Permisos y visualización"]}
          selectedIndex={selectedIndex}
          onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
        />
      </View>

      {selectedIndex === 0 ? (
        <View style={styles.group}>
          <FormInput
            placeholder="Ej. Seguro de auto"
            inputMode="text"
            style={styles.textInput}
            placeholderTextColor={styles.textInput.placehoolderTextColor}
            onChangeText={setDocumentTitle}
            value={documentTitle}
            description="Nombre amigable del documento (obligatorio)"
            editable={!documentDatabaseIsUploading && !documentIsUploading && !documentPickingIsLoading}
          />
          <FormInput
            placeholder="Ej. Póliza"
            inputMode="text"
            style={styles.textInput}
            placeholderTextColor={styles.textInput.placehoolderTextColor}
            onChangeText={setDocumentDescription}
            value={documentDescription}
            description="Descripción del documento"
            editable={!documentDatabaseIsUploading && !documentIsUploading && !documentPickingIsLoading}
          />
          <FormButton
            title="Seleccionar archivo"
            onPress={handlePickDocument}
            isLoading={documentPickingIsLoading}
            Icon={File}
            isDisabled={documentIsUploading || documentDatabaseIsUploading || documentPickingIsLoading}
          />

          {pickedDocument && (
            <View style={styles.filePreviewContainer}>
              <View>
                <TouchableOpacity onPress={() => setPickedDocument(null)}>
                  <X color={styles.fileIcon.color} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <File color={styles.fileIcon.color} size={50} />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-around",
                    width: "75%",
                  }}
                >
                  <Text style={styles.fileText} ellipsizeMode="middle" numberOfLines={2}>
                    {pickedDocument.name}
                  </Text>
                  <Text style={styles.fileSubtitle}>{((pickedDocument.size ?? 0) / 1000000).toFixed(2)} MB</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.section}>
          <GroupedList header="Permisos" isInModal>
            <Row
              icon={Users}
              backgroundColor={colorPalette.cyan[500]}
              title="Visible para todos"
              caption="Todos los usuarios de la flotilla pueden ver este documento, pero solo los administradores pueden editarlo"
              trailing={<RadioButton selected={selectedOption === "all"} onPress={() => handleRadioChange("all")} />}
              onPress={() => handleRadioChange("all")}
            />
            <Row
              icon={UserIcon}
              backgroundColor={colorPalette.yellow[500]}
              title="Solo administradores"
              caption="Solo los administradores pueden ver y editar este documento"
              trailing={
                <RadioButton selected={selectedOption === "admin"} onPress={() => handleRadioChange("admin")} />
              }
              onPress={() => handleRadioChange("admin")}
            />
            <Row
              icon={UserRoundPen}
              backgroundColor={colorPalette.green[500]}
              title="Personalizado"
              caption="Espceifica los usuarios de la flotilla que pueden ver y editar este documento"
              trailing={
                <RadioButton selected={selectedOption === "custom"} onPress={() => handleRadioChange("custom")} />
              }
              onPress={() => handleRadioChange("custom")}
            />
          </GroupedList>

          {selectedOption === "custom" && (
            <>
              <GroupedList isInModal header="Usuarios">
                <Row>
                  <View style={styles.fleetLoadingContainer}>
                    {Platform.OS !== "ios" && (
                      <ActionButtonGroup>
                        <ActionButton Icon={RotateCw} text="Actualizar" onPress={fetchFleets} />
                      </ActionButtonGroup>
                    )}
                    {areFleetsLoading ? (
                      <FetchingIndicator caption="Obteniendo flotillas" isInModal />
                    ) : !fleets ? (
                      <ErrorScreen
                        caption="No se encontraron flotillas"
                        retryFunction={fetchFleets}
                        buttonCaption="Reintentar"
                      />
                    ) : !users ? (
                      <EmptyScreen
                        caption="No hay ningún usuario asociado a las flotillas que incluyan este vehículo."
                        retryFunction={fetchFleets}
                        buttonCaption="Reintentar"
                      />
                    ) : (
                      <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ width: "100%" }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                      >
                        <FlatList
                          contentInsetAdjustmentBehavior="automatic"
                          data={users}
                          keyExtractor={(item) => item.id}
                          refreshing={areFleetsLoading}
                          onRefresh={fetchFleets}
                          renderItem={({ item }) => (
                            <SimpleList
                              hideChevron
                              relativeToDirectory
                              trailing={
                                <View style={{ flexDirection: "column", gap: 16 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignContent: "center",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
                                    <RadioButton selected={true} onPress={() => {}} />
                                    <Text style={styles.listSubtitle}>Solo ver</Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignContent: "center",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
                                    <RadioButton selected={true} onPress={() => {}} />
                                    <Text style={styles.listSubtitle}>Ver y editar</Text>
                                  </View>
                                </View>
                              }
                              leading={<UserThumbnail userId={item.id} size={60} />}
                              content={
                                <>
                                  <Text
                                    style={styles.listText}
                                  >{`${item.name} ${item.father_last_name} ${item.mother_last_name}`}</Text>
                                  <Text style={styles.listSubtitle}>{`Rol: ${getRoleLabel(item.role)}`}</Text>
                                </>
                              }
                            />
                          )}
                          ListEmptyComponent={<EmptyScreen caption="Ninguna flotilla por aquí." />}
                        />
                      </ScrollView>
                    )}
                  </View>
                </Row>
              </GroupedList>
            </>
          )}
        </View>
      )}

      <View style={styles.group}>
        <FormButton
          Icon={ArrowUpFromLine}
          title="Agregar documento"
          onPress={handleAddDocumentToDatabase}
          isLoading={documentIsUploading || documentDatabaseIsUploading}
          isDisabled={!pickedDocument || documentTitle === ""}
        />
        <Text style={styles.subtitle}>
          {documentIsUploading
            ? "Subiendo documento al servidor..."
            : documentDatabaseIsUploading && "Agregando documento a la base de datos..."}
        </Text>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  groupedListInModalContainer: {
    backgroundColor: theme.ui.colors.card,
    paddingVertical: 16,
    borderRadius: 6,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  fileSubtitle: {
    color: theme.textPresets.main,
  },
  fileText: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  coverImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
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
  buttonIcon: {
    color: theme.textPresets.inverted,
  },
  fileIcon: {
    color: theme.textPresets.subtitle,
  },
  filePreviewContainer: {
    borderColor: theme.ui.colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  fleetLoadingContainer: {
    width: "100%",
    height: 450,
    backgroundColor: theme.components.groupedListInModal.backgroundColor,
    borderRadius: 10,
  },
  listText: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  listSubtitle: {
    color: theme.textPresets.subtitle,
    fontSize: 15,
  },
}));
