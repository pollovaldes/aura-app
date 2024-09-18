import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  return (
    <View>
      <Text>Gasoline: {vehicleId}</Text>
    </View>
  );
}
