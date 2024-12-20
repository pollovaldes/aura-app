export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      fleets: {
        Row: {
          description: string | null
          id: string
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      fleets_users_vehicles: {
        Row: {
          fleet_id: string
          id: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          fleet_id: string
          id?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          fleet_id?: string
          id?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleets_users_vehicles_fleet_id_fkey"
            columns: ["fleet_id"]
            isOneToOne: false
            referencedRelation: "fleets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleets_users_vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleets_users_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      gasoline_loads: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          id: string
          is_admin_override: boolean | null
          liters: number
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          requested_at: string | null
          status: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          is_admin_override?: boolean | null
          liters?: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          is_admin_override?: boolean | null
          liters?: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gasoline_loads_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gasoline_loads_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gasoline_loads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gasoline_loads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance: {
        Row: {
          description: string | null
          id: string
          issued_by: string
          issued_datetime: string
          resolved_by: string | null
          resolved_datetime: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          title: string
          vehicle_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          issued_by: string
          issued_datetime: string
          resolved_by?: string | null
          resolved_datetime?: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          title: string
          vehicle_id: string
        }
        Update: {
          description?: string | null
          id?: string
          issued_by?: string
          issued_datetime?: string
          resolved_by?: string | null
          resolved_datetime?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          title?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birthday: string | null
          father_last_name: string | null
          id: string
          is_fully_registered: boolean
          is_super_admin: boolean
          mother_last_name: string | null
          name: string | null
          position: string | null
          role: Database["public"]["Enums"]["roles"]
        }
        Insert: {
          birthday?: string | null
          father_last_name?: string | null
          id: string
          is_fully_registered?: boolean
          is_super_admin?: boolean
          mother_last_name?: string | null
          name?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["roles"]
        }
        Update: {
          birthday?: string | null
          father_last_name?: string | null
          id?: string
          is_fully_registered?: boolean
          is_super_admin?: boolean
          mother_last_name?: string | null
          name?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["roles"]
        }
        Relationships: []
      }
      role_change_request: {
        Row: {
          new_role: Database["public"]["Enums"]["roles"]
          previous_role: Database["public"]["Enums"]["roles"]
          request_date: string
          request_status: Database["public"]["Enums"]["role_change_status"]
          role_change_request_id: string
          user_id: string
        }
        Insert: {
          new_role: Database["public"]["Enums"]["roles"]
          previous_role: Database["public"]["Enums"]["roles"]
          request_date: string
          request_status: Database["public"]["Enums"]["role_change_status"]
          role_change_request_id?: string
          user_id: string
        }
        Update: {
          new_role?: Database["public"]["Enums"]["roles"]
          previous_role?: Database["public"]["Enums"]["roles"]
          request_date?: string
          request_status?: Database["public"]["Enums"]["role_change_status"]
          role_change_request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_change_request_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_fleet_add_request: {
        Row: {
          created_at: string
          fleet_to_be_added: string
          reason: string
          request_id: string
          status: Database["public"]["Enums"]["user_fleet_add_request_status"]
          who_requests: string
          who_will_be_added: string
        }
        Insert: {
          created_at: string
          fleet_to_be_added: string
          reason: string
          request_id?: string
          status?: Database["public"]["Enums"]["user_fleet_add_request_status"]
          who_requests: string
          who_will_be_added: string
        }
        Update: {
          created_at?: string
          fleet_to_be_added?: string
          reason?: string
          request_id?: string
          status?: Database["public"]["Enums"]["user_fleet_add_request_status"]
          who_requests?: string
          who_will_be_added?: string
        }
        Relationships: []
      }
      vehicle_documentation_sheet: {
        Row: {
          description: string | null
          document_id: string
          title: string
          vehicle_id: string
        }
        Insert: {
          description?: string | null
          document_id?: string
          title: string
          vehicle_id: string
        }
        Update: {
          description?: string | null
          document_id?: string
          title?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documentation_sheet_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_gasoline_status_two: {
        Row: {
          gasoline_threshold: number | null
          last_reset_date: string | null
          remaining_gasoline: number | null
          spent_gasoline: number | null
          spent_liters: number | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          gasoline_threshold?: number | null
          last_reset_date?: string | null
          remaining_gasoline?: number | null
          spent_gasoline?: number | null
          spent_liters?: number | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          gasoline_threshold?: number | null
          last_reset_date?: string | null
          remaining_gasoline?: number | null
          spent_gasoline?: number | null
          spent_liters?: number | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_gasoline_status_two_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_maintenance_documentation: {
        Row: {
          created_at: string
          description: string | null
          document_id: string
          maintenance_id: string
          title: string | null
          vehicle_id: string
        }
        Insert: {
          created_at: string
          description?: string | null
          document_id?: string
          maintenance_id: string
          title?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_id?: string
          maintenance_id?: string
          title?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_maintenance_documentation_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_thresholds: {
        Row: {
          gasoline_threshold: number
          liters_threshold: number
          vehicle_id: string
        }
        Insert: {
          gasoline_threshold?: number
          liters_threshold?: number
          vehicle_id: string
        }
        Update: {
          gasoline_threshold?: number
          liters_threshold?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_thresholds_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_user: {
        Row: {
          relation_id: string
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          relation_id?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          relation_id?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_user_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string | null
          economic_number: string | null
          gasoline_threshold: number
          id: string
          plate: string | null
          serial_number: string | null
          sub_brand: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          economic_number?: string | null
          gasoline_threshold?: number
          id?: string
          plate?: string | null
          serial_number?: string | null
          sub_brand?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          economic_number?: string | null
          gasoline_threshold?: number
          id?: string
          plate?: string | null
          serial_number?: string | null
          sub_brand?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      gasoline_spent_per_day: {
        Row: {
          day_date: string | null
          total_spent: number | null
          vehicle_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gasoline_loads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      gasoline_spent_per_month: {
        Row: {
          month_start_date: string | null
          total_spent: number | null
          vehicle_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gasoline_loads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      gasoline_spent_per_week: {
        Row: {
          total_spent: number | null
          vehicle_id: string | null
          week_start_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gasoline_loads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      gasoline_spent_per_year: {
        Row: {
          total_spent: number | null
          vehicle_id: string | null
          year_start_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gasoline_loads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_spent_gasoline: {
        Row: {
          spent_gasoline: number | null
          vehicle_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gasoline_loads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      update_vehicle_gasoline_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      maintenance_status: "PENDING_REVISION" | "IN_REVISION" | "SOLVED"
      notification_category:
        | "MAINTENANCE"
        | "GASOLINE"
        | "ROLE"
        | "FLEETS"
        | "ROUTES"
        | "OTHER"
      role_change_status:
        | "PENDING_REVISION"
        | "IN_REVISION"
        | "DENIED"
        | "ACCEPTED"
      roles: "OWNER" | "ADMIN" | "DRIVER" | "NO_ROLE" | "BANNED"
      route_stop_reason:
        | "EMERGENCY"
        | "FAILURE"
        | "BREAK"
        | "REFUELING"
        | "OTHER"
      user_fleet_add_request_status:
        | "PENDING_REVISION"
        | "IN_REVISION"
        | "DENIED"
        | "ACCEPTED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
