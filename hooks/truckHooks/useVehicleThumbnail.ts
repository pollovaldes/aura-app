import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import {
  ImagePickerOptions,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import useVehicle from "./useVehicle";

const { fetchVehicles } = useVehicle();

const listProfileImages = async (truckId: string) => {
  const { data, error } = await supabase.storage
    .from("imagenes-camiones")
    .list(`${truckId}/perfil`);

  if (error) {
    console.error(`Error listing thumbnails for ${truckId}: `, error);
    return null;
  }

  return data?.length ? data[0].name : null;
};

const downloadImage = async (truckId: string, fileName: string) => {
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from("imagenes-camiones")
    .download(`${truckId}/perfil/${fileName}`);

  if (downloadError) {
    console.error(
      `Error downloading thumbnail for ${truckId}: `,
      downloadError
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

const fetchThumbnail = async (truckId: string): Promise<string | null> => {
  try {
    const fileName = await listProfileImages(truckId);
    if (!fileName) return null;

    const file = await downloadImage(truckId, fileName);
    if (!file) return null;

    return await readImageAsDataURL(file);
  } catch (error) {
    console.error(`Error fetching profile image for ${truckId}: `, error);
    return null;
  }
};

const selectThumbnail = async (truckId: string) => {
  const options: ImagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    base64: true,
  };

  const result = await launchImageLibraryAsync(options);

  if (!result.canceled) {
    try {
      const img = result.assets[0];
      const base64 = img.base64;
      if (!base64) throw new Error("No se pudo obtener datos base64");

      const filePath = `${truckId}/perfil/${new Date().getTime()}.png`;

      // Eliminar foto de perfil existente
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("imagenes-camiones")
        .list(`${truckId}/perfil`);

      if (listError) {
        console.error(
          `Error listando imágenes de perfil para ${truckId}: `,
          listError
        );
        return;
      }

      if (existingFiles && existingFiles.length > 0) {
        const deletePaths = existingFiles.map(
          (file) => `${truckId}/perfil/${file.name}`
        );
        const { error: deleteError } = await supabase.storage
          .from("imagenes-camiones")
          .remove(deletePaths);
        if (deleteError) {
          console.error(
            `Error eliminando la foto de perfil existente para ${truckId}: `,
            deleteError.message
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
          `Error subiendo la nueva foto de perfil para ${truckId}: `,
          uploadError.message
        );
      } else {
        // Actualizar la lista de camiones con la nueva imagen
        await fetchVehicles();
      }
    } catch (error) {
      console.error(
        `Error al seleccionar foto de perfil para ${truckId}: `,
        error
      );
    }
  }
};

const addPhotoToGallery = async (truckId: string) => {
  const options: ImagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    base64: true,
  };

  const result = await launchImageLibraryAsync(options);

  if (!result.canceled) {
    try {
      const img = result.assets[0];
      const base64 = img.base64;
      if (!base64) throw new Error("No se pudo obtener datos base64");

      const filePath = `${truckId}/galeria/${new Date().getTime()}.png`;

      // Subir nueva foto a la galería
      const { error: uploadError } = await supabase.storage
        .from("imagenes-camiones")
        .upload(filePath, decode(base64), { contentType: "image/png" });

      if (uploadError) {
        console.error(
          `Error subiendo la foto a la galería para ${truckId}: `,
          uploadError.message
        );
      } else {
        // Actualizar la lista de camiones con la nueva imagen de galería
        await fetchVehicles();
      }
    } catch (error) {
      console.error(
        `Error al agregar foto a la galería para ${truckId}: `,
        error
      );
    }
  }
};

const deleteThumbnail = async (truckId: string) => {
  try {
    const { data: existingFiles, error: listError } = await supabase.storage
      .from("imagenes-camiones")
      .list(`${truckId}/perfil`);

    if (listError) {
      console.error(
        `Error listando imágenes de perfil para eliminar: ${truckId}: `,
        listError
      );
      alert("No se pudo listar las imágenes de perfil.");
      return;
    }

    if (existingFiles && existingFiles.length > 0) {
      const deletePaths = existingFiles.map(
        (file) => `${truckId}/perfil/${file.name}`
      );
      const { error: deleteError } = await supabase.storage
        .from("imagenes-camiones")
        .remove(deletePaths);
      if (deleteError) {
        console.error(
          `Error eliminando la foto de perfil para ${truckId}: `,
          deleteError.message
        );
        alert("No se pudo eliminar la foto de perfil.");
      } else {
        alert("Foto de perfil eliminada.");
        await fetchVehicles();
      }
    }
  } catch (error) {
    console.error(
      `Error al eliminar la foto de perfil para ${truckId}: `,
      error
    );
    alert("Ocurrió un error al eliminar la foto de perfil.");
  }
};

const deletePhotoFromGallery = async (truckId: string, fileName: string) => {
  try {
    const filePath = `${truckId}/galeria/${fileName}`;
    const { error: deleteError } = await supabase.storage
      .from("imagenes-camiones")
      .remove([filePath]);

    if (deleteError) {
      console.error(
        `Error eliminando la foto de galería ${fileName} para ${truckId}: `,
        deleteError.message
      );
      alert("No se pudo eliminar la foto de la galería.");
    } else {
      alert("Foto de la galería eliminada.");
      await fetchVehicles();
    }
  } catch (error) {
    console.error(
      `Error al eliminar la foto de galería para ${truckId}: `,
      error
    );
    alert("Ocurrió un error al eliminar la foto de la galería.");
  }
};

const useVehicleThumbnail = () => {
  return {
    fetchThumbnail,
    selectThumbnail,
    addPhotoToGallery,
    deleteThumbnail,
    deletePhotoFromGallery,
  };
};

export default useVehicleThumbnail;
