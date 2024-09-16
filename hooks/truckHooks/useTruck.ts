// hooks/useTruck.ts
import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import TrucksContext from "@/context/TrucksContext";
import { Truck, GaleriaImage } from "@/types/Truck";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export default function useTruck() {
  const { trucks, setTrucks, isLoading, setIsLoading } = useContext(
    TrucksContext
  ) ?? {
    trucks: null as Truck[] | null,
    setTrucks: (() => {}) as Dispatch<SetStateAction<Truck[] | null>>,
    setIsLoading: undefined as unknown as Dispatch<SetStateAction<boolean>>,
    isLoading: undefined as unknown as boolean,
  };

  const fetchTrucks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, brand, sub_brand, year, plate, serial_number, economic_number");

      if (error) {
        console.error("Error from useTruck: ", error);
        setTrucks(null);
      } else {
        const trucksData = data as Truck[];

        // Obtener imágenes para cada camión
        const trucksWithImages: Truck[] = await Promise.all(
          trucksData.map(async (truck) => {
            const fotoPerfil = await fetchProfileImage(truck.id);
            const galeria = await fetchGalleryImages(truck.id);
            return { ...truck, fotoPerfil, galeria };
          })
        );

        setTrucks(trucksWithImages);
        console.log("Desde el hook", trucksWithImages);
      }
    } catch (error) {
      console.error("Error fetching trucks: ", error);
      setTrucks(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileImage = async (truckId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from("imagenes-camiones")
        .list(`${truckId}/perfil`);

      if (error) {
        console.error(`Error listando imágenes de perfil para ${truckId}: `, error);
        return null;
      }

      if (data && data.length > 0) {
        const { data: downloadData, error: downloadError } = await supabase.storage
          .from("imagenes-camiones")
          .download(`${truckId}/perfil/${data[0].name}`);

        if (downloadError) {
          console.error(`Error descargando la imagen de perfil para ${truckId}: `, downloadError);
          return null;
        }

        const reader = new FileReader();
        reader.readAsDataURL(downloadData);
        return await new Promise<string | null>((resolve) => {
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            console.error("Error leyendo la imagen de perfil");
            resolve(null);
          };
        });
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error obteniendo la imagen de perfil para ${truckId}: `, error);
      return null;
    }
  };

  const fetchGalleryImages = async (truckId: string): Promise<GaleriaImage[]> => {
    try {
      const { data, error } = await supabase.storage
        .from("imagenes-camiones")
        .list(`${truckId}/galeria`);

      if (error) {
        console.error(`Error listando la galería para ${truckId}: `, error);
        return [];
      }

      if (data && data.length > 0) {
        const galeria: GaleriaImage[] = [];
        for (const file of data) {
          const { data: downloadData, error: downloadError } = await supabase.storage
            .from("imagenes-camiones")
            .download(`${truckId}/galeria/${file.name}`);

          if (downloadError) {
            console.error(`Error descargando ${file.name} para ${truckId}: `, downloadError);
            continue;
          }

          const reader = new FileReader();
          reader.readAsDataURL(downloadData);
          const uri = await new Promise<string | null>((resolve) => {
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              console.error("Error leyendo una imagen de la galería");
              resolve(null);
            };
          });
          if (uri) galeria.push({ uri, fileName: file.name });
        }
        return galeria;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error obteniendo la galería para ${truckId}: `, error);
      return [];
    }
  };

  // Funciones para manejar imágenes (seleccionar, subir, eliminar)

  const seleccionarFotoPerfil = async (truckId: string) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      setIsLoading(true);
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
          console.error(`Error listando imágenes de perfil para ${truckId}: `, listError);
          return;
        }

        if (existingFiles && existingFiles.length > 0) {
          const deletePaths = existingFiles.map((file) => `${truckId}/perfil/${file.name}`);
          const { error: deleteError } = await supabase.storage.from("imagenes-camiones").remove(deletePaths);
          if (deleteError) {
            console.error(`Error eliminando la foto de perfil existente para ${truckId}: `, deleteError.message);
            return;
          }
        }

        // Subir nueva foto de perfil
        const { error: uploadError } = await supabase.storage.from("imagenes-camiones").upload(
          filePath,
          decode(base64),
          { contentType: "image/png" }
        );

        if (uploadError) {
          console.error(`Error subiendo la nueva foto de perfil para ${truckId}: `, uploadError.message);
        } else {
          // Actualizar la lista de camiones con la nueva imagen
          await fetchTrucks();
        }
      } catch (error) {
        console.error(`Error al seleccionar foto de perfil para ${truckId}: `, error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const agregarFotoGaleria = async (truckId: string) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      setIsLoading(true);
      try {
        const img = result.assets[0];
        const base64 = img.base64;
        if (!base64) throw new Error("No se pudo obtener datos base64");

        const filePath = `${truckId}/galeria/${new Date().getTime()}.png`;

        // Subir nueva foto a la galería
        const { error: uploadError } = await supabase.storage.from("imagenes-camiones").upload(
          filePath,
          decode(base64),
          { contentType: "image/png" }
        );

        if (uploadError) {
          console.error(`Error subiendo la foto a la galería para ${truckId}: `, uploadError.message);
        } else {
          // Actualizar la lista de camiones con la nueva imagen de galería
          await fetchTrucks();
        }
      } catch (error) {
        console.error(`Error al agregar foto a la galería para ${truckId}: `, error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const eliminarFotoPerfil = async (truckId: string) => {
    setIsLoading(true);
    try {
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("imagenes-camiones")
        .list(`${truckId}/perfil`);

      if (listError) {
        console.error(`Error listando imágenes de perfil para eliminar: ${truckId}: `, listError);
        Alert.alert("Error", "No se pudo listar las imágenes de perfil.");
        return;
      }

      if (existingFiles && existingFiles.length > 0) {
        const deletePaths = existingFiles.map((file) => `${truckId}/perfil/${file.name}`);
        const { error: deleteError } = await supabase.storage.from("imagenes-camiones").remove(deletePaths);
        if (deleteError) {
          console.error(`Error eliminando la foto de perfil para ${truckId}: `, deleteError.message);
          Alert.alert("Error", "No se pudo eliminar la foto de perfil.");
        } else {
          Alert.alert("Éxito", "Foto de perfil eliminada.");
          await fetchTrucks();
        }
      }
    } catch (error) {
      console.error(`Error al eliminar la foto de perfil para ${truckId}: `, error);
      Alert.alert("Error", "Ocurrió un error al eliminar la foto de perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarFotoGaleria = async (truckId: string, fileName: string) => {
    setIsLoading(true);
    try {
      const filePath = `${truckId}/galeria/${fileName}`;
      const { error: deleteError } = await supabase.storage.from("imagenes-camiones").remove([filePath]);

      if (deleteError) {
        console.error(`Error eliminando la foto de galería ${fileName} para ${truckId}: `, deleteError.message);
        Alert.alert("Error", "No se pudo eliminar la foto de la galería.");
      } else {
        Alert.alert("Éxito", "Foto de la galería eliminada.");
        await fetchTrucks();
      }
    } catch (error) {
      console.error(`Error al eliminar la foto de galería para ${truckId}: `, error);
      Alert.alert("Error", "Ocurrió un error al eliminar la foto de la galería.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!trucks) {
      fetchTrucks();
    }
  }, []);

  return { trucks, fetchTrucks, isLoading, seleccionarFotoPerfil, agregarFotoGaleria, eliminarFotoPerfil, eliminarFotoGaleria };
}