import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TruckDetail() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  return (
    <View>
      <Text>People Admin: {truckId}</Text>
    </View>
  );
}