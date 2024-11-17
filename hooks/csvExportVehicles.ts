
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { supabase } from "@/lib/supabase";

export const exportVehiclesToCsv = async () => {
  try {
    const { data, error } = await supabase.from('vehicles').select('*');

    if (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data');
    }

    if (!data || data.length === 0) {
      throw new Error('No data available to download');
    }

    type DataType = {
      id: number,
      brand: string;
      sub_brand: string;
      year: number;
      plate: string;
      serial_number: string;
      economic_number: string;
      gasoline_threshold: number;
      // Add more fields if needed
    };
    
    // Create a mapping of original keys to custom header names
    const headerMapping: { [key in keyof DataType]?: string } = {
      brand: 'Marca',
      sub_brand: 'Submarca',
      year: "Año",
      plate: "Placa",
      serial_number: "Número de serie",
      economic_number: "Número económico",
      gasoline_threshold: "Límite mensual de gasolina"
    };
    
    // Convert data to CSV format, excluding the 'id' column and renaming headers
    const filteredKeys = (Object.keys(data[0]) as (keyof DataType)[]).filter(key => key !== 'id');
    
    // Create CSV Header using the custom mapping, excluding 'id'
    const csvHeader = filteredKeys.map(key => headerMapping[key] || key).join(',');
    
    // Create CSV Rows, excluding 'id'
    const csvRows = data.map(row => {
      return filteredKeys.map(key => {
        const value = row[key];
        return `"${value}"`; // Wrap each value in double quotes to handle commas within values
      }).join(',');
    });
    
    // Combine the header and rows to form the complete CSV content
    const csvContent = [csvHeader, ...csvRows].join('\n');

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const filePath = FileSystem.cacheDirectory + 'vehiculos.csv';
      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        throw new Error("Sharing isn't available on this device");
      }
      await Sharing.shareAsync(filePath);
    } else if (Platform.OS === 'web') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vehiculos.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
};