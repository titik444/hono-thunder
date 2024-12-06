import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { response } from '../utils/response'
import { CreateBookmarkRequest, ListBookmarkRequest } from '../model/bookmark.model'
import { BookmarkService } from '../service/bookmark.service'
import { authMiddleware } from '../middleware/auth.middleware'
import { User } from '@prisma/client'

export const bookmarkController = new Hono<{ Variables: ApplicationVariables }>()

bookmarkController.post('/post/:postId/bookmark', authMiddleware, async (c) => {
  const user = c.get('user') as User

  const request: CreateBookmarkRequest = {
    post_id: Number(c.req.param('postId'))
  }

  const bookmarkResponse = await BookmarkService.create(user, request)

  return response(c, 201, 'Bookmark post success', bookmarkResponse)
})

bookmarkController.get('/bookmark', authMiddleware, async (c) => {
  const user = c.get('user') as User

  const request: ListBookmarkRequest = {
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const bookmarkResponse = await BookmarkService.list(user, request)

  return response(c, 200, 'List bookmark success', bookmarkResponse)
})

bookmarkController.delete('/post/:postId/bookmark', authMiddleware, async (c) => {
  const user = c.get('user') as User

  const postId = Number(c.req.param('postId'))

  const bookmarkResponse = await BookmarkService.remove(user, postId)

  return response(c, 200, 'Remove bookmark success', bookmarkResponse)
})
