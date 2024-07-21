import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import { Platform, Text, View } from "react-native";

export default function Terms() {
  return (
    <View>
      <Text>Términos y condiciones</Text>
      <StatusBar style={Platform.OS === "android" ? "auto" : "light"} />
    </View>
  );
}
