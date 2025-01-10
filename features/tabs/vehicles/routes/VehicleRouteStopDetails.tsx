import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function VehicleRouteStopDetails() {
  const { styles } = useStyles(stylesheet);
  const { routeId: string } = useLocalSearchParams<{ routeId: string }>();

  return (
    <View>
      <Text>Route stops details</Text>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({}));
