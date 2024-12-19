import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import {
  ImagePickerOptions,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import useVehicle from "./useVehicle";

const listProfileImages = async (vehicleId: string) => {
  const { data, error } = await supabase.storage
    .from("imagenes-camiones")
    .list(`${vehicleId}/perfil`);

  if (error) {
    console.error(`Error listing thumbnails for ${vehicleId}: `, error);
    return null;
  }

  return data?.length ? data[0].name : null;
};

const downloadImage = async (vehicleId: string, fileName: string) => {
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from("imagenes-camiones")
    .download(`${vehicleId}/perfil/${fileName}`);

  if (downloadError) {
    console.error(
      `Error downloading thumbnail for ${vehicleId}: `,
      downloadError,
    );
    return null;
  }

  return downloadData;
};

const readImageAsDataURL = (file: Blob): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result && result.length >= 150) {
        resolve(result);
      } else {
        console.log("Invalid image data, too short or undefined.");
        resolve(null);
      }
    };
    reader.onerror = () => {
      console.error("Error reading profile image");
      reject(null);
    };
    reader.readAsDataURL(file);
  });
};

const fetchThumbnail = async (vehicleId: string): Promise<string | null> => {
  try {
    const fileName = await listProfileImages(vehicleId);
    if (!fileName) return null;

    const file = await downloadImage(vehicleId, fileName);
    if (!file) return null;

    return await readImageAsDataURL(file);
  } catch (error) {
    console.error(`Error fetching profile image for ${vehicleId}: `, error);
    return null;
  }
};

const selectThumbnail = async (
  vehicleId: string,
  fetchVehicles: () => void,
) => {
  const options: ImagePickerOptions = {
    aspect: [16, 9],
    base64: true,
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: false,
  };

  const result = await launchImageLibraryAsync(options);

  if (!result.canceled) {
    try {
      const img = result.assets[0];
      const base64 = img.base64;
      if (!base64) throw new Error("No se pudo obtener datos base64");
      const filePath = `${vehicleId}/perfil/${new Date().getTime()}.png`;

      // Eliminar foto de perfil existente
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("imagenes-camiones")
        .list(`${vehicleId}/perfil`);

      if (listError) {
        console.error(
          `Error listando imágenes de perfil para ${vehicleId}: `,
          listError,
        );
        return;
      }

      if (existingFiles && existingFiles.length > 0) {
        const deletePaths = existingFiles.map(
          (file) => `${vehicleId}/perfil/${file.name}`,
        );
        const { error: deleteError } = await supabase.storage
          .from("imagenes-camiones")
          .remove(deletePaths);
        if (deleteError) {
          console.error(
            `Error eliminando la foto de perfil existente para ${vehicleId}: `,
            deleteError.message,
          );
          return;
        }
      }

      // Subir nueva foto de perfil
      const { error: uploadError } = await supabase.storage
        .from("imagenes-camiones")
        .upload(filePath, decode(base64), { contentType: "image/png" });

      if (uploadError) {
        console.error(
          `Error subiendo la nueva foto de perfil para ${vehicleId}: `,
          uploadError.message,
        );
      } else {
        // Actualizar la lista de camiones con la nueva imagen
        await fetchVehicles();
      }
    } catch (error) {
      console.error(
        `Error al seleccionar foto de perfil para ${vehicleId}: `,
        error,
      );
    }
  }
};

const addPhotoToGallery = async (
  vehicleId: string,
  fetchVehicles: () => void,
) => {
  const options: ImagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    base64: true,
    aspect: [16, 9],
  };

  const result = await launchImageLibraryAsync(options);

  if (!result.canceled) {
    try {
      const img = result.assets[0];
      const base64 = img.base64;
      if (!base64) throw new Error("No se pudo obtener datos base64");

      const filePath = `${vehicleId}/galeria/${new Date().getTime()}.png`;

      // Subir nueva foto a la galería
      const { error: uploadError } = await supabase.storage
        .from("imagenes-camiones")
        .upload(filePath, decode(base64), { contentType: "image/png" });

      if (uploadError) {
        console.error(
          `Error subiendo la foto a la galería para ${vehicleId}: `,
          uploadError.message,
        );
      } else {
        // Actualizar la lista de camiones con la nueva imagen de galería
        await fetchVehicles();
      }
    } catch (error) {
      console.error(
        `Error al agregar foto a la galería para ${vehicleId}: `,
        error,
      );
    }
  }
};

const deleteThumbnail = async (
  vehicleId: string,
  fetchVehicles: () => void,
) => {
  try {
    const { data: existingFiles, error: listError } = await supabase.storage
      .from("imagenes-camiones")
      .list(`${vehicleId}/perfil`);

    if (listError) {
      console.error(
        `Error listando imágenes de perfil para eliminar: ${vehicleId}: `,
        listError,
      );
      alert("No se pudo listar las imágenes de perfil.");
      return;
    }

    if (existingFiles && existingFiles.length > 0) {
      const deletePaths = existingFiles.map(
        (file) => `${vehicleId}/perfil/${file.name}`,
      );
      const { error: deleteError } = await supabase.storage
        .from("imagenes-camiones")
        .remove(deletePaths);
      if (deleteError) {
        console.error(
          `Error eliminando la foto de perfil para ${vehicleId}: `,
          deleteError.message,
        );
        alert("No se pudo eliminar la foto de perfil.");
      } else {
        alert("Foto de perfil eliminada.");
        await fetchVehicles();
      }
    }
  } catch (error) {
    console.error(
      `Error al eliminar la foto de perfil para ${vehicleId}: `,
      error,
    );
    alert("Ocurrió un error al eliminar la foto de perfil.");
  }
};

const deletePhotoFromGallery = async (
  vehicleId: string,
  fileName: string,
  fetchVehicles: () => void,
) => {
  try {
    const filePath = `${vehicleId}/galeria/${fileName}`;
    const { error: deleteError } = await supabase.storage
      .from("imagenes-camiones")
      .remove([filePath]);

    if (deleteError) {
      console.error(
        `Error eliminando la foto de galería ${fileName} para ${vehicleId}: `,
        deleteError.message,
      );
      alert("No se pudo eliminar la foto de la galería.");
    } else {
      alert("Foto de la galería eliminada.");
      await fetchVehicles();
    }
  } catch (error) {
    console.error(
      `Error al eliminar la foto de galería para ${vehicleId}: `,
      error,
    );
    alert("Ocurrió un error al eliminar la foto de la galería.");
  }
};

const useVehicleThumbnail = () => {
  const { fetchVehicles } = useVehicle();

  return {
    fetchThumbnail: (vehicleId: string) => fetchThumbnail(vehicleId),
    selectThumbnail: (vehicleId: string) =>
      selectThumbnail(vehicleId, fetchVehicles),
    addPhotoToGallery: (vehicleId: string) =>
      addPhotoToGallery(vehicleId, fetchVehicles),
    deleteThumbnail: (vehicleId: string) =>
      deleteThumbnail(vehicleId, fetchVehicles),
    deletePhotoFromGallery: (vehicleId: string, fileName: string) =>
      deletePhotoFromGallery(vehicleId, fileName, fetchVehicles),
  };
};

export default useVehicleThumbnail;
