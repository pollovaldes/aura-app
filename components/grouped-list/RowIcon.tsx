import { View, Text, StyleSheet, Platform } from "react-native";
import React, { ReactNode } from "react";

interface RowIconProps {
  icon: ReactNode;
  backgroundColor: string;
}

const RowIcon = ({ icon, backgroundColor: color }: RowIconProps) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>{icon}</View>
  );
};

export default RowIcon;

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 17,
    ...Platform.select({
      web: {
        width: 25,
        height: 25,
        borderRadius: 5,
        marginRight: 12,
      },
    }),
  },
});
