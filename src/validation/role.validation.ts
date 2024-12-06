import { z, ZodType } from 'zod'

export class RoleValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100)
  })

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    name: z.string().min(1).max(100)
  })

  static readonly REMOVE: ZodType = z.number().positive()

  static readonly LIST: ZodType = z.object({
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })
}
