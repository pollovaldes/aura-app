import { Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import AppleIcon from "./AppleIcon";
import GoogleIcon from "./GoogleIcon";
import { Mail, Phone } from "lucide-react-native";

interface ButtonProps {
  title: string;
  authProvider: "google" | "apple" | "phone" | "email";
  onPress?: () => void;
}

export default function AuthButton({
  title,
  authProvider,
  onPress,
}: ButtonProps) {
  const { styles } = useStyles(stylesheet);

  function getButtonBackgroundColor(authProvider: ButtonProps["authProvider"]) {
    const providerStyles = {
      google: styles.oAuthBG,
      apple: styles.oAuthBG,
      phone: styles.traditionalBG,
      email: styles.traditionalBG,
    };

    return providerStyles[authProvider];
  }

  function getIcon(authProvider: ButtonProps["authProvider"]) {
    const providerStyles = {
      google: <GoogleIcon width={24} height={24} />,
      apple: <AppleIcon width={24} height={24} fill={styles.icon.color} />,
      phone: <Phone width={24} height={24} color={styles.icon.color} />,
      email: <Mail width={24} height={24} color={styles.icon.color} />,
    };

    return providerStyles[authProvider];
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, getButtonBackgroundColor(authProvider)]}>
        <View
          style={{
            flex: 1 / 9,
            alignItems: "center",
          }}
        >
          {getIcon(authProvider)}
        </View>
        <View
          style={{
            flex: 8 / 9,
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    height: 50,
    margin: 3,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: theme.colors.text.mainInverted,
  },
  icon: {
    color: theme.colors.text.mainInverted,
  },
  oAuthBG: { backgroundColor: theme.colors.brands.inverted },
  traditionalBG: { backgroundColor: theme.colors.brands.phone },
}));
