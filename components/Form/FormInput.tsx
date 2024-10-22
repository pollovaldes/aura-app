import { Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface FormInputProps {
  onChangeText: (text: string) => void;
  placeholder: string;
  description: string;
}

export default function FormInput({
  onChangeText,
  description,
  placeholder,
}: FormInputProps) {
  const { styles } = useStyles(stylesheet);
  return (
    <View>
      <Text style={styles.text}>{description}</Text>
      <TextInput
        placeholder={placeholder}
        inputMode="text"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placehoolderTextColor}
        autoCorrect={false}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
  text: {
    color: theme.textPresets.subtitle,
    fontSize: 14,
    paddingBottom: 6,
    paddingLeft: 12,
  },
}));
