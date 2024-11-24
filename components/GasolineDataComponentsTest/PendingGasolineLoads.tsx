import React, { useState } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { supabase } from "@/lib/supabase";
import { FormButton } from '../Form/FormButton';
import FormInput from '../Form/FormInput';
import GasolineLoadStatus from './GasolineLoadStatus';

interface PendingLoad {
  id: string;
  amount: number;
  liters: number;
  requested_at: string;
  user_id: string;
  vehicle_id: string;
}

interface PendingGasolineLoadsProps {
  vehicleId: string;
  profile: {
    id: string;
    role: string;
  };
}

export default function PendingGasolineLoads({ vehicleId, profile }: PendingGasolineLoadsProps) {
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

  if (profile.role !== 'OWNER' && profile.role !== 'ADMIN') {
    return <GasolineLoadStatus vehicleId={vehicleId} userId={profile.id} />;
  }

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
            Fecha: {new Date(load.requested_at).toLocaleDateString()}
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
    fontWeight: 'bold',
    color: theme.textPresets.main,
    marginBottom: 15,
    textAlign: 'center',
  },
  loadCard: {
    backgroundColor: theme.ui.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
  },
  loadInfo: {
    color: theme.textPresets.main,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  rejectContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    gap: 12,
  },
}));