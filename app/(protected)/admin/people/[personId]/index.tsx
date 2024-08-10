import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TruckDetail() {
  const { personId } = useLocalSearchParams<{ personId: string }>();

  return (
    <View>
      <Text>Person: {personId}</Text>
    </View>
  );
}