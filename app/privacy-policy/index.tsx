import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import { Platform, Text, View } from "react-native";

export default function PrivacyPolicy() {
  return (
    <View>
      <Text>Política de privacidad</Text>
      <StatusBar style={Platform.OS === "android" ? "auto" : "light"} />
    </View>
  );
}
