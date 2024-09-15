import { ActivityIndicator, Text, View } from "react-native";
import PictureUpload from "./PictureUpload";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";

export default function ProfileRow() {
  const { styles } = useStyles(stylesheet);
  const { name, fatherLastName, motherLastName, position, isLoading } =
    useProfile();

  return (
    <View style={styles.container}>
      <View>
        <PictureUpload />
      </View>
      <View style={styles.descriptioonContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.description}>Obteniendo datos...</Text>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text
              style={styles.name}
            >{`${fatherLastName} ${motherLastName}`}</Text>
            <Text style={styles.description}>{position}</Text>
          </>
        )}
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
