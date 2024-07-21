import AuraLogo from "@/components/web-logo-title/AuraLogo";
import { Image, Platform, View } from "react-native";
import { createStyleSheet, useStyles, mq } from "react-native-unistyles";
import Form from "./Form";
import TermsAndPrivacy from "./TermsAndPrivacy";

export default function Card() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.canvas}>
      <View style={styles.dialog}>
        <View style={styles.imageContainer}>
          <Image
            source={require("./../assets/large-triangles.png")}
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
          <View style={styles.content}>
            <Form />
          </View>
          <View style={styles.footer}>
            <TermsAndPrivacy />
          </View>
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
      [mq.only.width(0, "md")]: 3 / 10,
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
    backgroundColor: theme.colors.imageOverlay,
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
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: {
      [mq.only.width("md")]: "center",
    },
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
  content: {
    maxWidth: 470,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 12,
    flexGrow: 1,
    justifyContent: {
      [mq.only.width("md")]: "center",
    },
  },
  footer: {
    maxWidth: 470,
    width: "100%",
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  header: {
    fontSize: 30,
    color: theme.colors.text.main,
  },
  logo: {
    color: "#ffffff",
    width: "50%",
    height: "100%",
  },
}));
