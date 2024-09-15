import { Ban, ShieldAlert } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "../Form/FormButton";

type UnauthorizedScreenType = {
  caption: string;
  buttonCaption: string;
  retryFunction: () => void;
};

export default function UnauthorizedScreen({
  caption,
  retryFunction,
  buttonCaption,
}: UnauthorizedScreenType) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headingContainer}>
          <Ban color={styles.icon.color} size={35} />
          <Text style={styles.text}>{caption}</Text>
        </View>
        <FormButton title={buttonCaption} onPress={retryFunction} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  content: {
    gap: 20,
  },
  headingContainer: {
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 18,
    color: theme.textPresets.main,
    textAlign: "center",
  },
  icon: {
    color: theme.textPresets.main,
  },
}));
