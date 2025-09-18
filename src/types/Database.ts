// This file defines the Database types for Supabase tables used in the project.
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          subject: string;
          body: string;
          status: 'new' | 'read' | 'replied' | 'resolved';
          priority?: string | null;
          category_id?: string | null;
          created_at: string;
          updated_at: string;
          resolved_at?: string | null;
        };
        Insert: {
          customer_name: string;
          customer_email: string;
          subject: string;
          body: string;
          status?: 'new' | 'read' | 'replied' | 'resolved';
          priority?: string | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: Partial<{
          customer_name: string;
          customer_email: string;
          subject: string;
          body: string;
          status: 'new' | 'read' | 'replied' | 'resolved';
          priority?: string | null;
          category_id?: string | null;
          created_at: string;
          updated_at: string;
          resolved_at?: string | null;
        }>;
      };
    };
  };
}
