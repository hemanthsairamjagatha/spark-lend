export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      loan_requests: {
        Row: {
          amount: number
          amount_funded: number | null
          borrower_id: string
          created_at: string
          expires_at: string
          id: string
          interest_rate: number
          purpose: string | null
          status: Database["public"]["Enums"]["loan_status"] | null
          term_days: number
          updated_at: string
          visibility_radius_km: number | null
        }
        Insert: {
          amount: number
          amount_funded?: number | null
          borrower_id: string
          created_at?: string
          expires_at: string
          id?: string
          interest_rate: number
          purpose?: string | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_days: number
          updated_at?: string
          visibility_radius_km?: number | null
        }
        Update: {
          amount?: number
          amount_funded?: number | null
          borrower_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          interest_rate?: number
          purpose?: string | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_days?: number
          updated_at?: string
          visibility_radius_km?: number | null
        }
        Relationships: []
      }
      loan_splits: {
        Row: {
          amount_contributed: number
          created_at: string
          id: string
          interest_rate: number
          lender_id: string
          loan_request_id: string
          platform_fee: number | null
          status: Database["public"]["Enums"]["loan_status"] | null
        }
        Insert: {
          amount_contributed: number
          created_at?: string
          id?: string
          interest_rate: number
          lender_id: string
          loan_request_id: string
          platform_fee?: number | null
          status?: Database["public"]["Enums"]["loan_status"] | null
        }
        Update: {
          amount_contributed?: number
          created_at?: string
          id?: string
          interest_rate?: number
          lender_id?: string
          loan_request_id?: string
          platform_fee?: number | null
          status?: Database["public"]["Enums"]["loan_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_splits_loan_request_id_fkey"
            columns: ["loan_request_id"]
            isOneToOne: false
            referencedRelation: "loan_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          amount_repaid: number | null
          borrower_id: string
          created_at: string
          due_date: string
          fine_amount: number | null
          id: string
          interest_rate: number
          loan_request_id: string
          status: Database["public"]["Enums"]["loan_status"] | null
          term_days: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_repaid?: number | null
          borrower_id: string
          created_at?: string
          due_date: string
          fine_amount?: number | null
          id?: string
          interest_rate: number
          loan_request_id: string
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_days: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount_repaid?: number | null
          borrower_id?: string
          created_at?: string
          due_date?: string
          fine_amount?: number | null
          id?: string
          interest_rate?: number
          loan_request_id?: string
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_days?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_loan_request_id_fkey"
            columns: ["loan_request_id"]
            isOneToOne: false
            referencedRelation: "loan_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhar_number: string | null
          avatar_url: string | null
          cibil_score: number | null
          created_at: string
          credit_tier: Database["public"]["Enums"]["credit_tier"] | null
          current_borrowing_limit: number | null
          date_of_birth: string | null
          email: string
          full_name: string | null
          id: string
          is_blacklisted: boolean | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          pan_number: string | null
          phone: string | null
          successful_repayments: number | null
          total_borrowed: number | null
          total_lent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhar_number?: string | null
          avatar_url?: string | null
          cibil_score?: number | null
          created_at?: string
          credit_tier?: Database["public"]["Enums"]["credit_tier"] | null
          current_borrowing_limit?: number | null
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_blacklisted?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          pan_number?: string | null
          phone?: string | null
          successful_repayments?: number | null
          total_borrowed?: number | null
          total_lent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhar_number?: string | null
          avatar_url?: string | null
          cibil_score?: number | null
          created_at?: string
          credit_tier?: Database["public"]["Enums"]["credit_tier"] | null
          current_borrowing_limit?: number | null
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_blacklisted?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          pan_number?: string | null
          phone?: string | null
          successful_repayments?: number | null
          total_borrowed?: number | null
          total_lent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          from_user_id: string
          id: string
          loan_id: string | null
          rating: number | null
          to_user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          from_user_id: string
          id?: string
          loan_id?: string | null
          rating?: number | null
          to_user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          from_user_id?: string
          id?: string
          loan_id?: string | null
          rating?: number | null
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      repayments: {
        Row: {
          amount: number
          created_at: string
          fine_portion: number | null
          id: string
          interest_portion: number
          loan_id: string
          payment_method: string | null
          principal_portion: number
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          fine_portion?: number | null
          id?: string
          interest_portion: number
          loan_id: string
          payment_method?: string | null
          principal_portion: number
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          fine_portion?: number | null
          id?: string
          interest_portion?: number
          loan_id?: string
          payment_method?: string | null
          principal_portion?: number
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repayments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance_available: number | null
          balance_escrow: number | null
          currency: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_available?: number | null
          balance_escrow?: number | null
          currency?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_available?: number | null
          balance_escrow?: number | null
          currency?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "borrower" | "lender" | "admin"
      credit_tier: "starter" | "bronze" | "silver" | "gold" | "platinum"
      kyc_status: "pending" | "submitted" | "verified" | "rejected"
      loan_status:
        | "pending"
        | "partial"
        | "fulfilled"
        | "active"
        | "completed"
        | "defaulted"
        | "cancelled"
      transaction_type:
        | "escrow_hold"
        | "escrow_release"
        | "disbursement"
        | "repayment"
        | "fee"
        | "fine"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["borrower", "lender", "admin"],
      credit_tier: ["starter", "bronze", "silver", "gold", "platinum"],
      kyc_status: ["pending", "submitted", "verified", "rejected"],
      loan_status: [
        "pending",
        "partial",
        "fulfilled",
        "active",
        "completed",
        "defaulted",
        "cancelled",
      ],
      transaction_type: [
        "escrow_hold",
        "escrow_release",
        "disbursement",
        "repayment",
        "fee",
        "fine",
      ],
    },
  },
} as const
