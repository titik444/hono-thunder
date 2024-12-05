import { z, ZodType } from 'zod'

export class BookmarkValidation {
  static readonly CREATE: ZodType = z.object({
    post_id: z.number().positive(),
    user_id: z.number().positive()
  })

  static readonly LIST: ZodType = z.object({
    user_id: z.number().positive(),
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })
}
