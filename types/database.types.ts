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
      event: {
        Row: {
          description: string
          ended_at: string | null
          ending_latitude: number
          ending_longitude: number
          event_type: Database["public"]["Enums"]["event_type"]
          fuel_cost: number | null
          fuel_liters: number | null
          id: string
          is_ongoing: boolean
          mileage: number | null
          started_at: string
          starting_latitude: number
          starting_longitude: number
        }
        Insert: {
          description: string
          ended_at?: string | null
          ending_latitude: number
          ending_longitude: number
          event_type: Database["public"]["Enums"]["event_type"]
          fuel_cost?: number | null
          fuel_liters?: number | null
          id?: string
          is_ongoing?: boolean
          mileage?: number | null
          started_at?: string
          starting_latitude: number
          starting_longitude: number
        }
        Update: {
          description?: string
          ended_at?: string | null
          ending_latitude?: number
          ending_longitude?: number
          event_type?: Database["public"]["Enums"]["event_type"]
          fuel_cost?: number | null
          fuel_liters?: number | null
          id?: string
          is_ongoing?: boolean
          mileage?: number | null
          started_at?: string
          starting_latitude?: number
          starting_longitude?: number
        }
        Relationships: []
      }
      fleet: {
        Row: {
          description: string
          id: string
          title: string
        }
        Insert: {
          description: string
          id?: string
          title: string
        }
        Update: {
          description?: string
          id?: string
          title?: string
        }
        Relationships: []
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
            foreignKeyName: "maintenance_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_document: {
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
            referencedRelation: "vehicle"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
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
      route: {
        Row: {
          description: string
          ended_at: string | null
          ending_address: string | null
          ending_latitude: number | null
          ending_longitude: number | null
          ending_mileage: number | null
          id: string
          is_active: boolean
          purpose: string
          started_at: string
          starting_adress: string
          starting_latitude: number
          starting_longitude: number
          starting_mileage: number
          user_id: string
          vehicle_id: string
        }
        Insert: {
          description: string
          ended_at?: string | null
          ending_address?: string | null
          ending_latitude?: number | null
          ending_longitude?: number | null
          ending_mileage?: number | null
          id?: string
          is_active?: boolean
          purpose: string
          started_at: string
          starting_adress: string
          starting_latitude: number
          starting_longitude: number
          starting_mileage: number
          user_id: string
          vehicle_id: string
        }
        Update: {
          description?: string
          ended_at?: string | null
          ending_address?: string | null
          ending_latitude?: number | null
          ending_longitude?: number | null
          ending_mileage?: number | null
          id?: string
          is_active?: boolean
          purpose?: string
          started_at?: string
          starting_adress?: string
          starting_latitude?: number
          starting_longitude?: number
          starting_mileage?: number
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle"
            referencedColumns: ["id"]
          },
        ]
      }
      route_event: {
        Row: {
          event_id: string
          id: string
          route_id: string
        }
        Insert: {
          event_id: string
          id?: string
          route_id: string
        }
        Update: {
          event_id?: string
          id?: string
          route_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_event_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "route"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_event_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
        ]
      }
      user_fleet: {
        Row: {
          fleet_id: string
          relation_id: number
          user_id: string
        }
        Insert: {
          fleet_id: string
          relation_id?: number
          user_id: string
        }
        Update: {
          fleet_id?: string
          relation_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleets_users_fleet_id_fkey"
            columns: ["fleet_id"]
            isOneToOne: false
            referencedRelation: "fleet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleets_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle: {
        Row: {
          brand: string | null
          economic_number: string | null
          id: string
          plate: string | null
          serial_number: string | null
          sub_brand: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          economic_number?: string | null
          id?: string
          plate?: string | null
          serial_number?: string | null
          sub_brand?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          economic_number?: string | null
          id?: string
          plate?: string | null
          serial_number?: string | null
          sub_brand?: string | null
          year?: number | null
        }
        Relationships: []
      }
      vehicle_document: {
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
            referencedRelation: "vehicle"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_fleet: {
        Row: {
          fleet_id: string
          relation_id: string
          vehicle_id: string
        }
        Insert: {
          fleet_id: string
          relation_id?: string
          vehicle_id: string
        }
        Update: {
          fleet_id?: string
          relation_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleets_vehicles_fleet_id_fkey"
            columns: ["fleet_id"]
            isOneToOne: false
            referencedRelation: "fleet"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleets_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_user_visibility: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          visible: boolean
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          visible: boolean
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_user_visibility_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_user_visibility_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_vehicle_gasoline_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      event_type: "EMERGENCY" | "FAILURE" | "BREAK" | "REFUELING" | "OTHER"
      maintenance_status: "PENDING_REVISION" | "IN_REVISION" | "SOLVED"
      role_change_status:
        | "PENDING_REVISION"
        | "IN_REVISION"
        | "DENIED"
        | "ACCEPTED"
      roles:
        | "OWNER"
        | "DIRECTOR"
        | "FLEET_MANAGER"
        | "ADMIN"
        | "OPERATOR"
        | "NO_ROLE"
        | "BANNED"
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
