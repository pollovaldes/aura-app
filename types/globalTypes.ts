import { Database } from "./database.types";

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type FleetRow = Database["public"]["Tables"]["fleets"]["Row"];
export type Fleet = FleetRow & {
  users: Profile[];
  vehicles: Vehicle[];
};

export type MaintenanceRow = Database["public"]["Tables"]["maintenance"]["Row"];
export type Maintenance = MaintenanceRow & {
  issued_by: Profile | null;
  resolved_by: Profile | null;
};
