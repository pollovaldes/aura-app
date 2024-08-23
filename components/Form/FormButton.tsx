import {
  Pressable,
  Text,
  ActivityIndicator,
  ViewStyle,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type FormButtonProps = {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  style?: ViewStyle;
  isDisabled?: boolean;
  disabledText?: string;
  isRed?: boolean;
};

export function FormButton({
  onPress,
  title: text,
  isLoading = false,
  style,
  isRed,
  disabledText,
  isDisabled,
}: FormButtonProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View>
      {isLoading && (
        <ActivityIndicator
          color="#ffffff"
          size={30}
          style={{
            position: "absolute",
            zIndex: 1,
            alignSelf: "center",
            top: styles.button.height / 2 - styles.activityIndicator.height / 2,
          }}
        />
      )}
      <Pressable
        style={[
          styles.button,
          style,
          { opacity: isLoading || isDisabled ? 0.3 : 1, 
            backgroundColor: isRed ? "red" : styles.button.backgroundColor,
          },
        ]}
        onPress={onPress}
        disabled={isLoading || isDisabled}
      >
        <Text
          style={[
            styles.buttonText,
            { opacity: isLoading ? 0 : isLoading && isDisabled ? 0 : 1 },
          ]}
        >
          {isDisabled && disabledText ? disabledText : text}
        </Text>
      </Pressable>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  activityIndicator: {
    height: 30,
  },
  button: {
    height: 45,
    backgroundColor: theme.components.formComponent.buttonMainBG,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: theme.textPresets.inverted,
    userSelect: "none",
    fontSize: 18,
  },
}));
