import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { User } from '@prisma/client'
import { CreateCommentRequest, ListCommentRequest } from '../model/comment.model'
import { CommentService } from '../service/comment.service'
import { response } from '../utils/response'
import { authMiddleware } from '../middleware/auth.middleware'

export const commentController = new Hono<{ Variables: ApplicationVariables }>()

commentController.get('/post/:postId/comment', async (c) => {
  const request: ListCommentRequest = {
    post_id: Number(c.req.param('postId')),
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const commentResponse = await CommentService.list(request)

  return response(c, 200, 'List comment success', commentResponse)
})

commentController.post('/post/:postId/comment', authMiddleware, async (c) => {
  const postId = Number(c.req.param('postId'))
  const user = c.get('user') as User
  const request = (await c.req.json()) as CreateCommentRequest
  request.post_id = postId

  const commentResponse = await CommentService.create(user, request)

  return response(c, 201, 'Create comment success', commentResponse)
})
