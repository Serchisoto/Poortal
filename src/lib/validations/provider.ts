import { z } from 'zod'

// Step 1: Initial registration (9 fields)
export const providerRegistrationSchema = z.object({
  business_name: z.string().min(2, 'El nombre del negocio es requerido'),
  representative_name: z.string().min(2, 'El nombre del representante es requerido'),
  email: z.string().email('Correo electronico invalido'),
  phone: z.string().min(10, 'El telefono debe tener al menos 10 digitos'),
  location: z.string().min(2, 'La ubicacion es requerida'),
  category_id: z.string().uuid('Selecciona una categoria'),
  short_description: z.string().min(10, 'La descripcion debe tener al menos 10 caracteres').max(300, 'La descripcion no debe exceder 300 caracteres'),
  accept_terms: z.literal(true, {
    message: 'Debes aceptar los terminos y condiciones',
  }),
})

// Step 2: Complete profile (post-approval)
export const providerCompleteProfileSchema = z.object({
  legal_name: z.string().min(2, 'La razon social es requerida'),
  tax_id: z.string().optional().or(z.literal('')),
  full_address: z.string().min(5, 'La direccion completa es requerida'),
  customer_phone: z.string().min(10, 'El telefono de atencion es requerido'),
  website: z.string().url('URL invalida').optional().or(z.literal('')),
  operating_hours: z.string().optional(),
})

export type ProviderRegistrationInput = z.infer<typeof providerRegistrationSchema>
export type ProviderCompleteProfileInput = z.infer<typeof providerCompleteProfileSchema>
