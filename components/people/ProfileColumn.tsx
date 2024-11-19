import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { User } from "@/types/User";
import UserThumbnail from "./UserThumbnail";
import React from "react";

type ProfileRowProps = {
  profile: User;
};

export default function ProfileColumn({ profile }: ProfileRowProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View>
        <UserThumbnail userId={profile.id} size={120} />
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
    flexDirection: "column",
    gap: 18,
    alignItems: "center",
    marginTop: 12,
  },
  descriptioonContainer: {
    flexDirection: "column",
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.textPresets.main,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    paddingVertical: 6,
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
}));
