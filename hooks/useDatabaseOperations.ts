import { useState } from "react";
import { supabase } from "@/lib/supabase";

type DatabaseOperationType = "insert" | "update" | "delete" | "select";

interface OperationOptions {
  table: string;
  data?: any; // Data to insert or update
  condition?: { column: string; value: any }; // Condition for update, delete or select
  columns?: string; // Columns to select
}

export default function useDatabaseOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeOperation = async (
    type: DatabaseOperationType,
    { table, data, condition, columns }: OperationOptions
  ) => {
    setIsLoading(true);
    setError(null);

    let response;

    try {
      switch (type) {
        case "insert":
          response = await supabase.from(table).insert(data);
          break;

        case "update":
          if (!condition) {
            throw new Error("Condition is required for update operation.");
          }
          response = await supabase
            .from(table)
            .update(data)
            .eq(condition.column, condition.value);
          break;

        case "delete":
          if (!condition) {
            throw new Error("Condition is required for delete operation.");
          }
          response = await supabase
            .from(table)
            .delete()
            .eq(condition.column, condition.value);
          break;

        case "select":
          if (!condition) {
            response = await supabase.from(table).select(columns);
          } else {
            response = await supabase
              .from(table)
              .select(columns)
              .eq(condition.column, condition.value);
          }
          break;

        default:
          throw new Error("Unsupported operation type.");
      }

      if (response.error) {
        throw response.error;
      }

      return response.data;
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeOperation,
    isLoading,
    error,
  };
}
