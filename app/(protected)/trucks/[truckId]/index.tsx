import TruckDetailContainer from "@/components/trucks/details/TruckDetailContainer";
import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function TruckDetail() {
  const {truckId} = useLocalSearchParams<{truckId: string}>();

  return (
    <View>
      < Text >Truck ID: {truckId}</Text>
      <Link href={`/trucks/${truckId}/details`}>Detalles</Link>
      <Link href={`/trucks/${truckId}/documentation`}>Documentacion</Link>
      <Link href={`/trucks/${truckId}/gasoline`}>Gasolina</Link>
      <Link href={`/trucks/${truckId}/peopleAdmin`}>Administrar Personas</Link>
    </View>
  );
}