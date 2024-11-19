import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { ImagePickerOptions, launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import useUsers from "./useUsers";

const listProfileImages = async (userId: string) => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .list(`${userId}`);

  if (error) {
    console.error(`Error listing thumbnails for ${userId}: `, error);
    return null;
  }

  return data?.length ? data[0].name : null;
};

const downloadImage = async (userId: string, fileName: string) => {
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("avatars")
    .createSignedUrl(`${userId}/${fileName}`, 60);

  if (signedUrlError) {
    console.error(`Error getting signed URL for ${userId}: `, signedUrlError);
    return null;
  }

  return signedUrlData?.signedUrl || null;
};

const fetchThumbnail = async (userId: string): Promise<string | null> => {
  try {
    const fileName = await listProfileImages(userId);
    if (!fileName) return null;

    return await downloadImage(userId, fileName);
  } catch (error) {
    console.error(`Error fetching profile image for ${userId}: `, error);
    return null;
  }
};

const useUserThumbnail = () => {
  const { fetchUsers } = useUsers();

  return {
    fetchThumbnail,
  };
};

export default useUserThumbnail;