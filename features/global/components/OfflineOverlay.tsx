import { Activity, WifiOff } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function OfflineOverlay() {
  const { styles } = useStyles(stylesheet);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <View style={styles.loadingCard}>
        <WifiOff size={48} color={styles.activityIndicator.color} />
        <Text style={styles.text}>
          {"Parece ser que no hay conexión a internet, reconéctate para continuar o verifica tu conexión."}
        </Text>
        <ActivityIndicator size="large" color={styles.activityIndicator.color} />
      </View>
    </View>
  );
}

//Backlash symbol is: \

const stylesheet = createStyleSheet((theme, runtime) => ({
  loadingCard: {
    width: "80%",
    maxWidth: 350,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    gap: 16,
    alignItems: "center",
  },
  text: {
    color: theme.colors.inverted,
    fontSize: 18,
    textAlign: "center",
  },
  activityIndicator: {
    color: theme.colors.inverted,
  },
}));
