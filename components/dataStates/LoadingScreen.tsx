import { ActivityIndicator, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type LoadingScreenType = {
  caption: string;
};

export default function LoadingScreen({ caption }: LoadingScreenType) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Text style={styles.text}>{caption}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12
  },
  text: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
}));
