import { Hono } from 'hono'
import { prisma } from './utils/prisma'
import { authController } from './controller/auth.controller'
import { roomController } from './controller/room.controller'
import { postController } from './controller/post.controller'
import { commentController } from './controller/comment.controller'
import { likeController } from './controller/like.controller'
import { bookmarkController } from './controller/bookmark.controller'

export const routes = (app: Hono) => {
  app.get('/health', async (c) => {
    try {
      await prisma.$connect()
      return c.json({
        status: true,
        statusCode: 200,
        message: 'OK'
      })
    } catch (err) {
      throw new Error(err as string)
    }
  })

  app.route('/api', authController)
  app.route('/api', roomController)
  app.route('/api', postController)
  app.route('/api', commentController)
  app.route('/api', likeController)
  app.route('/api', bookmarkController)
}
