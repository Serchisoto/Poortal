import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
  password: z.string().min(1, 'La contrasena es requerida'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electronico invalido'),
  phone: z.string().min(10, 'El telefono debe tener al menos 10 digitos').optional().or(z.literal('')),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
  confirm_password: z.string(),
  accept_terms: z.literal(true, {
    message: 'Debes aceptar los terminos y condiciones',
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Las contrasenas no coinciden',
  path: ['confirm_password'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electronico invalido'),
})

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().min(10, 'El telefono debe tener al menos 10 digitos').optional().or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),
  preferred_language: z.enum(['es', 'en']).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
