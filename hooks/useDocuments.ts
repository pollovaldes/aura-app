import { supabase } from "@/lib/supabase";
import { VehicleDocument } from "@/types/globalTypes";
import { useEffect, useState } from "react";

export default function useDocuments() {
  const [documents, setDocuments] = useState<VehicleDocument[] | null>(null);
  const [areDocumentsLoading, setAreDocumentsLoading] = useState(false);

  const fetchDocuments = async () => {
    setAreDocumentsLoading(true);

    const { data, error } = await supabase.from("vehicle_document").select("*");

    if (error) {
      alert(
        `Ocurrió un error al obtener los documentos: \n\nMensaje de error: ${error.message}\n\nCódigo de error: ${error.code}\n\nDetalles: ${error.details}\n\nSugerencia: ${error.hint}`
      );
      setAreDocumentsLoading(false);
      return;
    }

    setDocuments(data);
    setAreDocumentsLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, areDocumentsLoading, fetchDocuments };
}
