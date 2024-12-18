import React, { Children, ReactNode } from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface GroupedListProps {
  header?: string;
  footer?: string;
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const GroupedList = ({
  header,
  footer,
  children,
  containerStyle,
}: GroupedListProps) => {
  const rows = Children.toArray(children);
  const rowsCount = rows.length;
  const { styles, breakpoint } = useStyles(stylesheet);

  const getRowStyle = (index: number): StyleProp<ViewStyle> => {
    if (rowsCount === 1) return styles.single;
    if (index === 0) return styles.first;
    if (index === rowsCount - 1) return styles.last;
    return styles.middle;
  };

  const isWide = breakpoint === "wide";

  return (
    <View
      style={[styles.container, isWide && styles.containerWide, containerStyle]}
    >
      {header && (
        <View style={styles.header}>
          <Text style={styles.headerText}>{header.toUpperCase()}</Text>
        </View>
      )}
      {rows.map((row, index) =>
        React.cloneElement(row as React.ReactElement, {
          style: isWide ? styles.rowWide : getRowStyle(index), // Different styles for wide screens
        })
      )}
      {footer && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{footer}</Text>
        </View>
      )}
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: 16,
  },
  containerWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 10,
    marginLeft: 16,
  },
  footer: {
    marginTop: 10,
    marginLeft: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  footerText: {
    fontSize: 12,
    color: theme.textPresets.subtitle,
  },
  single: {
    borderRadius: 10,
  },
  first: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  middle: {
    borderRadius: 0,
  },
  last: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 0,
  },
  rowWide: {
    width: "48%",
    borderRadius: 10,
  },
}));

export default GroupedList;
