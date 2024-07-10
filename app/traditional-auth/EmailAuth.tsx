import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import EmailLogin from "./EmailLogin";
import EmailSignUp from "./EmailSignUp";

enum authOptions {
  "login",
  "signup",
}

export default function EmailAuth() {
  const { styles } = useStyles(stylesheet);
  const [selectedIndex, setSelectedIndex] = useState(authOptions.login);

  return (
    <View style={styles.container}>
      <View style={styles.scrollViewContainer}>
        <ScrollView>
          <View style={styles.segmentedControlContainer}>
            <SegmentedControl
              values={["Ya tengo una cuenta", "Crear cuenta"]}
              selectedIndex={selectedIndex}
              onChange={(event) => {
                setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </View>
          {selectedIndex === authOptions.login ? (
            <EmailLogin />
          ) : (
            <EmailSignUp />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    //backgroundColor: "#1f1da3",
    height: "100%",
    margin: "auto",
    paddingHorizontal: 12,
    width: "100%",
    justifyContent: undefined,
    ...Platform.select({
      web: {
        paddingHorizontal: undefined,
        width: 360,
        justifyContent: "center",
      },
    }),
  },
  scrollViewContainer: {
    height: Platform.OS === "web" ? undefined : "100%",
    //backgroundColor: "#18e8c1",
    ...Platform.select({
      web: {
        padding: 12,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 10,
      },
    }),
  },
  segmentedControlContainer: {
    width: "100%",
    paddingTop: Platform.OS === "web" ? undefined : 12,
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
