import { useHeaderHeight } from "@react-navigation/elements";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { Platform, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function SkeletonLoading() {
  const { styles } = useStyles(stylesheet);
  const headerHeight = useHeaderHeight();

  return (
    <MotiView
      animate={{ backgroundColor: "transparent" }}
      style={{
        paddingTop:
          Platform.OS === "android" || Platform.OS === "web"
            ? 32
            : headerHeight + 32,
        paddingHorizontal: 16,
      }}
    >
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={"100%"}
        height={200}
      />
      <Spacer />
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={200}
      />
      <Spacer height={8} />
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={"100%"}
      />
      <Spacer height={8} />
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={"100%"}
      />
      <Spacer height={8} />
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={"100%"}
      />
      <Spacer height={8} />
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={"100%"}
      />
      <Spacer height={8} />
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={200}
      />
      <Spacer height={8} />
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={"100%"}
      />
      <Skeleton
        colorMode={styles.moti.color === "rgb(18, 18, 18)" ? "dark" : "light"}
        width={"100%"}
      />
    </MotiView>
  );
}

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const stylesheet = createStyleSheet((theme) => ({
  moti: {
    color: theme.ui.colors.card,
  },
}));
