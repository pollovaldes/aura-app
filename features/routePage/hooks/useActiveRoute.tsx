import { useContext, useEffect, useState } from "react";
import { RoutesContext } from "../context/RoutesContext";
import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";

const showToast = (title: string, caption: string) => {
  Toast.show({
    type: "alert",
    text1: title,
    text2: caption,
  });
};

export function useActiveRoute(profileId: string | null | undefined) {
  const { routes, setRoutes, activeRouteId, setActiveRouteId, activeRouteIsLoading, setActiveRouteIsLoading } =
    useContext(RoutesContext);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function fetchActiveRouteIdStandalone(routeId: string) {
    const { data, error: fetchError } = await supabase
      .from("routes")
      .select(
        `
          *,
          vehicles(*),
          profiles(*),
          route_events(
            *,
            refueling_events(*),
            break_events(*),
            emergency_events(*),
            failure_events(*),
            other_events(*)
          )
        `
      )
      .eq("id", routeId);

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      return;
    }

    if (data && data.length > 0) {
      setRoutes((prev) => ({ ...prev, [data[0].id]: data[0] }));
    }
  }

  async function fetchActiveRoute() {
    setActiveRouteIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("routes")
      .select(
        `
          *,
          vehicles(*),
          profiles(*),
          route_events(
            *,
            refueling_events(*),
            break_events(*),
            emergency_events(*),
            failure_events(*),
            other_events(*)
          )
        `
      )
      .eq("is_active", true);

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      setActiveRouteIsLoading(false);
      return;
    }

    if (data && data.length > 0) {
      setRoutes((prev) => {
        const updated = { ...prev };
        data.forEach((route) => {
          updated[route.id] = route;
        });
        return updated;
      });

      const myRoute = data.find((r) => r.user_id === profileId);
      if (myRoute) {
        setActiveRouteId(myRoute.id);
      } else {
        setActiveRouteId(null);
      }
    } else {
      setActiveRouteId(null);
      setActiveRouteIsLoading(false);
    }

    setActiveRouteIsLoading(false);
  }

  async function endRoute(activeRouteId: string, endedAddress: string, endedLatitude: number, endedLongitude: number) {
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("routes")
      .update({
        is_active: false,
        ended_address: endedAddress,
        ended_location_latitude: endedLatitude,
        ended_location_longitude: endedLongitude,
        ended_at: new Date().toISOString(),
      })
      .eq("id", activeRouteId)
      .select()
      .single();

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      alert("Ocurrió un error y no se pudo finalizar la ruta:\n" + fetchError.message);
      return;
    }

    setActiveRouteId(null);
    setError(null);
    setRoutes((prev) => {
      const updated = { ...prev };
      delete updated[activeRouteId];
      return updated;
    });

    fetchActiveRouteIdStandalone(activeRouteId);
    showToast("Ruta finalizada", "La ruta ha finalizado");

    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/tab/vehicles");
    }
  }

  useEffect(() => {
    if ((!routes[activeRouteId!] && profileId) || (activeRouteId && !routes[activeRouteId!])) {
      fetchActiveRoute();
    }
  }, [profileId]);

  useEffect(() => {
    if (!routes[activeRouteId!] && profileId) {
      setActiveRouteIsLoading(false);
    }
  }, [routes]);

  const activeRoute = activeRouteId ? routes[activeRouteId] : null;

  return {
    activeRoute,
    activeRouteIsLoading,
    error,
    activeRouteId,
    fetchActiveRoute,
    setActiveRouteId,
    fetchActiveRouteIdStandalone,
    endRoute,
  };
}
