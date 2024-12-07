import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import FilePickerMenu from "@/components/maintenance/filePickerMenu";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/User";
import { Vehicle } from "@/types/Vehicle";
import { DocumentPickerAsset } from "expo-document-picker";
import { ArrowUpFromLine, File, Plus, Trash2, X } from "lucide-react-native";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { Maintenance } from "@/hooks/useMaintenance";
import { decode } from "base64-arraybuffer";

interface addMaintenanceModalProps {
  closeModal: () => void;
  fetchMaintenance: () => void;
  vehicle: Vehicle;
  profile: User;
}

interface FileItem {
  localId: string;
  description: string;
  document?: DocumentPickerAsset | ImagePicker.ImagePickerAsset | null;
}

export default function AddMaintenance({
  closeModal,
  vehicle,
  profile,
  fetchMaintenance,
}: addMaintenanceModalProps) {
  const { styles } = useStyles(stylesheet);
  const vehicleTitle = `${vehicle.brand ?? ""} ${vehicle.sub_brand ?? ""} (${vehicle.year ?? ""})`;
  const fullName = `${profile.name} ${profile.father_last_name} ${profile.mother_last_name}`;

  const [requestTitle, setRequestTitle] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [newMaintenance, setNewMaintenance] = useState<Maintenance | null>(
    null
  );

  // ================== File picker ==================

  const [fileViews, setFileViews] = useState<FileItem[]>([]);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addFileView = () => {
    setFileViews((prev) => [
      ...prev,
      { localId: generateUniqueId(), description: "" },
    ]);
  };

  const removeFileView = (localId: string) => {
    setFileViews((prev) => prev.filter((file) => file.localId !== localId));
  };

  const updateFileDescription = (localId: string, description: string) => {
    setFileViews((prev) =>
      prev.map((file) =>
        file.localId === localId ? { ...file, description } : file
      )
    );
  };

  // ================== File picker ==================

  const uploadDocumentToStorage = async (
    localId: string,
    maintenanceId: string
  ): Promise<boolean> => {
    const file = fileViews.find((file) => file.localId === localId);

    if (!file || !file.document) {
      alert(
        `No se puede subir el archivo con id: ${localId} porque no se ha seleccionado ninguno`
      );
      return false;
    }

    let fileData;
    if (Platform.OS === "web") {
      fileData = file.document.file;
    } else {
      fileData = await FileSystem.readAsStringAsync(file.document.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("File data: ", fileData);
      fileData = decode(fileData);
      console.log("Decoded file data: ", fileData);
    }

    if (!fileData) {
      alert("No se pudo obtener datos del archivo seleccionado");
      return false;
    }

    const fileName = `${vehicle.id}/${maintenanceId}/${Crypto.randomUUID()}`;
    console.log("Nombre archivo ", fileName);

    const { data, error } = await supabase.storage
      .from("maintenance_files")
      .upload(fileName, fileData, {
        contentType: file.document.mimeType,
      });

    console.log("Data: ", data);

    if (error) {
      alert(
        `Error subiendo archivo con id: ${localId}\nMensaje de error: ${error.message}`
      );
      return false;
    }

    return true;
  };

  const uploadRequest = async (
    vehicle_id: string,
    issued_by: string,
    issued_datetime: string,
    title: string,
    description: string
  ) => {
    setIsUploading(true);

    const { data, error } = await supabase
      .from("maintenance")
      .insert([
        {
          vehicle_id,
          issued_by,
          issued_datetime,
          title,
          description,
          status: "PENDING_REVISION", // Default status
        },
      ])
      .select();

    if (!error && data) {
      const maintenanceId = data[0].id;

      console.log("Antes del for");

      for (const file of fileViews) {
        const success = await uploadDocumentToStorage(
          file.localId,
          maintenanceId
        );
        if (!success) {
          alert("Ocurrió un error subiendo el archivo con id: " + file.localId);
          setIsUploading(false);
          return;
        }
        console.log("Fin de iteración");
      }

      console.log("Despues del for");

      setIsUploading(false);
      fetchMaintenance();
      closeModal();
      return data;
    } else {
      alert(`¡Ocurrió un error!\n${error.message}`);
      setIsUploading(false);
    }

    alert(`¡Ocurrió un error en la función uploadRequest!\n${error}`);
  };

  const handleSelectFile = async (key: string, localId: string) => {
    if (key === "image") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        quality: 0.35,
        selectionLimit: 1,
        videoMaxDuration: 60,
        base64: true,
      });

      if (result.canceled) {
        alert("La selección de imagen fue cancelada");

        setFileViews((prev) =>
          prev.map((file) =>
            file.localId === localId ? { ...file, document: null } : file
          )
        );

        return;
      }

      if (result.assets) {
        setFileViews((prev) =>
          prev.map((file) =>
            file.localId === localId
              ? { ...file, document: result.assets[0] }
              : file
          )
        );

        //IMAGES
        console.log(result.assets[0]);
      } else {
        setFileViews((prev) =>
          prev.map((file) =>
            file.localId === localId ? { ...file, document: null } : file
          )
        );
      }
    } else if (key === "file" || key === "web") {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        alert("La selección de archivo fue cancelada");

        setFileViews((prev) =>
          prev.map((file) =>
            file.localId === localId ? { ...file, document: null } : file
          )
        );

        return;
      }

      if (result.assets) {
        setFileViews((prev) =>
          prev.map((file) =>
            file.localId === localId
              ? { ...file, document: result.assets[0] }
              : file
          )
        );
        //FILES
        console.log(result.assets[0]);
      } else {
        setFileViews((prev) =>
          prev.map((file) =>
            file.localId === localId ? { ...file, document: null } : file
          )
        );
      }
    }
  };

  const handleDropDownSelect = (key: string, localId: string) => {
    handleSelectFile(key, localId);
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title={"Generar solicitud de mantenimiento"} />
        <Text style={styles.subtitle}>Llena el siguiente formulario</Text>
      </View>
      <View style={styles.group}>
        <FormInput
          description="Vehículo al que se le solicita el mantenimiento:"
          placeholder={vehicleTitle}
          editable={false}
        />
        <FormInput
          description="Quien solicita el mantenimiento:"
          placeholder={fullName}
          editable={false}
        />
      </View>
      <View style={styles.group}>
        <FormTitle title={"Información general"} />
        <FormInput
          description="Título de la solicitud"
          placeholder="Ej. Cambio de aceite"
          onChangeText={setRequestTitle}
          editable={!isUploading}
        />
        <FormInput
          description="Descripción detallada"
          placeholder="Incluye detalles como el problema, la solución esperada, fechas, etc."
          onChangeText={setRequestDescription}
          multiline
          editable={!isUploading}
        />
      </View>
      <View style={styles.group}>
        <FormTitle title={"Agregar archivos"} />
        <Text style={styles.subtitle}>
          Adjunta imágenes o videos que respalden tu solicitud de ser necesario
        </Text>
        {fileViews.map((item) => (
          <View key={item.localId} style={styles.fileContainer}>
            <View style={styles.twoPaneContainer}>
              {Platform.OS !== "web" && (
                <FilePickerMenu
                  items={[
                    { key: "image", title: "Seleccionar desde la galeria" },
                    { key: "file", title: "Seleccionar desde archivos" },
                  ]}
                  onSelect={(key) => handleDropDownSelect(key, item.localId)}
                  trigger={
                    <FormButton
                      title="Seleccionar archivo"
                      onPress={() => {}}
                      icon={() => (
                        <ArrowUpFromLine
                          color={styles.selectFileButtonIcon.color}
                        />
                      )}
                    />
                  }
                />
              )}

              {Platform.OS === "web" && (
                <FormButton
                  title="Seleccionar archivo"
                  onPress={() => handleSelectFile("web", item.localId)}
                  icon={() => (
                    <ArrowUpFromLine
                      color={styles.selectFileButtonIcon.color}
                    />
                  )}
                />
              )}
              {item.document && (
                <View style={styles.filePreviewContainer}>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        setFileViews((prev) =>
                          prev.map((file) =>
                            file.localId === item.localId
                              ? { ...file, document: null }
                              : file
                          )
                        )
                      }
                    >
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
                      <Text
                        style={styles.fileText}
                        ellipsizeMode="middle"
                        numberOfLines={2}
                      >
                        {item.document && "name" in item.document
                          ? item.document.name
                          : "Archivo seleccionado desde la galería"}
                      </Text>
                      <Text style={styles.fileSubtitle}>
                        {item.document && "size" in item.document
                          ? ((item.document.size ?? 0) / 1000000).toFixed(2) +
                            " MB"
                          : "Tamaño desconocido"}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <FormInput
                description="Descripción del archivo"
                placeholder="Aquí puedes describir brevemente lo que sucede en la imagen o video."
                multiline
                editable
                value={item.description}
                onChangeText={(text) =>
                  updateFileDescription(item.localId, text)
                }
              />
            </View>
            <View style={styles.deleteButtonContainer}>
              <FormButton
                title="Eliminar"
                onPress={() => removeFileView(item.localId)}
                buttonType="danger"
                icon={() => <Trash2 color={styles.iconColor.color} />}
                isDisabled={false}
              />
            </View>
          </View>
        ))}
        <FormButton
          title="Agregar"
          onPress={addFileView}
          buttonType="normal"
          icon={() => <Plus color={styles.iconColor.color} />}
          isDisabled={isUploading}
        />
      </View>
      <View style={styles.group}>
        <FormButton
          title="Enviar solicitud"
          onPress={() =>
            uploadRequest(
              vehicle.id,
              profile.id,
              new Date().toISOString(),
              requestTitle,
              requestDescription
            )
          }
          isDisabled={isUploading}
        />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
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
  iconColor: {
    color: theme.textPresets.inverted,
  },
  selectFileContainer: {
    aspectRatio: 16 / 9,
    justifyContent: "center",
    borderRadius: 5,
    gap: 6,
    alignItems: "center",
    padding: 12,
    backgroundColor: theme.ui.colors.border,
  },
  fileContainer: {
    width: "100%",
    borderStyle: "dashed",
    borderColor: theme.ui.colors.border,
    borderWidth: 3,
    borderRadius: 5,
  },
  twoPaneContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: "column",
    gap: 6,
    justifyContent: "center",
  },
  deleteButtonContainer: {
    width: "50%",
    alignSelf: "center",
    padding: 12,
  },
  fileIcon: {
    color: theme.textPresets.main,
  },
  fileText: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  filePreviewContainer: {
    borderColor: theme.ui.colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  selectFileButtonIcon: {
    color: theme.textPresets.inverted,
  },
  fileSubtitle: {
    color: theme.textPresets.main,
  },
}));
