import { z } from 'zod'

export const reviewSchema = z.object({
  experience_id: z.string().uuid(),
  booking_item_id: z.string().uuid(),
  rating: z.coerce.number().min(1, 'La calificacion minima es 1').max(5, 'La calificacion maxima es 5'),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres').optional().or(z.literal('')),
})

export const providerResponseSchema = z.object({
  review_id: z.string().uuid(),
  provider_response: z.string().min(5, 'La respuesta debe tener al menos 5 caracteres'),
})

export type ReviewInput = z.infer<typeof reviewSchema>
export type ProviderResponseInput = z.infer<typeof providerResponseSchema>
