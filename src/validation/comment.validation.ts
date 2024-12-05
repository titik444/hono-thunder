import { z, ZodType } from 'zod'

export class CommentValidation {
  static readonly CREATE: ZodType = z.object({
    content: z.string().min(1),
    post_id: z.number().positive(),
    parent_id: z.number().positive().optional(),
    mentioned_username: z.string().min(1).optional()
  })

  static readonly GET: ZodType = z.object({
    post_id: z.number().positive(),
    id: z.number().positive()
  })

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    content: z.string().min(1),
    post_id: z.number().positive()
  })

  static readonly REMOVE: ZodType = z.object({
    post_id: z.number().positive(),
    id: z.number().positive()
  })

  static readonly LIST: ZodType = z.object({
    post_id: z.number().positive(),
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })
}
