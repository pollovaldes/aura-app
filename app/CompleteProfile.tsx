import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/context/SessionContext';
import { Redirect } from 'expo-router';
import usePruebas from '@/components/AskName';

const CompleteProfileScreen = () => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const {isProfileLoading, isNameNull} = usePruebas();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isProfileLoading && !isNameNull) {
      setRedirect(true);
    }
  }, [isProfileLoading, isNameNull]);


  const updateProfile = async () => {

    setLoading(true);
    try {
      const user = session?.user;
      if (!user) {
        throw new Error('User not logged in');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Profile updated successfully!');
      setRedirect(true);
    } catch (error) {
      Alert.alert('Error');
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Redirect href="/auth" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
      />
      <Button title={loading ? 'Updating...' : 'Update Profile'} onPress={updateProfile} disabled={loading} />
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

export default CompleteProfileScreen;
