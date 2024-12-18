import React, { ReactNode, useState } from "react";
import { Pressable, View } from "react-native";
import { Link, LinkProps } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface SimpleListProps extends LinkProps {
  leading?: ReactNode;
  content?: ReactNode;
  trailing?: ReactNode;
}

export const SimpleList: React.FC<SimpleListProps> = ({
  href,
  leading,
  content,
  trailing,
  ...linkProps // Capture additional props for the Link
}) => {
  const { styles } = useStyles(stylesheet);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Link href={href} asChild {...linkProps}>
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        <View
          style={[
            styles.container,
            isHovered && styles.containerHovered,
            isPressed && styles.containerPressed,
          ]}
        >
          {leading && <View style={styles.leading}>{leading}</View>}
          {content && <View style={styles.content}>{content}</View>}
          {trailing && <View style={styles.trailing}>{trailing}</View>}
        </View>
      </Pressable>
    </Link>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
  },
  containerHovered: {
    backgroundColor: theme.components.plainList.hover,
  },
  containerPressed: {
    backgroundColor: theme.components.plainList.pressed,
  },
  leading: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  trailing: {
    marginLeft: 12,
  },
}));
