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
      workout_plans: {
        Row: {
          id: string;
          trainer_id: string;
          student_id: string;
          title: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          student_id: string;
          title: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trainer_id?: string;
          student_id?: string;
          title?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      plan_exercises: {
        Row: {
          id: string;
          plan_id: string;
          name: string;
          sets: number | null;
          reps: string | null;
          load: string | null;
          rest: string | null;
          notes: string | null;
          video_url: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          name: string;
          sets?: number | null;
          reps?: string | null;
          load?: string | null;
          rest?: string | null;
          notes?: string | null;
          video_url?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          name?: string;
          sets?: number | null;
          reps?: string | null;
          load?: string | null;
          rest?: string | null;
          notes?: string | null;
          video_url?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workout_logs: {
        Row: {
          id: string;
          student_id: string;
          plan_id: string;
          started_at: string;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          plan_id: string;
          started_at?: string;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          plan_id?: string;
          started_at?: string;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exercise_logs: {
        Row: {
          id: string;
          workout_log_id: string;
          plan_exercise_id: string;
          sets_done: number | null;
          reps_done: string | null;
          load_done: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workout_log_id: string;
          plan_exercise_id: string;
          sets_done?: number | null;
          reps_done?: string | null;
          load_done?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workout_log_id?: string;
          plan_exercise_id?: string;
          sets_done?: number | null;
          reps_done?: string | null;
          load_done?: string | null;
          notes?: string | null;
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
