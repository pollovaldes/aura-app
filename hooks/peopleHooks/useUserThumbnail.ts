import { supabase } from "@/lib/supabase";
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
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from("avatars")
    .download(`${userId}/${fileName}`);

  if (downloadError) {
    console.error(`Error downloading thumbnail for ${userId}: `, downloadError);
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

const fetchThumbnail = async (userId: string): Promise<string | null> => {
  try {
    const fileName = await listProfileImages(userId);
    if (!fileName) return null;

    const file = await downloadImage(userId, fileName);
    if (!file) return null;

    return await readImageAsDataURL(file);
  } catch (error) {
    console.error(`Error fetching profile image for ${userId}: `, error);
    return null;
  }
};

const useUserThumbnail = () => {
  return {
    fetchThumbnail,
  };
};

export default useUserThumbnail;