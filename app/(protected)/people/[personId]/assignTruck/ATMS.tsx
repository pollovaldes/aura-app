import { View, Text, Button, ScrollView, FlatList, Pressable, Image, Dimensions, Alert } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import FormTitle from '@/app/auth/FormTitle';
import { FormButton } from '@/components/Form/FormButton';
import trucks from '@/app/(protected)/trucks';
import { ChevronRight, Circle, CheckCircle } from 'lucide-react-native'; // Importamos CheckCircle para mostrar el círculo lleno
import useTruck from '@/hooks/truckHooks/useTruck';
import React, { useState } from 'react';

export default function AssignTruckModalScreen() {
  const router = useRouter();
  const { styles } = useStyles(stylesheet);
  const { trucks, loading } = useTruck({ isComplete: false });
  const [selectedTrucks, setSelectedTrucks] = useState<Set<string>>(new Set()); // Estado para manejar los camiones seleccionados

  const toggleTruckSelection = (id: string) => {
    const updatedSelection = new Set(selectedTrucks);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id); // Deselecciona el camión si ya está seleccionado
    } else {
      updatedSelection.add(id); // Selecciona el camión
    }
    setSelectedTrucks(updatedSelection);
  };

  const handleAssign = () => {
    const selectedArray = Array.from(selectedTrucks);
    Alert.alert('Camiones asignados', selectedArray.join(', '));
    console.log('Enviando camiones seleccionados:', selectedArray);
  };

  return (
    <View style={styles.modalContainer}>
      <Stack.Screen options={{
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <View style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>
                Cancelar
              </Text>
            </View>
          </Pressable>
        ),
        headerRight: () => (
          <Pressable onPress={handleAssign}>
            <View style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>
                Asignar
              </Text>
            </View>
          </Pressable>
        ),
      }} />
      <Text style={styles.closeButton} onPress={() => router.back()}>
        Cerrar
      </Text>
      {/* Form goes here */}
      <View style={styles.section}>
        <View style={styles.group}>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            data={trucks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedTrucks.has(item.id);
              return (
                <Pressable onPress={() => toggleTruckSelection(item.id)}>
                  <View style={[styles.container, isSelected ? styles.selectedItem : null]}>
                    <View style={styles.contentContainer}>
                      <View style={styles.imageContainer}>
                        <Image
                          style={styles.image}
                          source={{ uri: "https://placehold.co/512x512.png" }}
                        />
                      </View>
                      <Text style={styles.itemText}>
                        {`${item.marca} ${item.sub_marca} (${item.modelo})`}
                      </Text>
                    </View>
                    <View style={styles.chevronView}>
                      {isSelected ? (
                        <CheckCircle color={styles.chevron.color} />
                      ) : (
                        <Circle color={styles.chevron.color} />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalContainer: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
    marginBottom: 60,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  selectedItem: {
    backgroundColor: '#cce5ff', // Color de fondo cuando el elemento está seleccionado
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    padding: 12,
  },
  image: {
    borderRadius: 6,
    width: 50,
    height: 50,
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
  closeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
}));