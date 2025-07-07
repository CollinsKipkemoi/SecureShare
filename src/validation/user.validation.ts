import * as z from "zod/v4"

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>