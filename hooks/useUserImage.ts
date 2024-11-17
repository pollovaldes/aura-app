import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useUserImage = (userId: string) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function getImage() {
      if (!userId) return;
      
      try {
        setLoading(true);
        const { data: files, error: listError } = await supabase.storage
          .from('avatars')
          .list(`${userId}`);

        if (listError || !files || files.length === 0) {
          setImageUri(null);
          return;
        }

        const fileName = files[0].name;
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(`${userId}/${fileName}`);

        if (error || !data) {
          setImageUri(null);
          return;
        }

        if (isMounted) {
          const uri = URL.createObjectURL(data);
          setImageUri(uri);
        }
      } catch (error) {
        setImageUri(null);
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