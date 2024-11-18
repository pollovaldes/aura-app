import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

// Define the type for a maintenance record
export type Maintenance = {
  id: string; // Maintenance ID
  vehicle_id: string; // Vehicle ID
  issued_by: string;
  issued_datetime: string;
  resolved_by?: string;
  resolved_datetime?: string;
  title: string;
  description: string;
  status: "PENDING_REVISION" | "IN_REVISION" | "SOLVED";
};

export default function useMaintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    Maintenance[] | null
  >(null);
  const [areMaintenanceRecordsLoading, setAreMaintenanceRecordsLoading] =
    useState<boolean>(false);

  // Fetch maintenance records from the Supabase table
  const fetchMaintenance = async (): Promise<void> => {
    setAreMaintenanceRecordsLoading(true);

    const { data, error } = await supabase
      .from("maintenance") // Type the table response
      .select(
        "id, vehicle_id, issued_by, issued_datetime, resolved_by, resolved_datetime, title, description, status"
      );

    if (error) {
      alert(
        `Ocurrió un error al obtener los registros de mantenimiento: \n\n` +
          `Mensaje de error: ${error.message}\n\n` +
          `Código de error: ${error.code}\n\n` +
          `Detalles: ${error.details}\n\n` +
          `Sugerencia: ${error.hint}`
      );
      setAreMaintenanceRecordsLoading(false);
      return;
    }

    setMaintenanceRecords(data);
    setAreMaintenanceRecordsLoading(false);
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  return { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance };
}
