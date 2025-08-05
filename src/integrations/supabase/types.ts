export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          applied_date: string
          availability_date: string | null
          certifications: string[] | null
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
          job_id: string | null
          key_achievements: string[] | null
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          portfolio_url: string | null
          position: string
          resume_parsed_data: Json | null
          resume_summary: string | null
          resume_url: string | null
          role_category: string
          skills: string[] | null
          status: string
          updated_at: string
          work_experience: Json[] | null
        }
        Insert: {
          applied_date?: string
          availability_date?: string | null
          certifications?: string[] | null
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
          job_id?: string | null
          key_achievements?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          name: string
          phone?: string | null
          portfolio_url?: string | null
          position: string
          resume_parsed_data?: Json | null
          resume_summary?: string | null
          resume_url?: string | null
          role_category: string
          skills?: string[] | null
          status?: string
          updated_at?: string
          work_experience?: Json[] | null
        }
        Update: {
          applied_date?: string
          availability_date?: string | null
          certifications?: string[] | null
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
          job_id?: string | null
          key_achievements?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          portfolio_url?: string | null
          position?: string
          resume_parsed_data?: Json | null
          resume_summary?: string | null
          resume_url?: string | null
          role_category?: string
          skills?: string[] | null
          status?: string
          updated_at?: string
          work_experience?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          note_text: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          note_text: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_size: string | null
          contact_person: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          industry: string | null
          location: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company_size?: string | null
          contact_person?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_size?: string | null
          contact_person?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          created_at: string
          credits_amount: number
          description: string | null
          id: string
          metadata: Json | null
          stripe_payment_intent_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_amount: number
          description?: string | null
          id?: string
          metadata?: Json | null
          stripe_payment_intent_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_amount?: number
          description?: string | null
          id?: string
          metadata?: Json | null
          stripe_payment_intent_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_notes: {
        Row: {
          created_at: string
          id: string
          interview_id: string
          note_text: string
          note_type: string | null
          timestamp_in_interview: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          interview_id: string
          note_text: string
          note_type?: string | null
          timestamp_in_interview?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          interview_id?: string
          note_text?: string
          note_type?: string | null
          timestamp_in_interview?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notes_interview"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_questions: {
        Row: {
          candidate_answer: string | null
          created_at: string
          difficulty_level: string | null
          expected_answer: string | null
          id: string
          interview_id: string
          interviewer_notes: string | null
          order_index: number | null
          question_text: string
          question_type: string | null
          rating: number | null
        }
        Insert: {
          candidate_answer?: string | null
          created_at?: string
          difficulty_level?: string | null
          expected_answer?: string | null
          id?: string
          interview_id: string
          interviewer_notes?: string | null
          order_index?: number | null
          question_text: string
          question_type?: string | null
          rating?: number | null
        }
        Update: {
          candidate_answer?: string | null
          created_at?: string
          difficulty_level?: string | null
          expected_answer?: string | null
          id?: string
          interview_id?: string
          interviewer_notes?: string | null
          order_index?: number | null
          question_text?: string
          question_type?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_questions_interview"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_scorecards: {
        Row: {
          areas_for_improvement: string[] | null
          communication_score: number | null
          created_at: string
          cultural_fit_score: number | null
          final_notes: string | null
          id: string
          interview_id: string
          leadership_score: number | null
          overall_recommendation: string | null
          problem_solving_score: number | null
          strengths: string[] | null
          technical_skills_score: number | null
          updated_at: string
        }
        Insert: {
          areas_for_improvement?: string[] | null
          communication_score?: number | null
          created_at?: string
          cultural_fit_score?: number | null
          final_notes?: string | null
          id?: string
          interview_id: string
          leadership_score?: number | null
          overall_recommendation?: string | null
          problem_solving_score?: number | null
          strengths?: string[] | null
          technical_skills_score?: number | null
          updated_at?: string
        }
        Update: {
          areas_for_improvement?: string[] | null
          communication_score?: number | null
          created_at?: string
          cultural_fit_score?: number | null
          final_notes?: string | null
          id?: string
          interview_id?: string
          leadership_score?: number | null
          overall_recommendation?: string | null
          problem_solving_score?: number | null
          strengths?: string[] | null
          technical_skills_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_scorecards_interview"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          candidate_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          interviewer_email: string | null
          interviewer_name: string | null
          meeting_link: string | null
          meeting_type: string | null
          notes: string | null
          scheduled_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          interviewer_email?: string | null
          interviewer_name?: string | null
          meeting_link?: string | null
          meeting_type?: string | null
          notes?: string | null
          scheduled_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          interviewer_email?: string | null
          interviewer_name?: string | null
          meeting_link?: string | null
          meeting_type?: string | null
          notes?: string | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_interviews_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      job_descriptions: {
        Row: {
          client_id: string | null
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
          client_id?: string | null
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
          client_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "job_descriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
          interview_duration_minutes: number | null
          interview_feedback: string | null
          interview_recording_url: string | null
          overall_rating: number | null
          recommended_next_step: string | null
          strengths: string[] | null
          system_design_score: number | null
          technical_notes: string | null
          transcription_text: string | null
          transcription_url: string | null
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
          interview_duration_minutes?: number | null
          interview_feedback?: string | null
          interview_recording_url?: string | null
          overall_rating?: number | null
          recommended_next_step?: string | null
          strengths?: string[] | null
          system_design_score?: number | null
          technical_notes?: string | null
          transcription_text?: string | null
          transcription_url?: string | null
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
          interview_duration_minutes?: number | null
          interview_feedback?: string | null
          interview_recording_url?: string | null
          overall_rating?: number | null
          recommended_next_step?: string | null
          strengths?: string[] | null
          system_design_score?: number | null
          technical_notes?: string | null
          transcription_text?: string | null
          transcription_url?: string | null
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
      user_credits: {
        Row: {
          created_at: string
          credits_balance: number
          id: string
          total_credits_purchased: number
          total_credits_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_balance?: number
          id?: string
          total_credits_purchased?: number
          total_credits_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_balance?: number
          id?: string
          total_credits_purchased?: number
          total_credits_used?: number
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
