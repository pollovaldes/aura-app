//Creo que tambien se puede ir alv


import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useUserImage = (userId: string) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      setImageUri(null);
      setLoading(false);
      return;
    }

    setImageUri(null); // Restablece la imagen al cambiar el usuario

    async function getImage() {
      try {
        setLoading(true);
        console.log(`Obteniendo imagen para userId: ${userId}`);
        const { data: files, error: listError } = await supabase.storage
          .from('avatars')
          .list(`${userId}`);

        if (listError) {
          console.error('Error al listar los archivos:', listError);
          if (isMounted) {
            setImageUri(null);
            setLoading(false);
          }
          return;
        }

        console.log(`Archivos encontrados para ${userId}:`, files);

        if (!files || files.length === 0) {
          console.warn(`No se encontraron archivos para el userId: ${userId}`);
          if (isMounted) {
            setImageUri(null);
            setLoading(false);
          }
          return;
        }

        const fileName = files[0].name;
        console.log(`Nombre del archivo: ${fileName}`);

        // Generar una URL firmada para acceder a la imagen
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('avatars')
          .createSignedUrl(`${userId}/${fileName}`, 60); // URL válida por 60 segundos

        if (signedUrlError) {
          console.error('Error al obtener la URL firmada:', signedUrlError);
          if (isMounted) {
            setImageUri(null);
            setLoading(false);
          }
          return;
        }

        const signedUrl = signedUrlData?.signedUrl;

        if (isMounted && signedUrl) {
          setImageUri(signedUrl);
          console.log(`Imagen URI actualizada para ${userId}: ${signedUrl}`);
        } else {
          if (isMounted) {
            setImageUri(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error en getImage:', error);
        if (isMounted) {
          setImageUri(null);
          setLoading(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    getImage();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { imageUri, loading };
};