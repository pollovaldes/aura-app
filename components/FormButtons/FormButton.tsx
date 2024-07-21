import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type FormButtonProps = {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
  description?: string;
};

export function FormButton({
  onPress,
  title: text,
  isLoading = false,
  color,
  style,
  disabled,
  description,
}: FormButtonProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      style={[styles.button, style]}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color={color || styles.buttonText.color} />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  button: {
    height: 52,
    backgroundColor: theme.components.formComponent.buttonNeutralBG,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: theme.textPresets.inverted,
    userSelect: "none",
    fontSize: 18,
  },
}));
