// The Visuals of the PeopleAdmin Component

import { View, Text } from "react-native";

type User = {
  userName: string | null;
}

export default function TruckPeopleAdminComponent({userName}: User) {
  return (
    <View>
      <Text>People Admin: {userName}</Text>
    </View>
  );
}