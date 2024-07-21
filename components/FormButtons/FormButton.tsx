import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type FormButtonProps = {
  onPress: () => void;
  text: string;
  isLoading?: boolean;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
};

export function FormButton({
  onPress,
  text,
  isLoading = false,
  color,
  style,
  disabled,
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
    height: 42,
    backgroundColor: theme.components.formComponent.buttonNeutralBG,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: theme.textPresets.inverted,
    userSelect: "none",
  },
}));
