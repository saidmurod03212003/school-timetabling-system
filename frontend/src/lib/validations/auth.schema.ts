import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email manzilini kiriting')
    .email("Email manzil noto'g'ri formatda"),
  password: z
    .string()
    .min(1, 'Parolni kiriting')
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email manzilini kiriting')
    .email("Email manzil noto'g'ri formatda"),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z
      .string()
      .min(8, "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak")
      .regex(/[A-Z]/, 'Parolda kamida 1 ta katta harf bo\'lishi kerak')
      .regex(/[0-9]/, 'Parolda kamida 1 ta raqam bo\'lishi kerak'),
    confirmPassword: z.string().min(1, 'Parolni tasdiqlang'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parollar mos kelmaydi",
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
