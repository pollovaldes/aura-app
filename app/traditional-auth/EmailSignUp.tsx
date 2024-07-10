import { ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function EmailSignUp() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Crear cuenta</Text>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {},
  text: {
    color: theme.colors.text.main,
  },
}));
