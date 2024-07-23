import { Link, usePathname } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface ListItemProps {
  title: string;
  iconComponent: ReactNode;
  href: string | null;
}

export default function ListItem({
  title,
  iconComponent,
  href,
}: ListItemProps) {
  const { styles } = useStyles(stylesheet);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  if (!href) return;

  function getSelectionColor(href: string) {
    if (pathname.includes(href)) {
      return styles.containerSelected;
    }

    if (isHovered) {
      return styles.containerHovered;
    }

    return styles.containerNormal;
  }

  return (
    <Link href={href} asChild>
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <View style={[styles.container, getSelectionColor(href)]}>
          <View style={styles.iconContainer}>{iconComponent}</View>
          <Text style={styles.text}>{title}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    borderRadius: 10,
    height: 32,
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
  containerNormal: {
    backgroundColor: theme.colors.inverted, //TODO: CHANGE THEME,
  },
  containerHovered: {
    backgroundColor: theme.colors.inverted, //TODO: CHANGE THEME,
  },
  containerSelected: {
    backgroundColor: theme.colors.inverted, //TODO: CHANGE THEME,
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    color: theme.textPresets.main,
  },
}));
