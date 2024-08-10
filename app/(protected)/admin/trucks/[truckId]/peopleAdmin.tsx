import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import TruckPeopleAdminContainer from "@/components/trucks/peopleAdmin/TruckPeopleAdminContainer";

export default function TruckDetail() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  return (
    <TruckPeopleAdminContainer/>
  );
}