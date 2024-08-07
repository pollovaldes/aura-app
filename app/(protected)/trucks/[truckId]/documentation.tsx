import { View, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

export default function TruckDetail() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  return (
    <View>
      <Stack.Screen options={{title:"Documentacion"}}/>
      <Text>Truck Documentation: {truckId}</Text>
    </View>
  );
}