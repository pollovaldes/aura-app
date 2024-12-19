import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { supabase } from "@/lib/supabase";

interface GasolineLoadStatusProps {
  vehicleId: string;
  userId: string;
}

interface GasolineLoad {
  id: string;
  amount: number;
  liters: number;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  rejection_reason?: string;
}

export default function GasolineLoadStatus({
  vehicleId,
  userId,
}: GasolineLoadStatusProps) {
  const { styles } = useStyles(stylesheet);
  const [loads, setLoads] = useState<GasolineLoad[]>([]);

  const fetchLoads = async () => {
    const { data, error } = await supabase
      .from("gasoline_loads")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .eq("status", "pending");

    if (!error && data) {
      setLoads(data);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, [vehicleId, userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#FFC107";
    }
  };

  if (loads.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Cargas de Gasolina</Text>
      {loads.map((load) => (
        <View key={load.id} style={styles.loadCard}>
          <View style={styles.loadHeader}>
            <Text style={styles.loadInfo}>Monto: ${load.amount}</Text>
            <Text
              style={[styles.status, { color: getStatusColor(load.status) }]}
            >
              {load.status === "pending" && "Pendiente"}
              {load.status === "approved" && "Aprobada"}
              {load.status === "rejected" && "Rechazada"}
            </Text>
          </View>
          <Text style={styles.loadInfo}>Litros: {load.liters}L</Text>
          <Text style={styles.loadInfo}>
            Fecha: {new Date(load.requested_at).toLocaleDateString()}
          </Text>
          {load.status === "rejected" && load.rejection_reason && (
            <Text style={styles.rejectionReason}>
              Razón: {load.rejection_reason}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: "95%",
    marginVertical: 10,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.textPresets.main,
    marginBottom: 15,
    textAlign: "center",
  },
  loadCard: {
    backgroundColor: theme.ui.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
  },
  loadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  loadInfo: {
    color: theme.textPresets.main,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  status: {
    fontWeight: "bold",
    fontSize: 14,
  },
  rejectionReason: {
    color: "#F44336",
    marginTop: 8,
    fontSize: 14,
    fontStyle: "italic",
  },
}));
