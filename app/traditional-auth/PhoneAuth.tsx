import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function PhoneAuth() {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>PHONE</Text>
      <Link replace href={"/"} asChild>
        <Pressable>
          <Text style={styles.subtitle}>Ir al root</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.colors.text.main,
  },
  subtitle: {
    color: theme.colors.text.main,
    fontSize: 23,
    fontWeight: "300",
  },
}));
