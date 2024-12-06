import { Hono } from 'hono'
import { User } from '@prisma/client'
import { ApplicationVariables } from '../model/app.model'
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware'
import { response } from '../utils/response'
import {
  ListPostRequest,
  CreatePostRequest,
  GetPostRequest,
  UpdatePostRequest,
  RemovePostRequest
} from '../model/post.model'
import { PostService } from '../service/post.service'
import { uploadMiddleware } from '../middleware/upload.middleware'

export const postController = new Hono<{ Variables: ApplicationVariables }>()

postController.get('/room/:slug/post', optionalAuthMiddleware, async (c) => {
  const user = c.get('user') as User

  const request: ListPostRequest = {
    slug: String(c.req.param('slug')),
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const postResponse = await PostService.list(user, request)

  return response(c, 200, 'List post success', postResponse)
})

postController.post(
  '/room/:slug/post',
  authMiddleware,
  uploadMiddleware({
    uploadDir: 'post',
    fileFieldName: 'image'
  }),
  async (c) => {
    const user = c.get('user') as User
    const slug = String(c.req.param('slug'))

    // Dapatkan path file dari middleware
    const imagePath = c.get('uploadedFilePath') as unknown as string

    // Parse form-data untuk field lainnya
    const formData = await c.req.formData()
    const content = formData.get('content')?.toString() || ''

    // Buat request untuk PostService
    const request: CreatePostRequest = {
      slug,
      content,
      image: imagePath
    }

    const postResponse = await PostService.create(user, request)

    return response(c, 201, 'Create post success', postResponse)
  }
)

postController.get('/room/:slug/post/:postId', optionalAuthMiddleware, async (c) => {
  const user = c.get('user') as User
  const slug = String(c.req.param('slug'))
  const postId = Number(c.req.param('postId'))

  const request: GetPostRequest = {
    slug,
    id: postId
  }

  const postResponse = await PostService.get(user, request)

  return response(c, 200, 'Get post success', postResponse)
})

postController.put(
  '/room/:slug/post/:postId',
  authMiddleware,
  uploadMiddleware({ uploadDir: 'post', fileFieldName: 'image' }),
  async (c) => {
    const user = c.get('user') as User
    const slug = String(c.req.param('slug'))
    const postId = Number(c.req.param('postId'))

    const formData = await c.req.formData()
    const content = formData.get('content')?.toString() || ''

    const request: UpdatePostRequest = {
      slug,
      content,
      id: postId,
      image: c.get('uploadedFilePath') as unknown as string
    }

    const postResponse = await PostService.update(user, request)

    return response(c, 200, 'Update post success', postResponse)
  }
)

postController.delete('/room/:slug/post/:postId', authMiddleware, async (c) => {
  const user = c.get('user') as User
  const slug = String(c.req.param('slug'))
  const postId = Number(c.req.param('postId'))

  const request: RemovePostRequest = {
    slug,
    id: postId
  }

  const postResponse = await PostService.remove(user, request)

  return response(c, 200, 'Remove post success', postResponse)
})
