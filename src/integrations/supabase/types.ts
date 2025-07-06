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
      candidates: {
        Row: {
          applied_date: string
          availability_date: string | null
          cover_letter_url: string | null
          created_at: string
          current_company: string | null
          current_salary: number | null
          education: string | null
          email: string
          expected_salary: number | null
          experience_years: number | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          portfolio_url: string | null
          position: string
          resume_url: string | null
          role_category: string
          skills: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          applied_date?: string
          availability_date?: string | null
          cover_letter_url?: string | null
          created_at?: string
          current_company?: string | null
          current_salary?: number | null
          education?: string | null
          email: string
          expected_salary?: number | null
          experience_years?: number | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name: string
          phone?: string | null
          portfolio_url?: string | null
          position: string
          resume_url?: string | null
          role_category: string
          skills?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          applied_date?: string
          availability_date?: string | null
          cover_letter_url?: string | null
          created_at?: string
          current_company?: string | null
          current_salary?: number | null
          education?: string | null
          email?: string
          expected_salary?: number | null
          experience_years?: number | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          portfolio_url?: string | null
          position?: string
          resume_url?: string | null
          role_category?: string
          skills?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_descriptions: {
        Row: {
          created_at: string
          department: string | null
          description: string
          experience_level: string | null
          id: string
          is_active: boolean | null
          preferred_skills: string[] | null
          remote_friendly: boolean | null
          required_skills: string[] | null
          salary_range_max: number | null
          salary_range_min: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description: string
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          preferred_skills?: string[] | null
          remote_friendly?: boolean | null
          required_skills?: string[] | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          preferred_skills?: string[] | null
          remote_friendly?: boolean | null
          required_skills?: string[] | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_matches: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          job_description_id: string
          match_percentage: number | null
          matched_skills: string[] | null
          missing_skills: string[] | null
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          job_description_id: string
          match_percentage?: number | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          job_description_id?: string
          match_percentage?: number | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_matches_job_description_id_fkey"
            columns: ["job_description_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      technical_assessments: {
        Row: {
          assessed_by: string | null
          assessment_date: string | null
          candidate_id: string
          coding_test_score: number | null
          communication_score: number | null
          created_at: string
          culture_fit_score: number | null
          id: string
          interview_feedback: string | null
          overall_rating: number | null
          recommended_next_step: string | null
          strengths: string[] | null
          system_design_score: number | null
          technical_notes: string | null
          updated_at: string
          weaknesses: string[] | null
        }
        Insert: {
          assessed_by?: string | null
          assessment_date?: string | null
          candidate_id: string
          coding_test_score?: number | null
          communication_score?: number | null
          created_at?: string
          culture_fit_score?: number | null
          id?: string
          interview_feedback?: string | null
          overall_rating?: number | null
          recommended_next_step?: string | null
          strengths?: string[] | null
          system_design_score?: number | null
          technical_notes?: string | null
          updated_at?: string
          weaknesses?: string[] | null
        }
        Update: {
          assessed_by?: string | null
          assessment_date?: string | null
          candidate_id?: string
          coding_test_score?: number | null
          communication_score?: number | null
          created_at?: string
          culture_fit_score?: number | null
          id?: string
          interview_feedback?: string | null
          overall_rating?: number | null
          recommended_next_step?: string | null
          strengths?: string[] | null
          system_design_score?: number | null
          technical_notes?: string | null
          updated_at?: string
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "technical_assessments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
