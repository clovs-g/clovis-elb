import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key (for server-side operations)
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

// Database types
export interface Database {
      gallery_images: {
        Row: {
          id: string;
          image_url: string;
          title: string;
          category: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          title: string;
          category: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          title?: string;
          category?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'super-admin';
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          role?: 'admin' | 'super-admin';
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          first_name?: string;
          last_name?: string;
          role?: 'admin' | 'super-admin';
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          short_description: string | null;
          category_id: string | null;
          base_price: number;
          sku: string | null;
          status: 'active' | 'inactive' | 'draft';
          is_featured: boolean;
          display_order: number;
          meta_title: string | null;
          meta_description: string | null;
          ingredients: string[] | null;
          allergens: string[] | null;
          dietary_info: string[] | null;
          preparation_time: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          short_description?: string | null;
          category_id?: string | null;
          base_price: number;
          sku?: string | null;
          status?: 'active' | 'inactive' | 'draft';
          is_featured?: boolean;
          display_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          ingredients?: string[] | null;
          allergens?: string[] | null;
          dietary_info?: string[] | null;
          preparation_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          short_description?: string | null;
          category_id?: string | null;
          base_price?: number;
          sku?: string | null;
          status?: 'active' | 'inactive' | 'draft';
          is_featured?: boolean;
          display_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          ingredients?: string[] | null;
          allergens?: string[] | null;
          dietary_info?: string[] | null;
          preparation_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          delivery_type: 'pickup' | 'delivery';
          subtotal: number;
          tax_amount: number;
          delivery_fee: number;
          total_amount: number;
          currency: string;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address: any | null;
          delivery_date: string | null;
          delivery_time: string | null;
          special_instructions: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          delivery_type?: 'pickup' | 'delivery';
          subtotal: number;
          tax_amount?: number;
          delivery_fee?: number;
          total_amount: number;
          currency?: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address?: any | null;
          delivery_date?: string | null;
          delivery_time?: string | null;
          special_instructions?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          delivery_type?: 'pickup' | 'delivery';
          subtotal?: number;
          tax_amount?: number;
          delivery_fee?: number;
          total_amount?: number;
          currency?: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          delivery_address?: any | null;
          delivery_date?: string | null;
          delivery_time?: string | null;
          special_instructions?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          subject: string;
          body: string;
          status: 'new' | 'read' | 'replied' | 'resolved';
          priority: 'low' | 'normal' | 'high' | 'urgent';
          category_id: string | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          subject: string;
          body: string;
          status?: 'new' | 'read' | 'replied' | 'resolved';
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          subject?: string;
          body?: string;
          status?: 'new' | 'read' | 'replied' | 'resolved';
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
      };
      message_replies: {
        Row: {
          id: string;
          message_id: string;
          admin_user_id: string;
          body_html: string;
          sent_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          admin_user_id: string;
          body_html: string;
          sent_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          admin_user_id?: string;
          body_html?: string;
          sent_at?: string;
        };
      };
      message_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
        };
      };
    };
  };
}