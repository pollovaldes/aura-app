import { useAccentTheme } from "@/context/AccentThemeContext";
import { pickTextColor } from "@/features/global/functions/pickTectColor";
import { LucideProps } from "lucide-react-native";
import React from "react";
import { Pressable, Text, ActivityIndicator, ViewStyle, View, TouchableOpacity } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type FormButtonProps = {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  style?: ViewStyle;
  isDisabled?: boolean;
  disabledText?: string;
  buttonType?: "normal" | "danger";
  Icon?: React.ComponentType<Partial<LucideProps>>;
};

export function FormButton({
  onPress,
  title: text,
  isLoading = false,
  style,
  disabledText,
  isDisabled,
  buttonType = "normal",
  Icon,
}: FormButtonProps) {
  const { styles } = useStyles(stylesheet);
  const { accentColorHex } = useAccentTheme();
  const buttonTextColor = pickTextColor(accentColorHex);

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
            top: styles.button(accentColorHex).height / 2 - styles.activityIndicator.height / 2,
          }}
        />
      )}
      <TouchableOpacity
        style={[
          styles.button(accentColorHex),
          buttonType === "danger" && styles.redButton,
          style,
          { opacity: isLoading || isDisabled ? 0.4 : 1 },
        ]}
        onPress={onPress}
        disabled={isLoading || isDisabled}
      >
        <Text
          style={[styles.buttonText(buttonTextColor), { opacity: isLoading ? 0 : isLoading && isDisabled ? 0 : 1 }]}
        >
          {isDisabled && disabledText ? disabledText : text}
        </Text>
        {Icon && !isLoading && (
          <View style={{ marginLeft: 10 }}>
            <Icon color={styles.buttonText(buttonTextColor).color} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  activityIndicator: {
    height: 30,
  },
  button: (accentColor: string) => ({
    height: 45,
    backgroundColor: accentColor,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  }),
  buttonText: (textColor: string) => ({
    color: textColor,
    userSelect: "none",
    fontSize: 18,
  }),
  redButton: {
    backgroundColor: theme.components.formComponent.buttonRedBG,
  },
}));
