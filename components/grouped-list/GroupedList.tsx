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
  // Filter rows to include only visible ones
  const rows = Children.toArray(children).filter(
    (child) =>
      child !== null &&
      React.isValidElement(child) &&
      (child.props.show === undefined || child.props.show === true), // Include rows without `show` or with `show={true}`
  );
  const rowsCount = rows.length;

  // If no rows are visible, do not render the GroupedList
  if (rowsCount === 0) return null;

  const { styles, breakpoint } = useStyles(stylesheet);

  const getRowStyle = (index: number): StyleProp<ViewStyle> => {
    if (rowsCount === 1) return styles.single; // Single item
    if (index === 0) return styles.first; // First item
    if (index === rowsCount - 1) return styles.last; // Last item
    return styles.middle; // Middle item
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
          style: isWide ? styles.rowWide : getRowStyle(index), // Apply styles
        }),
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
