// The Visuals of the PeopleAdmin Component

import { View, Text } from "react-native";

type User = {
  name: string | null;
}

export default function TruckPeopleAdminComponent({name}: User) {
  return (
    <View>
      <Text>People Admin: {name}</Text>
    </View>
  );
}