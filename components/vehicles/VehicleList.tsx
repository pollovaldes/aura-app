import { View, Text, FlatList, Pressable, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ChevronRight, Download, Plus } from "lucide-react-native";
import { useSearch } from "@/context/SearchContext";
import useProfile from "@/hooks/useProfile";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import LoadingScreen from "../dataStates/LoadingScreen";
import ErrorScreen from "../dataStates/ErrorScreen";
import EmptyScreen from "../dataStates/EmptyScreen";
import TruckThumbnail from "./TruckThumbnail";
import React from "react";
import AddVehicleComponent from "./AddVehicleComponent";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from "@/lib/supabase";
import * as Permissions from 'expo-permissions';

export default function VehicleList() {
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { styles } = useStyles(stylesheet);
  const { searchState } = useSearch();
  const searchQuery = searchState["trucks"] || "";

  useEffect(() => {
    if (searchQuery && vehicles) {
      const filtered = vehicles.filter((truck) =>
        `${truck.economic_number} ${truck.brand} ${truck.sub_brand} (${truck.year}) ${truck.plate}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchQuery, vehicles]);

  if (vehiclesAreLoading) {
    return <LoadingScreen caption="Cargando vehículos" />;
  }

  if (isProfileLoading) {
    return <LoadingScreen caption="Cargando perfil y permisos" />;
  }

  if (!profile) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchProfile}
      />
    );
  }

  if (vehicles === null) {
    return (
      <ErrorScreen
        caption={`Tuvimos un problema al cargar los vehículos. \n Intenta nuevamente en unos momentos.`}
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
    );
  }

  if (vehicles.length === 0) {
    return (
      <EmptyScreen
        caption="Ningún vehículo por aquí"
        buttonCaption="Actualizar"
        retryFunction={fetchVehicles}
      />
    );
  }

  if (filteredVehicles?.length === 0 && searchQuery) {
    return <EmptyScreen caption="Ningún resultado" />;
  }

  const getStoragePermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status !== 'granted') {
      alert('Sorry, we need storage permissions to make this work!');
      return false;
    }
    return true;
  };

  const handleDownloadCsv = async () => {
    try {
      // Fetch data from Supabase table
      console.log('Starting to fetch data...');
      const { data, error } = await supabase.from('vehicles').select('*');
  
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }
  
      if (!data || data.length === 0) {
        console.log('No data available to download');
        return;
      }
  
      // Convert data to CSV format
      const filteredKeys = Object.keys(data[0]).filter(key => key !== 'id');
      const csvHeader = filteredKeys.join(',');
      const csvRows = data.map(row => {
        return filteredKeys.map(key => {
          const value = row[key];
          return `"${value}"`; // Wrap each value in double quotes to handle commas within values
        }).join(',');
      });
      
      const csvContent = [csvHeader, ...csvRows].join('\n');
      console.log('CSV content prepared:', csvContent);
  
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // For iOS and Android
        const filePath = FileSystem.cacheDirectory + 'data.csv';
        await FileSystem.writeAsStringAsync(filePath, csvContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
  
        console.log('File written successfully at:', filePath);
  
        if (Platform.OS === 'ios') {
          // Share the file with the user for iOS
          if (!(await Sharing.isAvailableAsync())) {
            console.error("Sharing isn't available on this device");
            return;
          }
          await Sharing.shareAsync(filePath);
          console.log('Sharing triggered successfully');
        } else if (Platform.OS === 'android') {
          // For Android, use FileSystem download option
          console.log('Attempting to share on Android...');
          await Sharing.shareAsync(filePath);
          console.log('Sharing triggered successfully on Android');
        }
      } else if (Platform.OS === 'web') {
        // For Web: use Blob and create a link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Download triggered successfully for Web');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <>
      {profile.role === "ADMIN" ||
        (profile.role === "OWNER" && (
          <Stack.Screen
            options={{
              headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                  <Pressable onPress={() => {console.log("Button clicked"); handleDownloadCsv(); }} style={{ marginRight: 10 }}>
                    <Download color={styles.plusIcon.color} />
                  </Pressable>
                  <Pressable onPress={() => setIsModalVisible(true)}>
                    <Plus color={styles.plusIcon.color} />
                  </Pressable>
                </View>
              ),
            }}
          />
        ))}
      <FlatList
        refreshing={vehiclesAreLoading}
        onRefresh={fetchVehicles}
        contentInsetAdjustmentBehavior="automatic"
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/vehicles/${item.id}` }} asChild>
            <Pressable>
              <View style={styles.container}>
                <View style={styles.contentContainer}>
                  <View style={styles.imageContainer}>
                    <TruckThumbnail vehicleId={item.id} />
                  </View>
                  <Text style={styles.itemText}>
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`${item.brand} ${item.sub_brand} (${item.year})\n`}</Text>
                    {`Placa: ${item.plate}\n`}
                    {`Número económico: ${item.economic_number}\n`}
                  </Text>
                </View>
                <View style={styles.chevronView}>
                  <ChevronRight color={styles.chevron.color} />
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
      <AddVehicleComponent
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
  },
  loadingContainer: {
    gap: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  lackText: {
    fontSize: 16,
    color: theme.textPresets.main,
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
    width: 100,
    height: 100,
  },
  emptyImageContainer: {
    borderRadius: 6,
    backgroundColor: theme.ui.colors.border,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageIcon: {
    color: theme.textPresets.main,
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
  plusIcon: {
    fontSize: 16,
    color: theme.headerButtons.color,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
}));
