import { View, Text, FlatList, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Circle, CheckCircle } from 'lucide-react-native';
import useTruck from '@/hooks/truckHooks/useTruck';
import { useAssignTruck } from '@/hooks/peopleHooks/useAssignTruck'; // Importa el hook
import React, { useEffect, useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import { useCreateNotification } from '@/hooks/notifications/useCreateNotification';

export default function AssignTruckModalScreen() {
  const router = useRouter();
  const { handleCreateNotification } = useCreateNotification();

  const { styles } = useStyles(stylesheet);
  const { trucks, loading } = useTruck({ isComplete: false });
  const [selectedTrucks, setSelectedTrucks] = useState<Set<string>>(new Set()); // Estado para manejar los camiones seleccionados
  const { personId } = useLocalSearchParams<{ personId: string }>();

  const { loading: assignLoading, assignTruck } = useAssignTruck({ id_conductor: personId }); // Crea un hook para asignar camiones

  const { searchState } = useSearch(); // Get the search state from the context
  const searchQuery = searchState["ATMS"] || ""; // Use the search query for "ATMS"
  const [filteredTrucks, setFilteredTrucks] = useState(trucks);

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return ''; // Verifica si el texto es nulo, indefinido o vacío
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleTruckSelection = (id: string) => {
    const updatedSelection = new Set(selectedTrucks);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id); // Deselecciona el camión si ya está seleccionado
    } else {
      updatedSelection.add(id); // Selecciona el camión
    }

    setSelectedTrucks(updatedSelection);
  };

  const handleAssign = async () => {
    if (selectedTrucks.size === 0) {
      Alert.alert("Error", "Por favor, selecciona al menos un camión.");
      return;
    }

    const camionesSeleccionados = Array.from(selectedTrucks);
    await assignTruck(camionesSeleccionados);

    const camionesDetalles = trucks.filter(truck => camionesSeleccionados.includes(truck.id));

    // Crear un texto con la información de todos los camiones seleccionados
    const detallesCamiones = camionesDetalles.map(truck => `Camión ${truck.numero_economico} ${truck.marca} ${truck.sub_marca} (${truck.modelo})`).join(',\n');


    await handleCreateNotification({
      id_usuario: personId,
      title: `Nuevos camiones asignados`,
      caption: `Se han asignado ${camionesDetalles.length} camiones:`,
      description: 'Se han asignado los camiones:\n' + detallesCamiones,
      kind: 'info'
    });
    router.back();
  };

  useEffect(() => {
    // Filter trucks based on the search query
    if (searchQuery) {
      const filtered = trucks.filter((truck) =>
        `${truck.numero_economico} ${truck.marca} ${truck.sub_marca} (${truck.modelo})`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredTrucks(filtered);
    } else {
      setFilteredTrucks(trucks);
    }
  }, [searchQuery, trucks]);

  if (loading) {
    console.log('Loading...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <Stack.Screen options={{
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <View style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>
                Cancelar
              </Text>
            </View>
          </Pressable>
        ),
        headerRight: () => (
          <Pressable onPress={handleAssign} disabled={assignLoading}
            style={({ pressed }) => [{ opacity: assignLoading ? 0.5 : pressed ? 0.7 : 1 }]}>
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
      <View style={styles.section}>
        <View style={styles.group}>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            data={filteredTrucks}
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
                        <Text style={{ fontWeight: 'bold' }}>{item.numero_economico}</Text>
                        {`\n${capitalizeWords(item.marca)} ${capitalizeWords(item.sub_marca)} (${capitalizeWords(item.modelo)})`}
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
    flex: 1,
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
    marginBottom: 20,
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
    backgroundColor: '#cce5ff',
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