import AuraLogo from "@/components/web-logo-title/AuraLogo";
import { Image, Platform, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles, mq } from "react-native-unistyles";
import Form from "./Form";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";

export default function Card() {
  const { styles } = useStyles(stylesheet);

  const height = useKeyboardHeight();

  return (
    <View style={styles.canvas}>
      <View style={styles.dialog}>
        <View style={styles.imageContainer}>
          <Image
            source={require("./../../assets/large-triangles.png")}
            //@ts-ignore
            style={styles.image}
            resizeMode="repeat"
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
          <ScrollView
            scrollEnabled={true}
            automaticallyAdjustKeyboardInsets={true}
            style={[
              styles.scrollView,
              {
                marginBottom: Platform.OS === "android" ? height : undefined,
              },
            ]}
            contentContainerStyle={
              Platform.OS === "web" && styles.scrollView.isDesktopWidth
                ? { flexGrow: 1, justifyContent: "center" }
                : { paddingVertical: 24 }
            }
          >
            <Form />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  canvas: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    ...Platform.select({
      native: { width: "100%", height: "100%" },
      default: {
        width: {
          [mq.only.width(0, "md")]: "100%",
          [mq.only.width("md")]: "85%",
        },
        height: {
          [mq.only.width(0, "md")]: "100%",
          [mq.only.width("md")]: "85%",
        },
        flexDirection: {
          [mq.only.width("md")]: "row",
        },
      },
    }),
  },
  imageContainer: {
    flex: {
      [mq.only.width(0, "md")]: 2.5 / 10,
      [mq.only.width("md")]: 4 / 10,
    },
  },
  image: {
    width: "100%",
    height: "100%",
    ...Platform.select({
      web: {
        borderTopLeftRadius: 12,
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
    backgroundColor: theme.components.cardComponent.imageOverlay,
    ...Platform.select({
      web: {
        borderTopLeftRadius: 12,
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
    backgroundColor: theme.ui.colors.card,
    alignItems: "center",
    justifyContent: {
      [mq.only.width("md")]: "center",
    },
    flex: {
      [mq.only.width(0, "md")]: 7.5 / 10,
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
  scrollView: {
    paddingHorizontal: 24,
    maxWidth: 470,
    width: "100%",
    isDesktopWidth: {
      [mq.only.width(0, "md")]: false,
      [mq.only.width("md")]: true,
    },
  },
  logo: {
    color: "#ffffff",
    width: "50%",
    height: "100%",
  },
}));
