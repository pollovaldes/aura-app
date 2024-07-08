import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function FinishRegistration() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Debes de terminar el registro para continuar
      </Text>
      <Link replace href={"/auth-flow/"} asChild>
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
