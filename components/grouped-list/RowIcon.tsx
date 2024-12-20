import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { LucideProps } from "lucide-react-native";

interface RowIconProps {
  icon?: React.ComponentType<Partial<LucideProps>>; // Icon type
  backgroundColor?: string; // Background color for the icon container
}

const RowIcon = ({ icon: Icon, backgroundColor = "#ffffff" }: RowIconProps) => {
  if (!Icon) return null;

  const styles = getStyles(backgroundColor);

  return (
    <View style={styles.container}>
      <Icon color={styles.icon.color} size={styles.icon.fontSize} />
    </View>
  );
};

const getStyles = (backgroundColor: string) =>
  StyleSheet.create({
    container: {
      width: 28,
      height: 28,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor,
      marginRight: 12,
    },
    icon: {
      fontSize: Platform.select({
        ios: 22,
        android: 22,
        web: 22,
      }),
      color: "#FFFFFF",
    },
  });

export default RowIcon;
