import React, { useState } from 'react';
import { View, Button, TextInput, Alert, StyleSheet, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/context/SessionContext';

const UpdateNameButton = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const session = useSession();

  const updateName = async () => {
    setLoading(true);
    try {
      const user = session?.user;
      if (!user) {
        throw new Error('User not logged in');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Name updated successfully!');
    } catch (error) {
      Alert.alert('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Notificaciones</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default UpdateNameButton;
