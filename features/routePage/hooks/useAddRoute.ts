import { useCreateRoute } from "@/features/tabs/vehicles/modals/addRouteModal/CreateRouteContext";
import { supabase } from "@/lib/supabase";
import { User, Vehicle } from "@/types/globalTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useActiveRoute } from "./useActiveRoute";
import { useRoutes } from "./useRoutes";

const showToast = (title: string, caption: string) => {
  Toast.show({
    type: "alert",
    text1: title,
    text2: caption,
  });
};

export function useAddRoute(profile: User) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);
  const { routeData } = useCreateRoute();
  const { refetchRouteById } = useRoutes();
  const { setActiveRouteId } = useActiveRoute(profile.id);

  async function addRoute(close: () => void, vehicle: Vehicle) {
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("routes")
      .insert([
        {
          title: routeData.title || "",
          description: routeData.description || "",
          vehicle_id: vehicle.id,
          user_id: profile.id,
          is_active: true,
          started_at: routeData.started_at || new Date().toISOString(),
          started_address: routeData.started_address || "",
          started_location_latitude: routeData.started_location_latitude ?? 0,
          started_location_longitude: routeData.started_location_longitude ?? 0,
        },
      ])
      .select();

    if (error) {
      alert("Ocurrió un error y no se pudo comenzar la ruta:\n" + error.message);
      setError(error);
      setIsLoading(false);
      console.error(error);
      throw error;
    }

    if (data) {
      setError(null);
      setIsLoading(false);
      refetchRouteById(data[0].id);
      setActiveRouteId(data[0].id);
      close();
      showToast("Ruta iniciada", "La ruta ha comenzado");
      return;
    }
  }

  return {
    isLoading,
    error,
    addRoute,
  };
}
