import { useState } from "react";
import { TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function EmailLogin() {
  const { styles } = useStyles(stylesheet);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        style={styles.field}
        value={email}
        onChangeText={setEmail}
        autoComplete="email"
        inputMode="email"
        keyboardType="email-address"
        clearButtonMode="while-editing"
        enterKeyHint="done"
        textContentType="emailAddress"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.field}
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
        clearButtonMode="while-editing"
        enterKeyHint="done"
        secureTextEntry={true}
      />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {},
  field: {
    height: 44,
    borderWidth: 0.5,
    borderColor: theme.colors.outline,
    borderRadius: 6,
    padding: 10,
  },
  text: {
    color: theme.colors.text.main,
  },
}));
