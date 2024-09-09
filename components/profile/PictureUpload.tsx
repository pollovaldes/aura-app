import { useSession } from "@/context/SessionContext";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Image } from "react-native";
import { FileObject } from "@supabase/storage-js";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export default function PictureUpload() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const { styles } = useStyles(stylesheet);
  const session = useSession();
  const [profileImage, setProfileImage] = useState<FileObject | null>(null);
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
        .list(session?.user!.id);
      if (data && data.length > 0) {
        setProfileImage(data[0]);
        const { data: imageData } = await supabase.storage
          .from("avatars")
          .download(`${session?.user!.id}/${data[0].name}`);
        if (imageData) {
          const fr = new FileReader();
          fr.readAsDataURL(imageData);
          fr.onload = () => {
            setImageUri(fr.result as string);
          };
        }
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      setLoading(true);
      try {
        const img = result.assets[0];
        const base64 = await FileSystem.readAsStringAsync(img.uri, {
          encoding: "base64",
        });
        const filePath = `${session?.user!.id}/${new Date().getTime()}.png`;

        if (profileImage) {
          const { error: deleteError } = await supabase.storage
            .from("avatars")
            .remove([`${session?.user!.id}/${profileImage.name}`]);
          if (deleteError) {
            console.error("Error deleting the old image:", deleteError.message);
            return;
          }
        }

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, decode(base64), { contentType: "image/png" });

        if (!uploadError) {
          await loadProfileImage();
        } else {
          console.error("Error uploading new image:", uploadError.message);
        }
      } catch (error) {
        console.error("Error during image upload:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage} /> // Placeholder for no image
          )}
          {/* <TouchableOpacity onPress={onSelectImage} style={styles.uploadButton}>
            <Pencil size={18} color={styles.uploadIcon.color} />
            <Text style={styles.uploadText}>Editar imagen</Text>
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    justifyContent: "center",
    height: 80, //Also set in Row.tsx inside the children styles
    width: 80,
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 60, // Makes the image circular
  },
  placeholderImage: {
    height: 80,
    width: 80,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  uploadButton: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  uploadText: {
    color: theme.textPresets.main,
    fontSize: 17,
  },
  uploadIcon: {
    color: theme.textPresets.main,
  },
}));
