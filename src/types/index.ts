export type { Database, Json } from './database'

import type { Database } from './database'

// Enum type aliases from Supabase-generated types
export type UserRole = Database['public']['Enums']['user_role']
export type ProviderStatus = Database['public']['Enums']['provider_status']
export type DocumentType = Database['public']['Enums']['document_type']
export type DocumentStatus = Database['public']['Enums']['document_status']
export type CancellationPolicy = Database['public']['Enums']['cancellation_policy']
export type ExperienceStatus = Database['public']['Enums']['experience_status']
export type PricingType = Database['public']['Enums']['pricing_type']
export type BookingStatus = Database['public']['Enums']['booking_status']
export type BookingItemStatus = Database['public']['Enums']['booking_item_status']
export type TicketStatus = Database['public']['Enums']['ticket_status']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type PaymentType = Database['public']['Enums']['payment_type']
export type NotificationType = Database['public']['Enums']['notification_type']
export type CreditReason = Database['public']['Enums']['credit_reason']

// Convenience type aliases for table rows
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Destination = Database['public']['Tables']['destinations']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Subcategory = Database['public']['Tables']['subcategories']['Row']
export type ProviderProfile = Database['public']['Tables']['provider_profiles']['Row']
export type Experience = Database['public']['Tables']['experiences']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingItem = Database['public']['Tables']['booking_items']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Cancellation = Database['public']['Tables']['cancellations']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type PlatformCredit = Database['public']['Tables']['platform_credits']['Row']
export type DestinationCollection = Database['public']['Tables']['destination_collections']['Row']
export type CollectionExperience = Database['public']['Tables']['collection_experiences']['Row']

// Composite type: collection with its experiences
export type CollectionWithExperiences = DestinationCollection & {
  collection_experiences: (CollectionExperience & {
    experiences: {
      id: string
      title: string
      slug: string
      short_description: string | null
      price_amount: number
      price_currency: string
      average_rating: number
      review_count: number
      duration_minutes: number | null
      experience_images: { url: string; is_cover: boolean }[]
    }
  })[]
}

// Search result type
export type ExperienceSearchResult = Database['public']['Functions']['search_experiences']['Returns'][number]
