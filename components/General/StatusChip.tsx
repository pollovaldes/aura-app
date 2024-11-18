import React from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface StateConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
}

interface StatusChipProps {
  status: string;
  statesConfig: Record<string, StateConfig>;
}

const StatusChip: React.FC<StatusChipProps> = ({ status, statesConfig }) => {
  const config = statesConfig[status] || {
    text: "Desconocido",
    backgroundColor: "#e0e0e0", // Fondo predeterminado
    textColor: "#000", // Texto predeterminado
  };

  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.status, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.statusText, { color: config.textColor }]}>
        {config.text}
      </Text>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    width: 115,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
}));

export default StatusChip;
