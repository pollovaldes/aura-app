import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { ReactNode } from "react";
import RowIcon from "./RowIcon";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "../Form/FormButton";
import GroupedList from "./GroupedList";
import { Info, Siren, CircleAlert, Megaphone, Smile } from "lucide-react-native";
import { colorPalette } from "@/style/themes";

// Base properties common to all types
interface BaseProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  kind?: kind;
}

// Properties when trailingType is "default"
interface DefaultProps extends BaseProps {
  caption?: string;
}

type kind = "message" | "bad" | "good" | "info";

const Notification = ({
  title,
  caption,
  onPress,
  disabled = false,
  isLoading,
  kind = "message",
}: DefaultProps) => {
  const { styles } = useStyles(stylesheet);
  const kindColor = kind === "message" ? styles.message : kind === "bad" ? styles.bad : kind === "good" ? styles.good : styles.info;
  const kindIcon =
    kind === "message" ? <Megaphone size={24} color="white" />
      : kind === "bad" ? <Siren size={24} color="white" />
        : kind === "good" ? <Smile size={24} color="white" />
          : <Info size={24} color="white" />;


  //Arturo Ayuda a que se vea bonito
  return (
    <Pressable
      disabled={isLoading || disabled}
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: disabled ? 0.75 : 1 },
        pressed && { opacity: 0.45 },
      ]}
    >
      <GroupedList extraStyles={{borderColor:kindColor.backgroundColor, borderWidth:4}}>
        <View style={styles.container}>
          <View style={styles.leadingContainer}>
            {kindIcon && kindColor && <RowIcon icon={kindIcon} backgroundColor={kindColor.backgroundColor} />}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>

            <View style={{ width: 32, marginLeft: 34 }} />
          </View>
          <View style={styles.trailingContainer}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Text style={styles.caption}>{caption}</Text>
                <View style={styles.section}>
                  <View style={styles.group}>
                    <View style={styles.buttonContainer}>
                      <FormButton
                        title="Descartar"
                        onPress={() => { }}
                        style={{ paddingHorizontal: 12 , backgroundColor: colorPalette.neutral[400]}}
                      />
                    </View>
                    <View style={styles.buttonContainer}>
                      <FormButton
                        title="Ver Más"
                        onPress={() => { }}
                        style={{ paddingHorizontal: 12, backgroundColor: colorPalette.emerald[500] }}
                      />
                    </View>
                  </View>
                </View>

              </>
            )}
          </View>
        </View>
      </GroupedList>
    </Pressable>
  );
};

export default Notification;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginHorizontal: 20,
  },
  leadingContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 16,
    width: "100%",
  },
  trailingContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20.5,
    color: theme.textPresets.main,
    fontWeight: "bold",
    alignSelf: "center",
  },
  titleContainer: {
    marginLeft: 10,
    alignSelf: "center",
  },
  caption: {
    fontSize: 16.5,
    color: theme.textPresets.subtitle,
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
    paddingVertical: 16,
  },
  group: {
    gap: theme.marginsComponents.group,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: "50%",
  },
  info: {
    backgroundColor: theme.components.notificationColors.info,
  },
  bad: {
    backgroundColor: theme.components.notificationColors.bad,
  },
  good: {
    backgroundColor: theme.components.notificationColors.good,
  },
  message: {
    backgroundColor: theme.components.notificationColors.message,
  },
}));
