import { View, Text, FlatList, Pressable, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Circle, CheckCircle } from 'lucide-react-native';
import useAssignVehicle from '@/hooks/peopleHooks/useAssignVehicle';
import React, { useEffect, useState } from 'react';
import { useSearch } from '@/context/SearchContext';
import { supabase } from '@/lib/supabase';

type Truck =
  {
    id: string;
    numero_economico: string;
    marca: string;
    sub_marca: string;
    modelo: string;
  }

export default function SeeTruckModalScreen() {
  const router = useRouter();
  const { styles } = useStyles(stylesheet);
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [eraseTrucks, setEraseTrucks] = useState<{ vehicle_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  //const { trucks, loading } = useTruck({ isComplete: false }); // quitar

  const [selectedTrucks, setSelectedTrucks] = useState<Set<string>>(new Set()); // Estado para manejar los camiones seleccionados
  const { loading: assignLoading, assignVehicle } = useAssignVehicle({ id_conductor: personId }); // Crea un hook para asignar camiones
  const { searchState } = useSearch(); // Get the search state from the context
  const searchQuery = searchState["STMS"] || ""; // Use the search query for "ATMS"
  const [filteredTrucks, setFilteredTrucks] = useState(trucks);

  //Esto Sirve
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


  useEffect(() => {
    const fetchEraseSelected = async () => {
      try {
        const { data, error } = await supabase
          .from("vehicle_user")
          .select("vehicle_id")
          .eq("user_id", personId);

        if (error) {
          throw error;
        }

        setEraseTrucks(data || []);
      } catch (error) {
        console.error("Error fetching erase trucks:", error);
      } finally {

      }
    };

    fetchEraseSelected();
  }, [personId]);

  useEffect(() => {
    if (eraseTrucks.length === 0) {
      return;
    }

    const fetchEraseTrucksSelected = async () => {
      console.log(loading, "a");
      try {
        const truckIds = eraseTrucks.map((truck) => truck.vehicle_id);
        const { data, error } = await supabase
          .from("camiones")
          .select("id, numero_economico, marca, sub_marca, modelo")
          .order('numero_economico', { ascending: true })
          .in("id", truckIds);

        if (error) {
          throw error;
        }

        setTrucks(data as Truck[]);
      } catch (error) {
        console.error("Error fetching trucks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEraseTrucksSelected();
  }, [eraseTrucks]);

  useEffect(() => {
    console.log(trucks);
  }, [trucks]);


  useEffect(() => {
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
  }, [searchQuery, trucks, loading]);

  if (trucks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
              <View style={styles.closeButtonContainer}>
                <Text style={styles.closeButton}>
                  Cancelar
                </Text>
              </View>
            </Pressable>
          )
        }} />
        <Text style={{ fontSize: 36, textAlign: 'center' }}>No hay camiones asignados</Text>
      </View>
    );
  }

  if (loading) {
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
          <Pressable onPress={() => { Alert.alert("Aqui futuramente se desasignaran camiones") }} disabled={assignLoading}
            style={({ pressed }) => [{ opacity: assignLoading ? 0.5 : pressed ? 0.7 : 1 }]}>
            <View style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>
                Desasignar
              </Text>
            </View>
          </Pressable>
        ),
      }} />
      <Text style={styles.closeButton} onPress={() => router.back()}>
        Cerrar
      </Text>
      <View style={styles.section}>
        <View style={[styles.group, { height: Dimensions.get("screen").height, paddingBottom: "40%" }]}>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            data={filteredTrucks}
            keyExtractor={(item) => item.id}
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