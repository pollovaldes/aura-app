import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Index() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  console.log(documentId);

  return (
    <View>
      <Text>Documento</Text>
    </View>
  );
}
