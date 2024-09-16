// ProfileImageContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { useSession } from "@/context/SessionContext";

interface ProfileImageContextProps {
  imageUri: string | null;
  loading: boolean;
  onSelectImage: () => Promise<void>;
  deleteProfileImage: () => Promise<void>;
}

const ProfileImageContext = createContext<ProfileImageContextProps | undefined>(
  undefined
);

export const useProfileImage = (): ProfileImageContextProps => {
  const context = useContext(ProfileImageContext);
  if (!context) {
    throw new Error(
      "useProfileImage must be used within a ProfileImageProvider"
    );
  }
  return context;
};

interface ProfileImageProviderProps {
  children: ReactNode;
}

export function ProfileImageProvider({ children }: ProfileImageProviderProps) {
  const session = useSession();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;
    loadProfileImage();
  }, [session?.user]);

  const loadProfileImage = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.storage
        .from("avatars")
        .list(session?.user?.id);
      if (data && data.length > 0) {
        const file = data[0];
        const { data: imageData, error } = await supabase.storage
          .from("avatars")
          .download(`${session?.user?.id}/${file.name}`);
        if (error) throw error;

        const reader = new FileReader();
        reader.readAsDataURL(imageData);
        reader.onload = () => {
          setImageUri(reader.result as string);
        };
      } else {
        setImageUri(null);
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
      setImageUri(null);
    } finally {
      setLoading(false);
    }
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true, // Ensure base64 is returned
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      setLoading(true);
      try {
        const img = result.assets[0];
        const base64 = img.base64;
        if (!base64) throw new Error("Failed to get base64 data");

        const filePath = `${session?.user?.id}/${new Date().getTime()}.png`;

        // Delete the old image if it exists
        const { data: existingFiles } = await supabase.storage
          .from("avatars")
          .list(session?.user?.id);
        if (existingFiles && existingFiles.length > 0) {
          const deletePaths = existingFiles.map(
            (file) => `${session?.user?.id}/${file.name}`
          );
          const { error: deleteError } = await supabase.storage
            .from("avatars")
            .remove(deletePaths);
          if (deleteError) {
            console.error("Error deleting the old image:", deleteError.message);
            return;
          }
        }

        // Upload the new image
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, decode(base64), { contentType: "image/png" });

        if (uploadError) {
          console.error("Error uploading new image:", uploadError.message);
        } else {
          await loadProfileImage();
        }
      } catch (error) {
        console.error("Error during image upload:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteProfileImage = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const { data: existingFiles } = await supabase.storage
        .from("avatars")
        .list(session.user.id);
      if (existingFiles && existingFiles.length > 0) {
        const deletePaths = existingFiles.map(
          (file) => `${session.user.id}/${file.name}`
        );
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove(deletePaths);
        if (deleteError) {
          console.error("Error deleting the image:", deleteError.message);
        } else {
          setImageUri(null);
        }
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileImageContext.Provider
      value={{ imageUri, loading, onSelectImage, deleteProfileImage }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
}
