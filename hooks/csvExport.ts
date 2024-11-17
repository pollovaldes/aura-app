
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

    const filteredKeys = Object.keys(data[0]).filter(key => key !== 'id');
    const csvHeader = filteredKeys.join(',');
    const csvRows = data.map(row => {
      return filteredKeys.map(key => `"${row[key]}"`).join(',');
    });
    
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