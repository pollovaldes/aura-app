import { supabase } from "@/lib/supabase";
import { useState } from "react";

export type Document = {
  vehicle_id: string;
  document_id: string;
  title: string;
  description: string;
  // uri: string; // TODO: Add this field
};

export default function useDocuments() {
  const [documents, setDocuments] = useState<Document[] | null>(null);
  const [areDocumentsLoading, setAreDocumentsLoading] = useState(false);

  return { documents, areDocumentsLoading };
}
