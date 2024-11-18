
import React, { useState } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { supabase } from "@/lib/supabase";
import { FormButton } from '../Form/FormButton';
import FormInput from '../Form/FormInput';

interface PendingLoad {
  id: string;
  amount: number;
  liters: number;
  created_at: string;
  user_id: string;
  vehicle_id: string;
}

export default function PendingGasolineLoads({ vehicleId }: { vehicleId: string }) {
  const { styles } = useStyles(stylesheet);
  const [pendingLoads, setPendingLoads] = useState<PendingLoad[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);

  const fetchPendingLoads = async () => {
    const { data, error } = await supabase
      .from('gasoline_loads')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'pending');

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setPendingLoads(data);
    }
  };

  const handleApprove = async (loadId: string) => {
    const { error } = await supabase
      .from('gasoline_loads')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', loadId);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      fetchPendingLoads();
      Alert.alert('Éxito', 'Carga aprobada exitosamente');
    }
  };

  const handleReject = async (loadId: string) => {
    const { error } = await supabase
      .from('gasoline_loads')
      .update({
        status: 'rejected',
        rejection_reason: rejectReason,
        rejected_at: new Date().toISOString(),
        rejected_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', loadId);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setRejectReason('');
      setSelectedLoadId(null);
      fetchPendingLoads();
      Alert.alert('Éxito', 'Carga rechazada exitosamente');
    }
  };

  React.useEffect(() => {
    fetchPendingLoads();
  }, [vehicleId]);

  if (pendingLoads.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cargas Pendientes de Aprobación</Text>
      {pendingLoads.map((load) => (
        <View key={load.id} style={styles.loadCard}>
          <Text style={styles.loadInfo}>Monto: ${load.amount}</Text>
          <Text style={styles.loadInfo}>Litros: {load.liters}L</Text>
          <Text style={styles.loadInfo}>
            Fecha: {new Date(load.created_at).toLocaleDateString()}
          </Text>
          
          <View style={styles.buttonContainer}>
            <FormButton 
              title="Aprobar"
              onPress={() => handleApprove(load.id)}
            />
            <FormButton 
              title="Rechazar"
              onPress={() => setSelectedLoadId(load.id)}
              
            />
          </View>

          {selectedLoadId === load.id && (
            <View style={styles.rejectContainer}>
              <FormInput
                placeholder="Razón del rechazo"
                value={rejectReason}
                onChangeText={setRejectReason} description={''}                
              />
              <FormButton 
                title="Confirmar Rechazo"
                onPress={() => handleReject(load.id)}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: '95%',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPresets.main,
    marginBottom: 10,
  },
  loadCard: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  loadInfo: {
    color: theme.textPresets.main,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  rejectContainer: {
    marginTop: 10,
    gap: 10,
  },
}));