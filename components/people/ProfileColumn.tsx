import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import UserThumbnail from "./UserThumbnail";
import React from "react";
import { User } from "@/types/globalTypes";
import { getRoleLabel } from "@/features/global/functions/getRoleLabel";

type ProfileRowProps = {
  profile: User;
};

export default function ProfileColumn({ profile }: ProfileRowProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={{ height: 150 }}>
        <UserThumbnail userId={profile.id} size={150} />
      </View>
      <View style={styles.descriptioonContainer}>
        <>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.name}>{`${profile.father_last_name} ${profile.mother_last_name}`}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{`Rol: ${getRoleLabel(profile.role)}`}</Text>
            <Text style={styles.description}>{`Posición: ${profile.position}`}</Text>
          </View>
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
