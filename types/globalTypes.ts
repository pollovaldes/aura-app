import { Database } from "./database.types";

export type Vehicle = Database["public"]["Tables"]["vehicle"]["Row"];
export type User = Database["public"]["Tables"]["profile"]["Row"];

export type VehicleThumbnail = {
  vehicleId: string;
  isLoading: boolean;
  imageURI: string | null;
};

export type VehicleDocument = Database["public"]["Tables"]["vehicle_document"]["Row"];

export type FleetRow = Database["public"]["Tables"]["fleet"]["Row"];
export type Fleet = FleetRow & {
  userIds: string[];
  vehicleIds: string[];
};

export type MaintenanceRow = Database["public"]["Tables"]["maintenance"]["Row"];
export type Maintenance = MaintenanceRow & {
  issued_by: User | null;
  resolved_by: User | null;
};

export type RouteRow = Database["public"]["Views"]["route_with_events"]["Row"];
export type Route = RouteRow & {
  vehicle: Vehicle;
  driver: User;
};

export type Image = {
  id: string;
  blob: Blob;
  isLoading: boolean;
};
