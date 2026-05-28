export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InviteStatus = "pending" | "accepted" | "cancelled" | "expired";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: "trainer" | "student";
          is_active: boolean;
          trainer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role: "trainer" | "student";
          is_active?: boolean;
          trainer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: "trainer" | "student";
          is_active?: boolean;
          trainer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_invites: {
        Row: {
          id: string;
          trainer_id: string;
          name: string;
          email: string;
          token: string;
          status: InviteStatus;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          name: string;
          email: string;
          token: string;
          status?: InviteStatus;
          expires_at: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trainer_id?: string;
          name?: string;
          email?: string;
          token?: string;
          status?: InviteStatus;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          trainer_id: string;
          name: string;
          muscle_group: string | null;
          video_url: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          name: string;
          muscle_group?: string | null;
          video_url?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trainer_id?: string;
          name?: string;
          muscle_group?: string | null;
          video_url?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workout_plans: {
        Row: {
          id: string;
          trainer_id: string;
          student_id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          student_id: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trainer_id?: string;
          student_id?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workout_days: {
        Row: {
          id: string;
          workout_plan_id: string;
          name: string;
          focus: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workout_plan_id: string;
          name: string;
          focus?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workout_plan_id?: string;
          name?: string;
          focus?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_day_id: string;
          exercise_id: string;
          sets: number;
          reps: string;
          suggested_load: string | null;
          rest: string | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workout_day_id: string;
          exercise_id: string;
          sets?: number;
          reps: string;
          suggested_load?: string | null;
          rest?: string | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workout_day_id?: string;
          exercise_id?: string;
          sets?: number;
          reps?: string;
          suggested_load?: string | null;
          rest?: string | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_invite_by_token: {
        Args: { invite_token: string };
        Returns: {
          id: string;
          trainer_id: string;
          trainer_name: string;
          name: string;
          email: string;
          status: InviteStatus;
          expires_at: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
