import { Hono } from 'hono'
import { Role, User } from '@prisma/client'
import { ApplicationVariables } from '../model/app.model'
import { LoginUserRequest, RegisterUserRequest, toAuthResponse } from '../model/auth.model'
import { AuthService } from '../service/auth.service'
import { authMiddleware } from '../middleware/auth.middleware'
import { response } from '../utils/response'

export const authController = new Hono<{ Variables: ApplicationVariables }>()

authController.post('/auth/register', async (c) => {
  const request = (await c.req.json()) as RegisterUserRequest

  const registerResponse = await AuthService.register(request)

  return response(c, 201, 'Register user success', registerResponse)
})

authController.post('/auth/login', async (c) => {
  const request = (await c.req.json()) as LoginUserRequest

  const loginResponse = await AuthService.login(request)

  return response(c, 200, 'Login user success', loginResponse)
})

authController.get('/auth/check-token', authMiddleware, async (c) => {
  const user = c.get('user') as User & { role: Role }

  return response(c, 200, 'Check token success', toAuthResponse({ ...user, role: user.role }))
})
