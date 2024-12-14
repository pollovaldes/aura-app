import { Text, View } from "react-native";
import UserThumbnail from "../people/UserThumbnail";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { User } from "@/types/User";
import React from "react";
import LoadingScreen from "@/components/dataStates/LoadingScreen";

type ProfileRowProps = {
  profile: User;
};

export default function ProfileRow({ profile }: ProfileRowProps) {
  const { styles } = useStyles(stylesheet);

  if (!profile) {
    return <LoadingScreen caption="Cargando perfil" />;
  }

  return (
    <View style={styles.container}>
      <View>
        <UserThumbnail userId={profile.id} size={80} />
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.name}>
          {`${profile.name}\n${profile.father_last_name} ${profile.mother_last_name}`}
        </Text>
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
  descriptionContainer: {
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
