import React, { ReactNode, useState } from "react";
import { Pressable, View } from "react-native";
import { Link, LinkProps } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ChevronRight } from "lucide-react-native";

interface SimpleListProps extends Partial<LinkProps> {
  href?: string;
  leading?: ReactNode;
  content?: ReactNode;
  trailing?: ReactNode;
  hideChevron?: boolean;
}

export const SimpleList: React.FC<SimpleListProps> = ({
  href,
  leading,
  content,
  trailing,
  hideChevron,
  ...linkProps
}) => {
  const { styles } = useStyles(stylesheet);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const renderPressable = () => (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View
        style={[
          styles.container,
          href && isHovered && styles.containerHovered,
          href && isPressed && styles.containerPressed,
        ]}
      >
        {leading && <View style={styles.leading}>{leading}</View>}
        {content && <View style={styles.content}>{content}</View>}
        {trailing && <View style={styles.trailing}>{trailing}</View>}
        {!hideChevron && <ChevronRight color={styles.chevron.color} />}
      </View>
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href} asChild {...linkProps}>
        {renderPressable()}
      </Link>
    );
  }

  return renderPressable();
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
    backgroundColor: theme.ui.colors.card,
  },
  containerPressed: {
    backgroundColor: theme.ui.colors.border,
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
  chevron: {
    color: theme.textPresets.subtitle,
  },
}));
