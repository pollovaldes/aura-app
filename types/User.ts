export type User = {
  id: string;
  name: string;
  father_last_name: string;
  mother_last_name: string;
  position: string;
  role: string;
  birthday: string;
  is_fully_registered: boolean;
  thumbnail?: string | null;
};
