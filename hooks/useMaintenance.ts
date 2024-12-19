import { supabase } from "@/lib/supabase";
import { User } from "@/types/User";
import { useEffect, useState } from "react";

export type Maintenance = {
  id: string;
  vehicle_id: string;
  issued_by: User;
  issued_datetime: string;
  resolved_by?: User | null;
  resolved_datetime?: string;
  title: string;
  description: string;
  status: "PENDING_REVISION" | "IN_REVISION" | "SOLVED";
};

export default function useMaintenance(vehicleId?: string, recordId?: string) {
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    Maintenance[] | null
  >(null);
  const [areMaintenanceRecordsLoading, setAreMaintenanceRecordsLoading] =
    useState<boolean>(false);

  const fetchUserById = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, name, father_last_name, mother_last_name, position, role, is_fully_registered",
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      return null;
    }

    return data as User;
  };

  const fetchMaintenance = async (): Promise<void> => {
    setAreMaintenanceRecordsLoading(true);

    let query = supabase
      .from("maintenance")
      .select(
        "id, vehicle_id, issued_by, issued_datetime, resolved_by, resolved_datetime, title, description, status",
      );

    if (vehicleId) {
      query = query.eq("vehicle_id", vehicleId);
    } else if (recordId) {
      query = query.eq("id", recordId);
    } else {
      query = query.order("issued_datetime", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        `Ocurrió un error al obtener los registros de mantenimiento: \n\n` +
          `Mensaje de error: ${error.message}\n\n` +
          `Código de error: ${error.code}\n\n` +
          `Detalles: ${error.details}\n\n` +
          `Sugerencia: ${error.hint}`,
      );
      setAreMaintenanceRecordsLoading(false);
      return;
    }

    const enrichedRecords: Maintenance[] = await Promise.all(
      data.map(async (record: any) => {
        let resolvedByUser: User | null = null;
        let issuedByUser: User | null = null;

        if (record.resolved_by) {
          resolvedByUser = await fetchUserById(record.resolved_by);
        }

        if (record.issued_by !== undefined) {
          issuedByUser = await fetchUserById(record.issued_by);
        }

        return {
          id: record.id,
          vehicle_id: record.vehicle_id,
          issued_by: issuedByUser as User,
          issued_datetime: record.issued_datetime,
          resolved_by: resolvedByUser,
          resolved_datetime: record.resolved_datetime,
          title: record.title,
          description: record.description,
          status: record.status,
        };
      }),
    );

    setMaintenanceRecords(enrichedRecords);
    setAreMaintenanceRecordsLoading(false);
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  return { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance };
}
