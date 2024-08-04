import Apple from "@/assets/icons/Apple";
import Google from "@/assets/icons/Google";
import Phone from "@/assets/icons/Phone";
import { Pressable, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { PrimaryFormProps } from "./Form";

export default function SocialAuth({ togglePrimaryForm }: PrimaryFormProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.Container}>
      <Pressable style={styles.item} onPress={togglePrimaryForm}>
        <Phone fill={styles.iconColor.color} />
      </Pressable>
      <Pressable style={styles.item}>
        <Google />
      </Pressable>
      <Pressable style={styles.item}>
        <Apple fill={styles.iconColor.color} />
      </Pressable>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  Container: {
    display: "flex",
    flexDirection: "row",
    gap: theme.marginsComponents.group,
  },
  item: {
    flexGrow: 1,
    height: 50,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
  },
  iconColor: {
    color: theme.colors.inverted,
  },
}));
