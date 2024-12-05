import { z, ZodType } from 'zod'

export class CommentValidation {
  static readonly CREATE: ZodType = z.object({
    content: z.string().min(1),
    post_id: z.number().positive(),
    parent_id: z.number().positive().optional()
  })

  static readonly GET: ZodType = z.number().positive()

  static readonly LIST: ZodType = z.object({
    post_id: z.number().positive(),
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })
}
