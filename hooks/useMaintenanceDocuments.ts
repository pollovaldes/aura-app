import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export type MaintenanceDocument = {
  document_id: string;
  vehicle_id: string;
  maintenance_id: string;
  title: string;
  description: string;
  created_at: string;
  // uri: string; // TODO: Add this field
};

export default function useMaintenanceDocuments(maintenanceId?: string) {
  const [maintenanceDocuments, setMaintenanceDocuments] = useState<
    MaintenanceDocument[] | null
  >(null);
  const [areMaintenanceDocumentsLoading, setAreMaintenanceDocumentsLoading] =
    useState(false);

  const fetchMaintenanceDocuments = async () => {
    setAreMaintenanceDocumentsLoading(true);

    const query = supabase
      .from("vehicle_maintenance_documentation")
      .select(
        "document_id, vehicle_id, maintenance_id, title, description, created_at",
      );

    if (maintenanceId) {
      query.eq("maintenance_id", maintenanceId);
    }

    query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      alert(
        `Ocurrió un error al obtener los documentos: \n\nMensaje de error: ${error.message}\n\nCódigo de error: ${error.code}\n\nDetalles: ${error.details}\n\nSugerencia: ${error.hint}`,
      );
      setAreMaintenanceDocumentsLoading(false);
      return;
    }

    setMaintenanceDocuments(data);
    setAreMaintenanceDocumentsLoading(false);
  };

  useEffect(() => {
    fetchMaintenanceDocuments();
  }, [maintenanceId]); // Refetch data if maintenanceId changes

  return {
    maintenanceDocuments,
    areMaintenanceDocumentsLoading,
    fetchMaintenanceDocuments,
  };
}
