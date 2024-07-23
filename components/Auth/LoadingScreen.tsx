import { ActivityIndicator, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function LoadingScreen() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.isLoadingContainer}>
      <ActivityIndicator size={30} />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  isLoadingContainer: {
    flex: 1,
    backgroundColor: theme.ui.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
}));
