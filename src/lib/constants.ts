export const APP_NAME = 'POORTAL'
export const APP_DESCRIPTION = 'Concierge Digital para Destinos Turisticos'

export const PLATFORM_FEE_PERCENTAGE = 15 // 15% platform fee

export const ROUTES = {
  // Public
  home: '/',
  explore: '/explore',
  tours: '/tours',
  tourDetail: (id: string) => `/tours/${id}`,
  party: '/party',
  nightlife: '/nightlife',
  sea: '/sea',
  rental: '/rental',
  culture: '/culture',
  sports: '/sports',
  stay: '/stay',
  shopping: '/shopping',
  wellness: '/wellness',
  food: '/food',
  destination: (slug: string) => `/destinations/${slug}`,
  destinationInfo: (slug: string) => `/destinations/${slug}/info`,
  destinationInfoCategory: (slug: string, category: string) => `/destinations/${slug}/info/${category}`,
  experience: (id: string) => `/experience/${id}`,
  cart: '/cart',
  // Auth
  login: '/login',
  register: '/register',
  // Tourist
  checkout: '/checkout',
  wallet: '/wallet',
  walletTicket: (bookingId: string) => `/wallet/${bookingId}`,
  bookings: '/bookings',
  profile: '/profile',
  // Provider
  providerDashboard: '/provider/dashboard',
  providerExperiences: '/provider/experiences',
  providerNewExperience: '/provider/experiences/new',
  providerEditExperience: (id: string) => `/provider/experiences/${id}/edit`,
  providerBookings: '/provider/bookings',
  providerAnalytics: '/provider/analytics',
  providerPayments: '/provider/payments',
  providerOnboarding: '/provider/onboarding',
  providerValidator: '/provider/validator',
  providerProfile: '/provider/profile',
  providerNotifications: '/provider/notifications',
  // Admin
  adminDashboard: '/admin/dashboard',
  adminProviders: '/admin/providers',
  adminExperiences: '/admin/experiences',
  adminUsers: '/admin/users',
  adminDestinations: '/admin/destinations',
  adminDisputes: '/admin/disputes',
  adminPayments: '/admin/payments',
  adminSettings: '/admin/settings',
} as const

// Route groups that require authentication
export const PROTECTED_ROUTES = [
  '/checkout',
  '/bookings',
  '/profile',
  '/provider',
  '/admin',
]

// Routes that require specific roles
export const ROLE_ROUTES: Record<string, string[]> = {
  provider: ['/provider'],
  admin: ['/admin'],
}

// Cancellation policy rules
export const CANCELLATION_RULES = {
  flexible: {
    full_refund_hours: 48,
    partial_refund_hours: 24,
    partial_refund_percentage: 50,
  },
  moderate: {
    full_refund_hours: 120, // 5 days
    partial_refund_hours: 48,
    partial_refund_percentage: 50,
  },
  strict: {
    full_refund_hours: 168, // 7 days
    partial_refund_hours: 0, // no partial
    partial_refund_percentage: 50,
  },
} as const
