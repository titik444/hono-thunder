import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { User } from '@prisma/client'
import {
  CreateCommentRequest,
  GetCommentRequest,
  ListCommentRequest,
  UpdateCommentRequest
} from '../model/comment.model'
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
  const user = c.get('user') as User
  const postId = Number(c.req.param('postId'))

  const request = (await c.req.json()) as CreateCommentRequest
  request.post_id = postId

  const commentResponse = await CommentService.create(user, request)

  return response(c, 201, 'Create comment success', commentResponse)
})

commentController.get('/post/:postId/comment/:commentId', async (c) => {
  const id = Number(c.req.param('commentId'))
  const postId = Number(c.req.param('postId'))

  const request: GetCommentRequest = {
    post_id: postId,
    id: id
  }

  const commentResponse = await CommentService.get(request)

  return response(c, 200, 'Detail comment success', commentResponse)
})

commentController.put('/post/:postId/comment/:commentId', authMiddleware, async (c) => {
  const user = c.get('user') as User
  const postId = Number(c.req.param('postId'))
  const id = Number(c.req.param('commentId'))

  const request: UpdateCommentRequest = {
    post_id: postId,
    id: id,
    content: (await c.req.json()).content
  }

  const commentResponse = await CommentService.update(user, request)

  return response(c, 200, 'Update comment success', commentResponse)
})

commentController.delete('/post/:postId/comment/:commentId', authMiddleware, async (c) => {
  const user = c.get('user') as User
  const postId = Number(c.req.param('postId'))
  const id = Number(c.req.param('commentId'))

  const request: GetCommentRequest = {
    post_id: postId,
    id: id
  }

  const commentResponse = await CommentService.remove(user, request)

  return response(c, 200, 'Remove comment success', commentResponse)
})
