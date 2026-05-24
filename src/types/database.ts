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
