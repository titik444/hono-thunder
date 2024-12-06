import { Hono } from 'hono'
import { response } from '../utils/response'
import { UserService } from '../service/user.service'
import { GetUserRequest, UpdateUserRequest } from '../model/user.model'
import { ApplicationVariables } from '../model/app.model'
import { User } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.middleware'
import { uploadMiddleware } from '../middleware/upload.middleware'
import { profile } from 'winston'

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
