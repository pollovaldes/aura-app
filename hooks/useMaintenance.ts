import { supabase } from "@/lib/supabase";
import { Maintenance } from "@/types/globalTypes";
import { useEffect, useState } from "react";

export default function useMaintenance(vehicleId?: string, maintenanceId?: string) {
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[] | null>(null);
  const [areMaintenanceRecordsLoading, setAreMaintenanceRecordsLoading] = useState<boolean>(false);

  const fetchMaintenance = async () => {
    setAreMaintenanceRecordsLoading(true);

    let query = supabase.from("maintenance").select(`
      *,
      issued_by:profiles!maintenance_issued_by_fkey (*),
      resolved_by:profiles!maintenance_resolved_by_fkey (*),
      vehicles (*)
    `);

    if (vehicleId) {
      query = query.eq("vehicle_id", vehicleId);
    } else if (maintenanceId) {
      query = query.eq("id", maintenanceId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        `Error fetching maintenance records: \n\n` +
          `Message: ${error.message}\n\n` +
          `Code: ${error.code}\n\n` +
          `Details: ${error.details}\n\n` +
          `Hint: ${error.hint}`
      );
      setAreMaintenanceRecordsLoading(false);
      setMaintenanceRecords(null);
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
