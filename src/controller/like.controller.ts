import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { LikeCommentRequest, LikePostRequest } from '../model/like.model'
import { LikeService } from '../service/like.service'
import { response } from '../utils/response'
import { authMiddleware } from '../middleware/auth.middleware'

export const likeController = new Hono<{ Variables: ApplicationVariables }>()

likeController.post('/post/:postId/like', authMiddleware, async (c) => {
  const request: LikePostRequest = {
    post_id: Number(c.req.param('postId')),
    user_id: c.get('user').id as number
  }

  const likeResponse = await LikeService.likePost(request)

  return response(c, 200, 'Like post success', likeResponse)
})

likeController.delete('/post/:postId/like', authMiddleware, async (c) => {
  const request: LikePostRequest = {
    post_id: Number(c.req.param('postId')),
    user_id: c.get('user').id as number
  }

  const likeResponse = await LikeService.unlikePost(request)

  return response(c, 200, 'Unlike post success', likeResponse)
})

likeController.post('/comment/:commentId/like', authMiddleware, async (c) => {
  const request: LikeCommentRequest = {
    comment_id: Number(c.req.param('commentId')),
    user_id: c.get('user').id as number
  }

  const likeResponse = await LikeService.likeComment(request)

  return response(c, 200, 'Like comment success', likeResponse)
})

likeController.delete('/comment/:commentId/like', authMiddleware, async (c) => {
  const request: LikeCommentRequest = {
    comment_id: Number(c.req.param('commentId')),
    user_id: c.get('user').id as number
  }

  const likeResponse = await LikeService.unlikeComment(request)

  return response(c, 200, 'Unlike comment success', likeResponse)
})
