export type GasolineLoad = {
  id: string;
  vehicle_id: string;
  user_id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  is_admin_override: boolean;
};
