export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      booking_items: {
        Row: {
          availability_id: string | null
          booking_id: string
          created_at: string
          experience_id: string
          id: string
          provider_id: string
          provider_message: string | null
          quantity: number
          responded_at: string | null
          service_date: string
          service_time: string | null
          status: Database["public"]["Enums"]["booking_item_status"]
          subtotal: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          availability_id?: string | null
          booking_id: string
          created_at?: string
          experience_id: string
          id?: string
          provider_id: string
          provider_message?: string | null
          quantity?: number
          responded_at?: string | null
          service_date: string
          service_time?: string | null
          status?: Database["public"]["Enums"]["booking_item_status"]
          subtotal: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          availability_id?: string | null
          booking_id?: string
          created_at?: string
          experience_id?: string
          id?: string
          provider_id?: string
          provider_message?: string | null
          quantity?: number
          responded_at?: string | null
          service_date?: string
          service_time?: string | null
          status?: Database["public"]["Enums"]["booking_item_status"]
          subtotal?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "experience_availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_number: string
          created_at: string
          currency: string
          id: string
          notes: string | null
          platform_fee: number
          status: Database["public"]["Enums"]["booking_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_number: string
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          platform_fee?: number
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_number?: string
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          platform_fee?: number
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cancellations: {
        Row: {
          booking_id: string
          booking_item_id: string | null
          cancellation_policy: Database["public"]["Enums"]["cancellation_policy"]
          cancelled_by: string
          created_at: string
          hours_before_service: number | null
          id: string
          original_amount: number
          reason: string | null
          refund_amount: number
          refund_percentage: number
          stripe_refund_id: string | null
        }
        Insert: {
          booking_id: string
          booking_item_id?: string | null
          cancellation_policy: Database["public"]["Enums"]["cancellation_policy"]
          cancelled_by: string
          created_at?: string
          hours_before_service?: number | null
          id?: string
          original_amount: number
          reason?: string | null
          refund_amount: number
          refund_percentage: number
          stripe_refund_id?: string | null
        }
        Update: {
          booking_id?: string
          booking_item_id?: string | null
          cancellation_policy?: Database["public"]["Enums"]["cancellation_policy"]
          cancelled_by?: string
          created_at?: string
          hours_before_service?: number | null
          id?: string
          original_amount?: number
          reason?: string | null
          refund_amount?: number
          refund_percentage?: number
          stripe_refund_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cancellations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cancellations_booking_item_id_fkey"
            columns: ["booking_item_id"]
            isOneToOne: false
            referencedRelation: "booking_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cancellations_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      collection_experiences: {
        Row: {
          collection_id: string
          created_at: string
          experience_id: string
          id: string
          sort_order: number
        }
        Insert: {
          collection_id: string
          created_at?: string
          experience_id: string
          id?: string
          sort_order?: number
        }
        Update: {
          collection_id?: string
          created_at?: string
          experience_id?: string
          id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_experiences_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "destination_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_experiences_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_categories: {
        Row: {
          category_id: string
          created_at: string
          destination_id: string
          id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          destination_id: string
          id?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          destination_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "destination_categories_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_collections: {
        Row: {
          created_at: string
          description: string | null
          destination_id: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          destination_id: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          destination_id?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_collections_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_info_categories: {
        Row: {
          color: string | null
          created_at: string
          destination_id: string
          icon: string | null
          id: string
          slug: string
          sort_order: number
          subtitle: string | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          destination_id: string
          icon?: string | null
          id?: string
          slug: string
          sort_order?: number
          subtitle?: string | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          destination_id?: string
          icon?: string | null
          id?: string
          slug?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_info_categories_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_info_items: {
        Row: {
          actions: Json
          author: string | null
          category_id: string
          created_at: string
          date: string | null
          description: Json
          id: string
          images_count: number | null
          sort_order: number
          title: string
        }
        Insert: {
          actions?: Json
          author?: string | null
          category_id: string
          created_at?: string
          date?: string | null
          description?: Json
          id?: string
          images_count?: number | null
          sort_order?: number
          title: string
        }
        Update: {
          actions?: Json
          author?: string | null
          category_id?: string
          created_at?: string
          date?: string | null
          description?: Json
          id?: string
          images_count?: number | null
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_info_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "destination_info_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_recommendations: {
        Row: {
          created_at: string
          destination_id: string
          experience_id: string
          id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          destination_id: string
          experience_id: string
          id?: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          destination_id?: string
          experience_id?: string
          id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "destination_recommendations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "destination_recommendations_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          city: string | null
          country: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          slug: string
          state: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          slug: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          slug?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      experience_availability: {
        Row: {
          booked_spots: number
          created_at: string
          date: string
          end_time: string | null
          experience_id: string
          id: string
          is_blocked: boolean
          price_override: number | null
          start_time: string
          total_spots: number
          updated_at: string
        }
        Insert: {
          booked_spots?: number
          created_at?: string
          date: string
          end_time?: string | null
          experience_id: string
          id?: string
          is_blocked?: boolean
          price_override?: number | null
          start_time: string
          total_spots: number
          updated_at?: string
        }
        Update: {
          booked_spots?: number
          created_at?: string
          date?: string
          end_time?: string | null
          experience_id?: string
          id?: string
          is_blocked?: boolean
          price_override?: number | null
          start_time?: string
          total_spots?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_availability_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_images: {
        Row: {
          alt_text: string | null
          created_at: string
          experience_id: string
          id: string
          is_cover: boolean
          sort_order: number
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          experience_id: string
          id?: string
          is_cover?: boolean
          sort_order?: number
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          experience_id?: string
          id?: string
          is_cover?: boolean
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_images_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          average_rating: number
          cancellation_policy: Database["public"]["Enums"]["cancellation_policy"]
          category_id: string
          created_at: string
          description: string
          destination_id: string
          duration_minutes: number | null
          excludes: string[] | null
          highlights: string[] | null
          id: string
          includes: string[] | null
          is_featured: boolean
          max_capacity: number
          meeting_point: string | null
          meeting_point_lat: number | null
          meeting_point_lng: number | null
          min_capacity: number
          price_amount: number
          price_currency: string
          pricing_type: Database["public"]["Enums"]["pricing_type"]
          provider_id: string
          published_at: string | null
          rejection_reason: string | null
          requirements: string[] | null
          review_count: number
          search_vector: unknown
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["experience_status"]
          subcategory_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          average_rating?: number
          cancellation_policy?: Database["public"]["Enums"]["cancellation_policy"]
          category_id: string
          created_at?: string
          description: string
          destination_id: string
          duration_minutes?: number | null
          excludes?: string[] | null
          highlights?: string[] | null
          id?: string
          includes?: string[] | null
          is_featured?: boolean
          max_capacity?: number
          meeting_point?: string | null
          meeting_point_lat?: number | null
          meeting_point_lng?: number | null
          min_capacity?: number
          price_amount: number
          price_currency?: string
          pricing_type?: Database["public"]["Enums"]["pricing_type"]
          provider_id: string
          published_at?: string | null
          rejection_reason?: string | null
          requirements?: string[] | null
          review_count?: number
          search_vector?: unknown
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["experience_status"]
          subcategory_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          average_rating?: number
          cancellation_policy?: Database["public"]["Enums"]["cancellation_policy"]
          category_id?: string
          created_at?: string
          description?: string
          destination_id?: string
          duration_minutes?: number | null
          excludes?: string[] | null
          highlights?: string[] | null
          id?: string
          includes?: string[] | null
          is_featured?: boolean
          max_capacity?: number
          meeting_point?: string | null
          meeting_point_lat?: number | null
          meeting_point_lng?: number | null
          min_capacity?: number
          price_amount?: number
          price_currency?: string
          pricing_type?: Database["public"]["Enums"]["pricing_type"]
          provider_id?: string
          published_at?: string | null
          rejection_reason?: string | null
          requirements?: string[] | null
          review_count?: number
          search_vector?: unknown
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["experience_status"]
          subcategory_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiences_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiences_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiences_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          metadata?: Json | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          booking_item_id: string | null
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_refund_id: string | null
          stripe_transfer_id: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          booking_item_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          stripe_transfer_id?: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          booking_item_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          stripe_transfer_id?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_booking_item_id_fkey"
            columns: ["booking_item_id"]
            isOneToOne: false
            referencedRelation: "booking_items"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_credits: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          description: string | null
          expires_at: string | null
          id: string
          reason: Database["public"]["Enums"]["credit_reason"]
          used_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          reason: Database["public"]["Enums"]["credit_reason"]
          used_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["credit_reason"]
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_credits_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          nationality: string | null
          phone: string | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          nationality?: string | null
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          nationality?: string | null
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      provider_documents: {
        Row: {
          created_at: string
          file_url: string
          id: string
          name: string
          provider_id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["document_status"]
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          name: string
          provider_id: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          name?: string
          provider_id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_documents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_documents_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          business_name: string
          category_id: string | null
          created_at: string
          customer_phone: string | null
          destination_id: string | null
          full_address: string | null
          id: string
          legal_name: string | null
          location: string
          operating_hours: Json | null
          phone: string
          rejection_reason: string | null
          representative_name: string
          short_description: string
          status: Database["public"]["Enums"]["provider_status"]
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean
          tax_id: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          business_name: string
          category_id?: string | null
          created_at?: string
          customer_phone?: string | null
          destination_id?: string | null
          full_address?: string | null
          id?: string
          legal_name?: string | null
          location: string
          operating_hours?: Json | null
          phone: string
          rejection_reason?: string | null
          representative_name: string
          short_description: string
          status?: Database["public"]["Enums"]["provider_status"]
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          tax_id?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          business_name?: string
          category_id?: string | null
          created_at?: string
          customer_phone?: string | null
          destination_id?: string | null
          full_address?: string | null
          id?: string
          legal_name?: string | null
          location?: string
          operating_hours?: Json | null
          phone?: string
          rejection_reason?: string | null
          representative_name?: string
          short_description?: string
          status?: Database["public"]["Enums"]["provider_status"]
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          tax_id?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_profiles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_profiles_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_item_id: string
          comment: string | null
          created_at: string
          experience_id: string
          id: string
          is_flagged: boolean
          is_visible: boolean
          provider_responded_at: string | null
          provider_response: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_item_id: string
          comment?: string | null
          created_at?: string
          experience_id: string
          id?: string
          is_flagged?: boolean
          is_visible?: boolean
          provider_responded_at?: string | null
          provider_response?: string | null
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_item_id?: string
          comment?: string | null
          created_at?: string
          experience_id?: string
          id?: string
          is_flagged?: boolean
          is_visible?: boolean
          provider_responded_at?: string | null
          provider_response?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_item_id_fkey"
            columns: ["booking_item_id"]
            isOneToOne: true
            referencedRelation: "booking_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          booking_item_id: string
          created_at: string
          experience_id: string
          id: string
          provider_id: string
          provider_message: string | null
          qr_code: string
          quantity: number
          scanned_at: string | null
          service_date: string
          service_time: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_item_id: string
          created_at?: string
          experience_id: string
          id?: string
          provider_id: string
          provider_message?: string | null
          qr_code: string
          quantity?: number
          scanned_at?: string | null
          service_date: string
          service_time?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_item_id?: string
          created_at?: string
          experience_id?: string
          id?: string
          provider_id?: string
          provider_message?: string | null
          qr_code?: string
          quantity?: number
          scanned_at?: string | null
          service_date?: string
          service_time?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_booking_item_id_fkey"
            columns: ["booking_item_id"]
            isOneToOne: true
            referencedRelation: "booking_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: { Args: never; Returns: boolean }
      search_experiences: {
        Args: {
          available_date?: string
          cat_id?: string
          dest_id?: string
          max_price?: number
          min_price?: number
          min_rating?: number
          page_offset?: number
          page_size?: number
          search_query?: string
          sort_by?: string
          subcat_id?: string
        }
        Returns: {
          average_rating: number
          category_name: string
          cover_image_url: string
          destination_name: string
          duration_minutes: number
          id: string
          price_amount: number
          price_currency: string
          pricing_type: Database["public"]["Enums"]["pricing_type"]
          provider_name: string
          rank: number
          review_count: number
          short_description: string
          slug: string
          title: string
        }[]
      }
    }
    Enums: {
      booking_item_status:
        | "pending"
        | "confirmed"
        | "rejected"
        | "cancelled"
        | "completed"
      booking_status:
        | "pending_payment"
        | "paid"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "refunded"
        | "disputed"
      cancellation_policy: "flexible" | "moderate" | "strict"
      credit_reason:
        | "provider_cancellation"
        | "referral"
        | "promotion"
        | "dispute_resolution"
        | "manual"
      document_status: "pending" | "approved" | "rejected"
      document_type:
        | "government_id"
        | "proof_of_address"
        | "business_license"
        | "insurance"
        | "other"
      experience_status:
        | "draft"
        | "pending_review"
        | "active"
        | "paused"
        | "rejected"
        | "archived"
      notification_type:
        | "booking_created"
        | "booking_confirmed"
        | "booking_rejected"
        | "booking_cancelled"
        | "payment_received"
        | "payment_transferred"
        | "review_received"
        | "provider_approved"
        | "provider_rejected"
        | "experience_approved"
        | "experience_rejected"
        | "general"
      payment_status:
        | "pending"
        | "succeeded"
        | "failed"
        | "refunded"
        | "partially_refunded"
      payment_type: "charge" | "transfer" | "refund" | "platform_fee"
      pricing_type: "per_person" | "per_group" | "flat_rate"
      provider_status:
        | "pending_review"
        | "approved_incomplete"
        | "active"
        | "suspended"
        | "rejected"
      ticket_status: "active" | "used" | "expired" | "cancelled"
      user_role: "tourist" | "provider" | "admin"
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
    Enums: {
      booking_item_status: [
        "pending",
        "confirmed",
        "rejected",
        "cancelled",
        "completed",
      ],
      booking_status: [
        "pending_payment",
        "paid",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "refunded",
        "disputed",
      ],
      cancellation_policy: ["flexible", "moderate", "strict"],
      credit_reason: [
        "provider_cancellation",
        "referral",
        "promotion",
        "dispute_resolution",
        "manual",
      ],
      document_status: ["pending", "approved", "rejected"],
      document_type: [
        "government_id",
        "proof_of_address",
        "business_license",
        "insurance",
        "other",
      ],
      experience_status: [
        "draft",
        "pending_review",
        "active",
        "paused",
        "rejected",
        "archived",
      ],
      notification_type: [
        "booking_created",
        "booking_confirmed",
        "booking_rejected",
        "booking_cancelled",
        "payment_received",
        "payment_transferred",
        "review_received",
        "provider_approved",
        "provider_rejected",
        "experience_approved",
        "experience_rejected",
        "general",
      ],
      payment_status: [
        "pending",
        "succeeded",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      payment_type: ["charge", "transfer", "refund", "platform_fee"],
      pricing_type: ["per_person", "per_group", "flat_rate"],
      provider_status: [
        "pending_review",
        "approved_incomplete",
        "active",
        "suspended",
        "rejected",
      ],
      ticket_status: ["active", "used", "expired", "cancelled"],
      user_role: ["tourist", "provider", "admin"],
    },
  },
} as const
