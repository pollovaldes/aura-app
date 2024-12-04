import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import FilePickerMenu from "@/components/maintenance/filePickerMenu";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/User";
import { Vehicle } from "@/types/Vehicle";
import { ImagePlus, Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface addMaintenanceModalProps {
  closeModal: () => void;
  fetchMaintenance: () => void;
  vehicle: Vehicle;
  profile: User;
}

interface FileItem {
  localId: string;
  description: string;
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

  const uploadRequest = async (
    vehicle_id: string,
    issued_by: string,
    issued_datetime: string,
    title: string,
    description: string
  ) => {
    try {
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
        setIsUploading(false);
        fetchMaintenance();
        closeModal();
        return data;
      } else {
        alert(`¡Ocurrió un error!\n${error.message}`);
        setIsUploading(false);
      }
    } catch (error) {
      alert(`¡Ocurrió un error en la función uploadRequest!\n${error}`);
      throw error;
    }
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
                  onSelect={() => console.log("Fui presioado")}
                  items={[
                    { key: "image", title: "Seleccionar desde la galeria" },
                    { key: "video", title: "Seleccionar desde archivos" },
                  ]}
                  trigger={
                    <View style={styles.selectFileContainer}>
                      <ImagePlus color={styles.fileIcon.color} size={50} />
                      <Text
                        style={styles.fileText}
                        ellipsizeMode="middle"
                        numberOfLines={2}
                      >
                        {"Seleccionar\narchivo"}
                      </Text>
                    </View>
                  }
                />
              )}

              {Platform.OS === "web" && (
                <TouchableOpacity>
                  <View style={styles.selectFileContainer}>
                    <ImagePlus color={styles.fileIcon.color} size={50} />
                    <Text
                      style={styles.fileText}
                      ellipsizeMode="middle"
                      numberOfLines={2}
                    >
                      {"Seleccionar\narchivo"}
                    </Text>
                  </View>
                </TouchableOpacity>
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
    color: theme.ui.colors.primary,
  },
  fileText: {
    color: theme.textPresets.main,
    fontSize: 16,
    textAlign: "center",
  },
}));
