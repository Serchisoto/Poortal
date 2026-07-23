import { z } from 'zod'

export const bookingItemSchema = z.object({
  experience_id: z.string().uuid(),
  availability_id: z.string().uuid().optional(),
  quantity: z.coerce.number().min(1, 'La cantidad minima es 1'),
  service_date: z.string().min(1, 'La fecha es requerida'),
  service_time: z.string().optional(),
})

export const createBookingSchema = z.object({
  items: z.array(bookingItemSchema).min(1, 'Agrega al menos una experiencia'),
})

export const cancelBookingSchema = z.object({
  booking_id: z.string().uuid(),
  booking_item_id: z.string().uuid().optional(),
  reason: z.string().min(5, 'Indica el motivo de cancelacion'),
})

export type BookingItemInput = z.infer<typeof bookingItemSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>
