import { useHeaderHeight } from "@react-navigation/elements";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type LoadingScreenType = {
  caption: string;
};

export function FetchingIndicator({ caption }: LoadingScreenType) {
  const { styles } = useStyles(stylesheet);
  const headerHeight = useHeaderHeight();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Platform.OS === "ios" ? headerHeight : 0 },
      ]}
    >
      <ActivityIndicator />
      <Text style={styles.text}>{caption}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  moti: {
    color: theme.ui.colors.card,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
}));
