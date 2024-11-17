import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function index() {
  const [index, setIndex] = useState(0);

  return (
    <View>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          title: "Mantenimiento",
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <SegmentedControl
          values={["Solicitudes activas", "Solicitudes resueltas"]}
          selectedIndex={index}
          onChange={(event) => {
            setIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </ScrollView>
    </View>
  );
}
