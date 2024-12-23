import { Database } from "./database.types";

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type User = Database["public"]["Tables"]["profiles"]["Row"];

export type FleetRow = Database["public"]["Tables"]["fleets"]["Row"];
export type Fleet = FleetRow & {
  users: User[];
  vehicles: Vehicle[];
};

export type MaintenanceRow = Database["public"]["Tables"]["maintenance"]["Row"];
export type Maintenance = MaintenanceRow & {
  issued_by: User | null;
  resolved_by: User | null;
};

export type RouteEvent = Database["public"]["Tables"]["route_events"]["Row"];
export type BreakEvent = Database["public"]["Tables"]["break_events"]["Row"];
export type EmergencyEvent = Database["public"]["Tables"]["emergency_events"]["Row"];
export type OtherEvent = Database["public"]["Tables"]["other_events"]["Row"];
export type RefuelingEvent = Database["public"]["Tables"]["refueling_events"]["Row"];

export type RouteRow = Database["public"]["Tables"]["routes"]["Row"];
export type Route = RouteRow & {
  routeEvents: RouteEvent[];
  breakEvents: BreakEvent[];
  emergencyEvents: EmergencyEvent[];
  otherEvents: OtherEvent[];
  refuelingEvents: RefuelingEvent[];
};

export type Image = {
  id: string;
  blob: Blob;
  isLoading: boolean;
};
