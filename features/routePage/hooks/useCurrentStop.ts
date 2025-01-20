import { StopsContext } from "@/context/StopsContext";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteEventWithEvents } from "@/types/globalTypes";

export function useCurrentStop() {
  const { currentStop, setCurrentStop } = useContext(StopsContext);
  const [currentStopIsLoading, setCurrentStopIsLoading] = useState(false);

  useEffect(() => {
    fetchCurrentStop();
  }, []);

  async function saveCurrentStop(stop: Partial<RouteEventWithEvents> | null) {
    if (!stop) {
      await AsyncStorage.removeItem("CURRENT_ROUTE_EVENT");
      setCurrentStop(null);
      return;
    }

    await AsyncStorage.setItem("CURRENT_ROUTE_EVENT", JSON.stringify(stop));
    setCurrentStop(stop);
  }

  async function fetchCurrentStop() {
    setCurrentStopIsLoading(true);

    const currentStopFromStorage = await AsyncStorage.getItem("CURRENT_ROUTE_EVENT");
    if (currentStopFromStorage) {
      const parsedStop: Partial<RouteEventWithEvents> = JSON.parse(currentStopFromStorage);
      setCurrentStop(parsedStop);
    } else {
      setCurrentStop(null);
    }

    setCurrentStopIsLoading(false);
  }

  return { currentStop, currentStopIsLoading, setCurrentStop, saveCurrentStop };
}
