export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          company: string | null;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          is_default: boolean;
          address_type: "shipping" | "billing";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          company?: string | null;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          state: string;
          zip_code: string;
          country?: string;
          is_default?: boolean;
          address_type?: "shipping" | "billing";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          company?: string | null;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          state?: string;
          zip_code?: string;
          country?: string;
          is_default?: boolean;
          address_type?: "shipping" | "billing";
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
          short_description: string;
          price: number;
          original_price: number | null;
          sku: string;
          product_type: "lyophilized" | "capsules" | "nasal-spray" | "serum";
          category_id: string | null;
          category_name: string;
          dosage: string;
          form: string;
          purity: string;
          molecular_weight: string | null;
          sequence: string | null;
          storage_instructions: string;
          batch_number: string | null;
          coa_url: string | null;
          hplc_report_url: string | null;
          in_stock: boolean;
          stock_quantity: number;
          featured: boolean;
          best_seller: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          short_description: string;
          price: number;
          original_price?: number | null;
          sku: string;
          product_type: "lyophilized" | "capsules" | "nasal-spray" | "serum";
          category_id?: string | null;
          category_name: string;
          dosage: string;
          form: string;
          purity?: string;
          molecular_weight?: string | null;
          sequence?: string | null;
          storage_instructions: string;
          batch_number?: string | null;
          coa_url?: string | null;
          hplc_report_url?: string | null;
          in_stock?: boolean;
          stock_quantity?: number;
          featured?: boolean;
          best_seller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          short_description?: string;
          price?: number;
          original_price?: number | null;
          sku?: string;
          product_type?: "lyophilized" | "capsules" | "nasal-spray" | "serum";
          category_id?: string | null;
          category_name?: string;
          dosage?: string;
          form?: string;
          purity?: string;
          molecular_weight?: string | null;
          sequence?: string | null;
          storage_instructions?: string;
          batch_number?: string | null;
          coa_url?: string | null;
          hplc_report_url?: string | null;
          in_stock?: boolean;
          stock_quantity?: number;
          featured?: boolean;
          best_seller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      product_research_applications: {
        Row: {
          id: string;
          product_id: string;
          application: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          application: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          application?: string;
          created_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          wishlist_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          wishlist_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          wishlist_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          subtotal: number;
          shipping: number;
          tax: number;
          total: number;
          status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          shipping_address_id: string | null;
          billing_address_id: string | null;
          payment_method: string | null;
          payment_intent_id: string | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id: string;
          subtotal: number;
          shipping?: number;
          tax?: number;
          total: number;
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          shipping_address_id?: string | null;
          billing_address_id?: string | null;
          payment_method?: string | null;
          payment_intent_id?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          subtotal?: number;
          shipping?: number;
          tax?: number;
          total?: number;
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          shipping_address_id?: string | null;
          billing_address_id?: string | null;
          payment_method?: string | null;
          payment_intent_id?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_purchase: number;
          product_name: string;
          product_sku: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_purchase: number;
          product_name: string;
          product_sku: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price_at_purchase?: number;
          product_name?: string;
          product_sku?: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          content: string | null;
          verified_purchase: boolean;
          approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          title?: string | null;
          content?: string | null;
          verified_purchase?: boolean;
          approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          title?: string | null;
          content?: string | null;
          verified_purchase?: boolean;
          approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_type: "lyophilized" | "capsules" | "nasal-spray" | "serum";
      order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
      address_type: "shipping" | "billing";
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
