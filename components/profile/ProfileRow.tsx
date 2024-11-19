import { Text, View } from "react-native";
import PictureUpload from "./PictureUpload";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { User } from "@/types/User";
import React from "react";

type ProfileRowProps = {
  person: User;
};

export default function ProfileRow({ person: profile }: ProfileRowProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View>
        <PictureUpload size={80} userId={profile.id.toString()} />
      </View>
      <View style={styles.descriptioonContainer}>
        <>
          <Text style={styles.name}>{profile.name}</Text>
          <Text
            style={styles.name}
          >{`${profile.father_last_name} ${profile.mother_last_name}`}</Text>
          <Text style={styles.description}>{profile.position}</Text>
        </>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  descriptioonContainer: {
    flexDirection: "column",
  },
  loadingContainer: {
    flexDirection: "row",
    gap: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  description: {
    fontSize: 14,
    paddingVertical: 6,
    color: theme.textPresets.subtitle,
  },
}));
