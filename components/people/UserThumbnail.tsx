import { UserRound } from "lucide-react-native";
import { ActivityIndicator, Image, View } from "react-native";
import { useStyles, createStyleSheet } from "react-native-unistyles";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import useUsers from "@/hooks/peopleHooks/useUsers";
import useUserThumbnail from "@/hooks/peopleHooks/useUserThumbnail";
import React from "react";

type UserThumbnailProps = {
  userId: string;
  size?: number;
};

export default function UserThumbnail({ userId, size = 60 }: UserThumbnailProps) {
  const { styles } = useStyles(stylesheet);
  const { users, setUsers } = useUsers();
  const { fetchThumbnail } = useUserThumbnail();
  const [thumbnailIsLoading, setThumbnailIsLoading] = useState(false);

  if (!users) return null;
  const item = users.find((user) => user.id === userId);

  useEffect(() => {
    if (!item) {
      setThumbnailIsLoading(false);
      return;
    }

    setThumbnailIsLoading(true);

    const loadThumbnail = async () => {
      if (item.thumbnail) {
        setThumbnailIsLoading(false);
        return;
      }

      const thumbnail = await fetchThumbnail(userId);
      if (thumbnail) {
        setUsers(
          (prevUsers: User[] | null) =>
            prevUsers?.map((user) =>
              user.id === userId ? { ...user, thumbnail } : user
            ) || null
        );
      }
      setThumbnailIsLoading(false);
    };

    loadThumbnail();
  }, []);

  return (
    <>
      {thumbnailIsLoading ? (
        <View style={[styles.emptyImageContainer, { width: size, height: size }]}>
          <ActivityIndicator />
        </View>
      ) : item && item.thumbnail ? (
        <Image style={[styles.image, { width: size, height: size }]} source={{ uri: item.thumbnail }} />
      ) : (
        <View style={[styles.emptyImageContainer, { width: size, height: size }]}>
          <UserRound size={size * 0.4375} color={styles.noImageIcon.color} strokeWidth={1.25} />
        </View>
      )}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    borderRadius: 60,
  },
  emptyImageContainer: {
    borderRadius: 60,
    backgroundColor: theme.ui.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageIcon: {
    color: theme.textPresets.main,
  },
}));