
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
      assignments: {
        Row: {
          created_at: string
          id: string
          status: string
          title: string
          urls: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          title: string
          urls: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          title?: string
          urls?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          created_at: string
          id: string
          plan_id: string | null
          payment_uid: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id?: string | null
          payment_uid: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string | null
          payment_uid?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          daily_earning: number
          id: string
          investment: number
          name: string
          period_days: number
          daily_assignments: number
        }
        Insert: {
          created_at?: string
          daily_earning: number
          id?: string
          investment: number
          name: string
          period_days: number
          daily_assignments: number
        }
        Update: {
          created_at?: string
          daily_earning?: number
          id?: string
          investment?: number
          name?: string
          period_days?: number
          daily_assignments?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          current_balance: number
          current_plan: string | null
          email: string | null
          id: string
          name: string | null
          plan_end: string | null
          plan_start: string | null
          referral_bonus: number
          referral_code: string
          referral_count: number
          today_earning: number
          total_earning: number
          referred_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          current_balance?: number
          current_plan?: string | null
          email?: string | null
          id: string
          name?: string | null
          plan_end?: string | null
          plan_start?: string | null
          referral_bonus?: number
          referral_code: string
          referral_count?: number
          today_earning?: number
          total_earning?: number
          referred_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          current_balance?: number
          current_plan?: string | null
          email?: string | null
          id?: string
          name?: string | null
          plan_end?: string | null
          plan_start?: string | null
          referral_bonus?: number
          referral_code?: string
          referral_count?: number
          today_earning?: number
          total_earning?: number
          referred_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
       tasks: {
        Row: {
          id: string
          title: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          created_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          id: string
          title: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          created_at?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          account_info: Json
          amount: number
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          account_info: Json
          amount: number
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          account_info?: Json
          amount?: number
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
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
