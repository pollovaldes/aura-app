import { Platform, View } from "react-native";
import Form from "./Form";
import AuraLogo from "@/components/web-logo-title/AuraLogo";
import { createStyleSheet, useStyles, mq } from "react-native-unistyles";

export default function Authentication() {
  const { styles } = useStyles(stylesheet);

  return <Form />;
}

const stylesheet = createStyleSheet((theme) => ({
  logoContainer: {
    //backgroundColor: "green",
    alignItems: "center",
    paddingTop: Platform.OS === "web" ? 40 : 0,
    ...Platform.select({
      native: {
        position: "absolute",
        top: "15%",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      },
    }),
  },
}));
