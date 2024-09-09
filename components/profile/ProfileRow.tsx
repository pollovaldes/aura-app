import { ActivityIndicator, Text, View } from "react-native";
import PictureUpload from "./PictureUpload";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import usePeople from "@/hooks/peopleHooks/usePeople";

export default function ProfileRow() {
  const { styles } = useStyles(stylesheet);

  const { people, loading } = usePeople({ justOne: true, isComplete: true });
  const user = people[5];

  return (
    <View style={styles.container}>
      <View>
        <PictureUpload />
      </View>
      <View style={styles.descriptioonContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.description}>Obteniendo datos...</Text>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <Text style={styles.name}>{user.nombre}</Text>
            <Text
              style={styles.name}
            >{`${user.apellido_paterno} ${user.apellido_materno}`}</Text>
            <Text style={styles.description}>Gerente regional</Text>
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
