import { z, ZodType } from 'zod'

export class LikeValidation {
  static readonly LIKE_POST: ZodType = z.object({
    post_id: z.number().positive(),
    user_id: z.number().positive()
  })

  static readonly LIKE_COMMENT: ZodType = z.object({
    comment_id: z.number().positive(),
    user_id: z.number().positive()
  })
}
