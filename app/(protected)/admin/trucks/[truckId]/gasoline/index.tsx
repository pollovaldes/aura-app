import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  return (
    <View>
      <Text>Gasoline: {truckId}</Text>
    </View>
  );
}