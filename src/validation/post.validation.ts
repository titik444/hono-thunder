import { z, ZodType } from 'zod'

export class PostValidation {
  static readonly CREATE: ZodType = z.object({
    content: z.string().min(1),
    slug: z.string().min(1),
    image: z.string().min(1).optional()
  })

  static readonly GET: ZodType = z.object({
    slug: z.string().min(1),
    id: z.number().positive()
  })

  static readonly UPDATE: ZodType = z.object({
    slug: z.string().min(1),
    id: z.number().positive(),
    content: z.string().min(1),
    image: z.string().min(1).optional()
  })

  static readonly LIST: ZodType = z.object({
    slug: z.string().min(1),
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })
}
