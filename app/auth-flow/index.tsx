import { Link, router } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function AuthFlow() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={24} />
      <Link replace href={"/"} asChild>
        <TouchableOpacity>
          <Text style={styles.text}>Redireccionar al root</Text>
        </TouchableOpacity>
      </Link>
      <Link push href={"/auth-flow/finish-registration"} asChild>
        <TouchableOpacity>
          <Text style={styles.text}>Redireccionar a modal de registro</Text>
        </TouchableOpacity>
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
}));
