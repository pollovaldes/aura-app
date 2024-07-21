import Apple from "@/assets/icons/Apple";
import Google from "@/assets/icons/Google";
import Phone from "@/assets/icons/Phone";
import { Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { PrimaryFormProps } from "./Form";

export default function SocialAuth({ togglePrimaryForm }: PrimaryFormProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.text}>O continua con</Text>
        <View style={styles.separator} />
      </View>
      <View style={styles.authContainer}>
        <Pressable onPress={togglePrimaryForm}>
          <View style={styles.box}>
            <Phone fill={styles.iconColor.color} />
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.box}>
            <Google />
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.box}>
            <Apple fill={styles.iconColor.color} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "column",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  separator: {
    borderTopWidth: 1,
    height: 1,
    flexGrow: 1,
    borderColor: theme.ui.colors.border,
  },
  text: {
    marginHorizontal: 12,
    color: theme.textPresets.main,
  },
  authContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  box: {
    width: 100,
    height: 50,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
  },
  iconColor: {
    color: theme.colors.inverted,
  },
}));
