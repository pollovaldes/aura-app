import AuraLogo from "@/components/web-logo-title/AuraLogo";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function CustomWebHeader() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.headerContainer}>
      <AuraLogo width={92} height={25} fill={styles.logo.color} />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  headerContainer: {
    height: 44,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: theme.colors.outline,
  },
  logo: {
    color: theme.colors.inverted,
  },
}));
