import { Hono } from 'hono'
import { response } from '../utils/response'
import { UserService } from '../service/user.service'
import { GetUserRequest, ListUserRequest, UpdateUserRequest } from '../model/user.model'
import { ApplicationVariables } from '../model/app.model'
import { User } from '@prisma/client'
import { adminMiddleware, authMiddleware } from '../middleware/auth.middleware'
import { uploadMiddleware } from '../middleware/upload.middleware'

export const userController = new Hono<{ Variables: ApplicationVariables }>()

userController.get('/user/:username', async (c) => {
  const request: GetUserRequest = {
    username: c.req.param('username')
  }

  const userResponse = await UserService.get(request)

  return response(c, 200, 'Get user success', userResponse)
})

userController.put(
  '/user/:username',
  authMiddleware,
  uploadMiddleware({ uploadDir: 'user', fileFieldName: 'profile_picture' }),
  async (c) => {
    const user = c.get('user') as User

    const formData = await c.req.formData()

    const request: UpdateUserRequest = {
      old_password: formData.get('old_password')?.toString() || undefined,
      new_password: formData.get('new_password')?.toString() || undefined,
      name: formData.get('name')?.toString() || undefined,
      profile_picture: c.get('uploadedFilePath') as unknown as string
    }

    const userResponse = await UserService.update(user, request)

    return response(c, 200, 'Update user success', userResponse)
  }
)

userController.get('/user', authMiddleware, adminMiddleware, async (c) => {
  const request: ListUserRequest = {
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const userResponse = await UserService.list(request)

  return response(c, 200, 'List user success', userResponse)
})

userController.delete('/user/:userId', authMiddleware, adminMiddleware, async (c) => {
  const userId = Number(c.req.param('userId'))

  const userResponse = await UserService.remove(userId)

  return response(c, 200, 'Remove user success', userResponse)
})
