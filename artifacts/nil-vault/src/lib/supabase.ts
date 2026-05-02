import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          sport: string | null;
          school: string | null;
          division: string | null;
          role: "athlete" | "admin";
          program_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      programs: {
        Row: {
          id: string;
          name: string;
          school: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["programs"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["programs"]["Insert"]>;
      };
      deals: {
        Row: {
          id: string;
          athlete_id: string;
          brand_name: string;
          amount: number | null;
          status: "inquiry" | "negotiating" | "signed" | "posted" | "paid";
          deliverable_type: string | null;
          deadline: string | null;
          source: "dm" | "email" | "other" | null;
          notes: string | null;
          ftc_compliant: boolean | null;
          caption: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["deals"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["deals"]["Insert"]>;
      };
      deliverables: {
        Row: {
          id: string;
          deal_id: string;
          title: string;
          completed: boolean;
          due_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["deliverables"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["deliverables"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          deal_id: string;
          athlete_id: string;
          amount: number;
          paid_at: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      documents: {
        Row: {
          id: string;
          deal_id: string;
          athlete_id: string;
          file_name: string;
          file_url: string;
          file_type: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["documents"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
      };
    };
  };
};
