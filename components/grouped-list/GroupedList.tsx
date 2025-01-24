import React, { Children, ReactNode } from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface GroupedListProps {
  header?: string;
  footer?: string;
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  isInModal?: boolean;
}

const GroupedList = ({ header, footer, children, containerStyle, isInModal = false }: GroupedListProps) => {
  const rows = Children.toArray(children).filter(
    (child) =>
      child !== null && React.isValidElement(child) && (child.props.show === undefined || child.props.show === true)
  );
  const rowsCount = rows.length;

  if (rowsCount === 0) return null;

  const { styles, breakpoint } = useStyles(stylesheet);

  const getRowStyle = (index: number): StyleProp<ViewStyle> => {
    if (rowsCount === 1) return styles.single;
    if (index === 0) return styles.first;
    if (index === rowsCount - 1) return styles.last;
    return styles.middle;
  };

  return (
    <View style={[styles.container(isInModal), containerStyle]}>
      {header && (
        <View style={styles.header}>
          <Text style={styles.headerText}>{header.toUpperCase()}</Text>
        </View>
      )}
      {rows.map((row, index) =>
        React.cloneElement(row as React.ReactElement, {
          style: getRowStyle(index),
          isInModal: isInModal,
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
  container: (isInModal: boolean) => ({
    paddingHorizontal: isInModal ? 0 : 16,
  }),
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
}));

export default GroupedList;
