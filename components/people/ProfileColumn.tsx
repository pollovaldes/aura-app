import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { User } from "@/types/User";
import UserThumbnail from "./UserThumbnail";
import React from "react";

type ProfileRowProps = {
  profile: User;
  showPosition?: boolean;
};

export default function ProfileColumn({
  profile,
  showPosition,
}: ProfileRowProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={{ height: 120 }}>
        <UserThumbnail userId={profile.id} size={120} />
      </View>
      <View style={styles.descriptioonContainer}>
        <>
          <Text style={styles.name}>{profile.name}</Text>
          <Text
            style={styles.name}
          >{`${profile.father_last_name} ${profile.mother_last_name}`}</Text>
          {showPosition && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{profile.position}</Text>
            </View>
          )}
        </>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    width: "100%",
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
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
  descriptionContainer: {
    marginTop: 12,
  },
}));
