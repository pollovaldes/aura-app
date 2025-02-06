import { Rabbit } from "lucide-react-native";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "../Form/FormButton";

type EmptyScreenType = {
  caption: string;
  buttonCaption?: string;
  retryFunction?: () => void;
};

export default function EmptyScreen({ caption, buttonCaption, retryFunction }: EmptyScreenType) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headingContainer}>
          <Rabbit color={styles.icon.color} size={35} />
          <Text style={styles.text}>{caption}</Text>
        </View>
        {buttonCaption && retryFunction && <FormButton title={buttonCaption} onPress={retryFunction} />}
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    height: "100%",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.ui.colors.background,
    paddingHorizontal: 16,
  },
  content: {
    gap: 25,
  },
  headingContainer: {
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 20,
    color: theme.textPresets.main,
    textAlign: "center",
  },
  icon: {
    color: theme.textPresets.main,
  },
}));
