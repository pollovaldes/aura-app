export type User = {
  id: string;
  name: string;
  father_last_name: string;
  mother_last_name: string;
  position: string;
  role: string;
  is_fully_registered: boolean;
  thumbnail?: string | null;
  can_manage_admins: boolean;
  can_manage_people: boolean;
  can_manage_vehicles: boolean;
};
