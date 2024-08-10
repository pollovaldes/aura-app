import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import TruckDetailContainer from "@/components/trucks/details/TruckDetailContainer";

export default function TruckDetail() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  return (
    <TruckDetailContainer/>
  );
}