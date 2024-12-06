import { z, ZodType } from 'zod'

export class UserValidation {
  static readonly GET: ZodType = z.object({
    username: z.string().min(1).max(100)
  })
  static readonly UPDATE: ZodType = z.object({
    password: z.string().min(1).max(100).optional(),
    name: z.string().min(1).max(100).optional(),
    profile_picture: z.string().min(1).max(100).optional()
  })
}
