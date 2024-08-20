import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TruckDetail() {
  const { user_Id } = useLocalSearchParams<{ user_Id: string }>();

  return (
    <View>
      <Text>Person: {user_Id}</Text>
    </View>
  );
}