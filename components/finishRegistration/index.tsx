import "@/style/unistyles";
import { Text, View, StyleSheet } from "react-native";
import SignUp from "./askName";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Layout() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.section}>
        <View style={styles.group}>
          <SignUp />
        </View>
      </View>
    </View>
  );
}

// Create styles
const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    width: "80%",
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));
