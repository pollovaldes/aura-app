
import { UserRound } from "lucide-react-native";
import { ActivityIndicator, Image, View } from "react-native";
import { useStyles, createStyleSheet } from "react-native-unistyles";
import { useEffect, useState } from "react";
import { Person } from "@/types/Person";
import usePeople from "@/hooks/peopleHooks/usePeople";
import usePeopleThumbnail from "@/hooks/peopleHooks/usePeopleThumbnail";
import React from "react";

type PersonThumbnailProps = {
  personId: string;
  size?: number;
};

export default function PersonThumbnail({ personId, size = 60 }: PersonThumbnailProps) {
  const { styles } = useStyles(stylesheet);
  const { people, setPeople } = usePeople();
  const { fetchThumbnail } = usePeopleThumbnail();
  const [thumbnailIsLoading, setThumbnailIsLoading] = useState(false);

  if (!people) return null;
  const item = people.find((person) => person.id === personId);

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

      const thumbnail = await fetchThumbnail(personId);
      if (thumbnail) {
        setPeople(
          (prevPeople: Person[] | null) =>
            prevPeople?.map((person) =>
              person.id === personId ? { ...person, thumbnail } : person
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