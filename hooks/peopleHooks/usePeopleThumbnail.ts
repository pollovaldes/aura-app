
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { ImagePickerOptions, launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import usePeople from "./usePeople";

const listProfileImages = async (personId: string) => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .list(`${personId}`);

  if (error) {
    console.error(`Error listing thumbnails for ${personId}: `, error);
    return null;
  }

  return data?.length ? data[0].name : null;
};

const downloadImage = async (personId: string, fileName: string) => {
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("avatars")
    .createSignedUrl(`${personId}/${fileName}`, 60);

  if (signedUrlError) {
    console.error(`Error getting signed URL for ${personId}: `, signedUrlError);
    return null;
  }

  return signedUrlData?.signedUrl || null;
};

const fetchThumbnail = async (personId: string): Promise<string | null> => {
  try {
    const fileName = await listProfileImages(personId);
    if (!fileName) return null;

    return await downloadImage(personId, fileName);
  } catch (error) {
    console.error(`Error fetching profile image for ${personId}: `, error);
    return null;
  }
};

const usePeopleThumbnail = () => {
  const { fetchPeople } = usePeople();

  return {
    fetchThumbnail,
  };
};

export default usePeopleThumbnail;