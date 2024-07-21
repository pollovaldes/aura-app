import React from "react";
import { Pressable, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type FormTitleProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

const FormTitle = ({
  title,
  showBackButton = false,
  onBackPress,
}: FormTitleProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.headerContainer}>
      {showBackButton ? (
        <Pressable onPress={onBackPress}>
          <ArrowLeft size={30} color={styles.backIcon.color} />
        </Pressable>
      ) : (
        <View style={{ width: 30 }} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 30, opacity: 0 }} />
      {/* Used for perfect spacing in the row */}
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: theme.textPresets.main,
    fontWeight: "bold",
  },
  backIcon: {
    color: theme.colors.inverted,
  },
}));

export default FormTitle;
