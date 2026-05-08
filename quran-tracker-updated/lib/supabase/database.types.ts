export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: 'student' | 'mentor';
          mentor_id: string | null;
          streak: number;
          last_active_date: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role: 'student' | 'mentor';
          mentor_id?: string | null;
          streak?: number;
          last_active_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: 'student' | 'mentor';
          mentor_id?: string | null;
          streak?: number;
          last_active_date?: string | null;
        };
      };
      assignments: {
        Row: {
          id: string;
          student_id: string;
          mentor_id: string;
          surah: string;
          ayah_start: number;
          ayah_end: number;
          type: 'learn' | 'revise';
          status: 'pending' | 'completed';
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          mentor_id: string;
          surah: string;
          ayah_start: number;
          ayah_end: number;
          type: 'learn' | 'revise';
          status?: 'pending' | 'completed';
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          mentor_id?: string;
          surah?: string;
          ayah_start?: number;
          ayah_end?: number;
          type?: 'learn' | 'revise';
          status?: 'pending' | 'completed';
          date?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Assignment = Database['public']['Tables']['assignments']['Row'];
export type AssignmentInsert = Database['public']['Tables']['assignments']['Insert'];
