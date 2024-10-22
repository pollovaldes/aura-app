import { Text, TextInput, View, TextInputProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface FormInputProps extends TextInputProps {
  description: string;
}

export default function FormInput({
  description,
  placeholder,
  onChangeText,
  ...props
}: FormInputProps) {
  const { styles } = useStyles(stylesheet);
  return (
    <View>
      <Text style={styles.text}>{description}</Text>
      <TextInput
        placeholder={placeholder}
        inputMode="text"
        style={styles.textInput}
        placeholderTextColor={styles.textInput.placeholderTextColor}
        onChangeText={onChangeText}
        {...props}
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
    placeholderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
  text: {
    color: theme.textPresets.subtitle,
    fontSize: 14,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingTop: 6,
  },
}));