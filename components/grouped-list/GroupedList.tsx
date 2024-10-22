import { View, Text, StyleProp, ViewStyle, Platform } from "react-native";
import React, { Children } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface GroupedListProps {
  header?: string;
  footer?: string;
  children: React.ReactNode;
  extraStyles?: ViewStyle;
}

const GroupedList = ({
  children,
  header,
  footer,
  extraStyles,
}: GroupedListProps) => {
  const rows = Children.toArray(children);
  const rowsCount = rows.length;

  const { styles } = useStyles(stylesheet);

  const getRowStyleFromIndex = (index: number): StyleProp<ViewStyle> => {
    //Single item style
    if (rowsCount === 1) return styles.single;

    //Two items style
    if (rowsCount === 2) {
      if (index != 0) return styles.last;
      return styles.first;
    }

    //Whatever number of items style
    if (index === 0) return styles.first;
    if (index === rowsCount - 1) return styles.last;
    return styles.middle;
  };

  return (
    <View style={styles.containerRounded}>
      {header && (
        <View style={styles.header}>
          <Text style={styles.headerText}>{header?.toUpperCase()}</Text>
        </View>
      )}

      {rows.map((row, i) => (
        <View key={`row-${i}`} style={[getRowStyleFromIndex(i), extraStyles]}>
          {row}
        </View>
      ))}
      {footer && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{footer}</Text>
        </View>
      )}
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  containerRounded: {
    userSelect: "none",
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        maxWidth: 430, // Restricts to max 400 points on web
        minWidth: 250,
        alignSelf: "center",
        width: "100%",
      },
    }),
  },
  first: {
    backgroundColor: theme.ui.colors.card,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 0.35,
    borderColor: theme.ui.colors.border,
  },
  middle: {
    backgroundColor: theme.ui.colors.card,
    borderBottomWidth: 0.35,
    borderColor: theme.ui.colors.border,
  },
  last: {
    backgroundColor: theme.ui.colors.card,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  single: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
  },
  header: {
    marginLeft: 20,
    marginBottom: 10,
  },
  footer: {
    marginLeft: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 13,
    color: theme.textPresets.main,
  },
  footerText: {
    fontSize: 13,
    color: theme.textPresets.subtitle,
  },
}));

export default GroupedList;
