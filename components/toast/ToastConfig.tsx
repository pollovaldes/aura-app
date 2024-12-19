import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export const toastConfig = {
  alert: ({ text1, text2, customComponent }: { text1?: string; text2?: string; customComponent?: React.ReactNode }) => {
    const insets = useSafeAreaInsets();
    const { styles } = useStyles(stylesheet);

    return (
      <View style={[styles.toastContainer, { marginTop: insets.top / 2 }]}>
        {text1 && (
          <Text style={styles.title} selectable={false}>
            {text1}
          </Text>
        )}
        {text2 && (
          <Text style={styles.caption} selectable={false}>
            {text2}
          </Text>
        )}
        {customComponent && customComponent}
      </View>
    );
  },
};

const stylesheet = createStyleSheet((theme) => ({
  toastContainer: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: theme.components.toast.backgroundColor,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  caption: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
}));
