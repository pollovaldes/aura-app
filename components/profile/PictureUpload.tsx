//Borrar, se reemplaza por UserThumbnail


import { View, ActivityIndicator, Image } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { UserRound } from "lucide-react-native";
import { useUserImage } from "@/hooks/useUserImage";

type PictureUploadProps = {
  size: number;
  userId: string;
};

export default function PictureUpload({ size, userId }: PictureUploadProps) {
  const { styles } = useStyles(stylesheet);
  const { imageUri, loading } = useUserImage(userId);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={[styles.profileImage, { width: size, height: size }]}
            />
          ) : (
            <View
              style={[styles.placeholderImage, { width: size, height: size }]}
            >
              <UserRound size={size * 0.4375} color="#535353" />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    justifyContent: "center",
  },
  profileImage: {
    borderRadius: 60, // Keep radius for the image as it will be adjusted proportionally via props
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
    borderRadius: 60,
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
