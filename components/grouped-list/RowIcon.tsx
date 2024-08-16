import { View, Text, StyleSheet } from "react-native";
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
  },
});
