import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export function hapticFeedback() {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } else if (Platform.OS === "android") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }
}
