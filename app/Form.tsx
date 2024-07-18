import AuraLogo from "@/components/web-logo-title/AuraLogo";
import { useState } from "react";
import { ActivityIndicator, Image, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles, mq } from "react-native-unistyles";

export default function Form() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.canvas}>
      <View style={styles.dialog}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://cdn.dribbble.com/users/2773311/screenshots/14473889/media/91fad3184d4d4c377c32cba06da2d0a1.gif",
            }}
            //@ts-ignore
            style={styles.image}
            resizeMode="cover"
          />
          <View
            //@ts-ignore
            style={styles.imageOverlay}
          >
            <AuraLogo
              width={styles.logo.width}
              height={styles.logo.height}
              fill={styles.logo.color}
            />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.header}>Crea una cuenta</Text>
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  canvas: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    ...Platform.select({
      native: { width: "100%", height: "100%" },
      default: {
        width: "90%",
        height: "90%",
        flexDirection: {
          [mq.only.width("md")]: "row",
        },
      },
    }),
  },
  imageContainer: {
    flex: {
      [mq.only.width(0, "md")]: 3 / 10,
      [mq.only.width("md")]: 4 / 10,
    },
  },
  image: {
    width: "100%",
    height: "100%",
    ...Platform.select({
      web: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: {
          [mq.only.width(0, "md")]: 12,
          [mq.only.width("md")]: 0,
        },
        borderBottomLeftRadius: {
          [mq.only.width(0, "md")]: 0,
          [mq.only.width("md")]: 12,
        },
      },
    }),
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.imageOverlay,
    ...Platform.select({
      web: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: {
          [mq.only.width(0, "md")]: 12,
          [mq.only.width("md")]: 0,
        },
        borderBottomLeftRadius: {
          [mq.only.width(0, "md")]: 0,
          [mq.only.width("md")]: 12,
        },
      },
    }),
  },
  contentContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: 12,
    flex: {
      [mq.only.width(0, "md")]: 7 / 10,
      [mq.only.width("md")]: 6 / 10,
    },
    borderTopRightRadius: {
      [mq.only.width(0, "md")]: 0,
      [mq.only.width("md")]: 12,
    },
    borderBottomLeftRadius: {
      [mq.only.width(0, "md")]: 12,
      [mq.only.width("md")]: 0,
    },
    borderBottomRightRadius: 12,
  },
  header: {
    fontSize: 30,
    color: theme.colors.text.main,
  },
  logo: {
    color: Platform.OS === "web" ? "#ffffff" : "#ffffff",
    width: {
      [mq.only.width(0, "md")]: 173,
      [mq.only.width("md")]: 274,
    },
    height: {
      [mq.only.width(0, "md")]: 57,
      [mq.only.width("md")]: 90,
    },
  },
}));
