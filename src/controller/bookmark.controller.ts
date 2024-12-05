import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { response } from '../utils/response'
import { CreateBookmarkRequest, ListBookmarkRequest } from '../model/bookmark.model'
import { BookmarkService } from '../service/bookmark.service'
import { authMiddleware } from '../middleware/auth.middleware'

export const bookmarkController = new Hono<{ Variables: ApplicationVariables }>()

bookmarkController.post('/post/:postId/bookmark', authMiddleware, async (c) => {
  const request: CreateBookmarkRequest = {
    post_id: Number(c.req.param('postId')),
    user_id: c.get('user').id as number
  }

  const bookmarkResponse = await BookmarkService.create(request)

  return response(c, 200, 'Bookmark post success', bookmarkResponse)
})

bookmarkController.get('/bookmark', authMiddleware, async (c) => {
  const request: ListBookmarkRequest = {
    user_id: c.get('user').id as number,
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const bookmarkResponse = await BookmarkService.list(request)

  return response(c, 200, 'List bookmark success', bookmarkResponse)
})
