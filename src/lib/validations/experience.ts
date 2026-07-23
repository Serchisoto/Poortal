import { z } from 'zod'

export const experienceSchema = z.object({
  title: z.string().min(5, 'El titulo debe tener al menos 5 caracteres'),
  slug: z.string().min(3, 'El slug es requerido'),
  description: z.string().min(20, 'La descripcion debe tener al menos 20 caracteres'),
  short_description: z.string().max(200, 'Maximo 200 caracteres').optional().or(z.literal('')),
  destination_id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i, 'Selecciona un destino'),
  category_id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i, 'Selecciona una categoria'),
  subcategory_id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i).optional().or(z.literal('')),
  highlights: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  meeting_point: z.string().optional().or(z.literal('')),
  duration_minutes: z.coerce.number().min(1, 'La duracion es requerida').optional(),
  max_capacity: z.coerce.number().min(1, 'La capacidad maxima es requerida'),
  min_capacity: z.coerce.number().min(1).optional(),
  pricing_type: z.enum(['per_person', 'per_group', 'flat_rate']),
  price_amount: z.coerce.number().min(0.01, 'El precio es requerido'),
  price_currency: z.string().default('MXN'),
  cancellation_policy: z.enum(['flexible', 'moderate', 'strict']),
})

export const availabilitySchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  start_time: z.string().min(1, 'La hora de inicio es requerida'),
  end_time: z.string().optional().or(z.literal('')),
  total_spots: z.coerce.number().min(1, 'Debe haber al menos 1 lugar disponible'),
  price_override: z.coerce.number().optional(),
})

export type ExperienceInput = z.infer<typeof experienceSchema>
export type AvailabilityInput = z.infer<typeof availabilitySchema>
