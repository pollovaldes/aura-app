import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TruckDetail() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  return (
    <View>
      <Text>Truck Documentation: {truckId}</Text>
    </View>
  );
}