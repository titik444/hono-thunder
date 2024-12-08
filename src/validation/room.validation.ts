import { z, ZodType } from 'zod'

export class RoomValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    category_id: z.number().positive(),
    parent_id: z.number().positive().optional()
  })

  static readonly GET: ZodType = z.number().positive()

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    name: z.string().min(1).max(100),
    category_id: z.number().positive(),
    parent_id: z.number().positive().optional()
  })
  static readonly REMOVE: ZodType = z.number().positive()

  static readonly LIST: ZodType = z.object({
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })
}
